import { createClient, type Session } from '@supabase/supabase-js';
import type { ReportType, Song, SongReport } from '../types';
import {
  createDemoToneWavBlob,
  getLocalReports,
  getLocalSongs,
  getOfflineBlob,
  saveLocalReports,
  saveLocalSongs,
  saveOfflineBlob,
} from './localDb';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const STORAGE_BUCKET = (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET as string) || 'kazakh-worship';
const STORAGE_FOLDER = (import.meta.env.VITE_SUPABASE_STORAGE_FOLDER as string) || 'kwp-audio';
const GAS_WEBAPP_URL = (import.meta.env.VITE_GAS_WEBAPP_URL as string | undefined)?.trim() || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
export const isGasStorageConfigured = Boolean(GAS_WEBAPP_URL);

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const idx = result.indexOf(',');
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function base64ToBlob(base64Data: string, mimeType: string): Blob {
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL!, SUPABASE_KEY!)
  : null;

export async function fetchSongs(includePending = false): Promise<{ songs: Song[]; usingLocalFallback: boolean }> {
  const local = getLocalSongs();
  const filteredLocal = includePending
    ? local
    : local.filter((s) => s.status === 'published' && s.is_active);

  if (!supabase) {
    return {
      songs: filteredLocal,
      usingLocalFallback: true,
    };
  }

  let query = supabase
    .from('kwp_songs')
    .select('*')
    .order('created_at', { ascending: false });

  if (!includePending) {
    query = query.eq('is_active', true).eq('status', 'published');
  }

  const { data, error } = await query;
  if (error) {
    console.warn('Supabase kwp_songs fallback to local:', error.message);
    return {
      songs: filteredLocal,
      usingLocalFallback: true,
    };
  }

  const cloudSongs = (data as Song[]) || [];
  const cloudIds = new Set(cloudSongs.map((s) => s.id));
  const uniqueLocal = filteredLocal.filter((s) => !cloudIds.has(s.id));

  return { songs: [...cloudSongs, ...uniqueLocal], usingLocalFallback: false };
}

export async function uploadSong(params: {
  title: string;
  artist: string;
  isUnknownAuthor: boolean;
  lyrics: string;
  file?: File | null;
  externalUrl?: string;
  durationSeconds: number;
  isAdmin: boolean;
  lang?: 'kk' | 'ru';
  songKey?: string;
  uploaderEmail?: string | null;
}): Promise<{ song: Song; savedLocally: boolean }> {
  const cleanArtist = params.isUnknownAuthor || !params.artist.trim()
    ? 'Белгісіз автор (Unknown)'
    : params.artist.trim();
  const trimmedUrl = params.externalUrl?.trim() || '';
  const trimmedLyrics = params.lyrics.trim();
  const songLang = params.lang ?? 'kk';
  const cleanKey = params.songKey?.trim() || null;
  const nextStatus = params.isAdmin ? 'published' : 'pending';
  const nextActive = params.isAdmin;
  const uploadedBy = params.isAdmin ? 'developer' : params.uploaderEmail?.trim() || 'community';

  if (supabase) {
    try {
      let audioUrl = trimmedUrl;
      let storagePath: string | null = null;

      if (!audioUrl && params.file) {
        let uploadedViaGas = false;
        if (GAS_WEBAPP_URL) {
          try {
            // Try Google Drive via GAS Web App first ($0)
            const base64Data = await fileToBase64(params.file);
            const gasRes = await fetch(GAS_WEBAPP_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                fileName: params.file.name,
                mimeType: params.file.type || 'audio/mpeg',
                base64Data,
              }),
            });
            const gasJson = (await gasRes.json()) as { ok: boolean; fileId?: string; error?: string };
            if (gasJson.ok && gasJson.fileId) {
              audioUrl = `gdrive://${gasJson.fileId}`;
              storagePath = gasJson.fileId;
              uploadedViaGas = true;
            }
          } catch (gasErr) {
            console.warn('GAS upload failed, falling back to Supabase Storage:', gasErr);
          }
        }

        if (!uploadedViaGas) {
          const safeName = params.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          storagePath = `${STORAGE_FOLDER}/${Date.now()}-${safeName}`;

          const { error: uploadErr } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(storagePath, params.file, { cacheControl: '3600', upsert: false });

          if (uploadErr) throw uploadErr;

          const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
          audioUrl = urlData.publicUrl;
        }
      }

      if (!audioUrl && !trimmedLyrics) {
        throw new Error('Either audio or lyrics is required.');
      }

      const songId = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const { error: insertErr } = await supabase.from('kwp_songs').insert({
        id: songId,
        title: params.title.trim(),
        artist: cleanArtist,
        is_unknown_author: params.isUnknownAuthor || !params.artist.trim(),
        permission_note: 'Permitted for community worship sharing',
        audio_url: audioUrl,
        storage_path: storagePath,
        duration_seconds: Math.round(params.durationSeconds || 0),
        lyrics: trimmedLyrics || null,
        song_key: cleanKey,
        lang: songLang,
        uploaded_by: uploadedBy,
        status: nextStatus,
        is_active: nextActive,
        created_at: createdAt,
      });

      if (insertErr) throw insertErr;

      const insertedSong: Song = {
        id: songId,
        title: params.title.trim(),
        artist: cleanArtist,
        is_unknown_author: params.isUnknownAuthor || !params.artist.trim(),
        permission_note: 'Permitted for community worship sharing',
        audio_url: audioUrl,
        storage_path: storagePath,
        duration_seconds: Math.round(params.durationSeconds || 0),
        lyrics: trimmedLyrics || null,
        song_key: cleanKey,
        lang: songLang,
        play_count: 0,
        uploaded_by: uploadedBy,
        status: nextStatus,
        is_active: nextActive,
        created_at: createdAt,
      };
      if (params.file) {
        await saveOfflineBlob(insertedSong.id, params.file);
      }
      return { song: insertedSong, savedLocally: false };
    } catch (err) {
      console.warn('Cloud upload failed, saving to local IndexedDB:', err);
    }
  }

  // Local IndexedDB / localStorage fallback
  const id = `local-${Date.now()}`;
  if (params.file) {
    await saveOfflineBlob(id, params.file);
  }
  const newSong: Song = {
    id,
    title: params.title.trim(),
    artist: cleanArtist,
    is_unknown_author: params.isUnknownAuthor || !params.artist.trim(),
    permission_note: 'Permitted for community worship sharing',
    audio_url: trimmedUrl,
    duration_seconds: Math.round(params.durationSeconds || 0),
    lyrics: trimmedLyrics || null,
    song_key: cleanKey,
    lang: songLang,
    play_count: 0,
    uploaded_by: uploadedBy,
    status: nextStatus,
    is_active: nextActive,
    created_at: new Date().toISOString(),
  };

  const existing = getLocalSongs();
  saveLocalSongs([newSong, ...existing]);
  return { song: newSong, savedLocally: true };
}

export async function incrementSongPlay(songId: string): Promise<number | null> {
  if (supabase && !songId.startsWith('demo-') && !songId.startsWith('local-')) {
    const { data, error } = await supabase.rpc('kwp_increment_play', { target_song_id: songId });
    if (!error && typeof data === 'number') return data;
  }

  const local = getLocalSongs();
  let updatedCount: number | null = null;
  const next = local.map((s) => {
    if (s.id === songId) {
      updatedCount = s.play_count + 1;
      return { ...s, play_count: updatedCount };
    }
    return s;
  });
  saveLocalSongs(next);
  return updatedCount;
}

export async function submitReport(params: {
  songId?: string | null;
  songTitle: string;
  reportType: ReportType;
  reporterContact: string;
  message: string;
}): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('kwp_song_reports').insert({
      song_id: params.songId && !params.songId.startsWith('demo-') && !params.songId.startsWith('local-') ? params.songId : null,
      song_title: params.songTitle || 'General Message',
      report_type: params.reportType,
      reporter_contact: params.reporterContact.trim(),
      message: params.message.trim(),
    });
    if (!error) return;
  }

  const existing = getLocalReports();
  const newReport: SongReport = {
    id: `rep-${Date.now()}`,
    song_id: params.songId || null,
    song_title: params.songTitle || 'General Message',
    report_type: params.reportType,
    reporter_contact: params.reporterContact.trim(),
    message: params.message.trim(),
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  saveLocalReports([newReport, ...existing]);
}

export async function fetchAndCacheAudioBlob(song: Song): Promise<Blob> {
  const existing = await getOfflineBlob(song.id);
  if (existing) return existing;

  if (song.id.startsWith('demo-') || !song.audio_url) {
    const freq = song.id === 'demo-1' ? 261.63 : 329.63;
    const demoBlob = createDemoToneWavBlob(freq, 6);
    await saveOfflineBlob(song.id, demoBlob);
    return demoBlob;
  }

  if (song.audio_url.startsWith('gdrive://')) {
    if (!GAS_WEBAPP_URL) {
      throw new Error('VITE_GAS_WEBAPP_URL is not configured');
    }
    const fileId = song.audio_url.replace('gdrive://', '');
    const res = await fetch(`${GAS_WEBAPP_URL}?fileId=${encodeURIComponent(fileId)}`);
    const json = (await res.json()) as {
      ok: boolean;
      mimeType?: string;
      base64Data?: string;
      error?: string;
    };
    if (!json.ok || !json.base64Data) {
      throw new Error(json.error || 'Failed to download audio from Google Drive');
    }
    const blob = base64ToBlob(json.base64Data, json.mimeType || 'audio/mpeg');
    await saveOfflineBlob(song.id, blob);
    return blob;
  }

  let res: Response;
  try {
    res = await fetch(song.audio_url);
  } catch {
    res = await fetch(`/api/proxy-audio?url=${encodeURIComponent(song.audio_url)}`);
  }
  if (!res.ok) {
    throw new Error(`Failed to download audio (${res.status})`);
  }
  const blob = await res.blob();
  await saveOfflineBlob(song.id, blob);
  return blob;
}

export async function resolveAudioSource(song: Song): Promise<{ src: string; isObjectUrl: boolean }> {
  const cachedBlob = await getOfflineBlob(song.id);
  if (cachedBlob) {
    return { src: URL.createObjectURL(cachedBlob), isObjectUrl: true };
  }
  if (song.id.startsWith('demo-') || song.audio_url.startsWith('gdrive://')) {
    const blob = await fetchAndCacheAudioBlob(song);
    return { src: URL.createObjectURL(blob), isObjectUrl: true };
  }
  return { src: song.audio_url, isObjectUrl: false };
}

// --- Auth & Admin Management ---
export const ADMIN_EMAILS = ['junbaehyun.kz@gmail.com', 'wnsqo35@gmail.com'];

export function isAdminSession(session: Session | null): boolean {
  const email = session?.user?.email?.toLowerCase();
  return Boolean(email && ADMIN_EMAILS.includes(email));
}

export async function getAdminSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signInAdmin(email: string, password: string): Promise<{ session: Session | null; error: string | null }> {
  if (!supabase) return { session: null, error: 'Supabase not configured' };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { session: data.session, error: error?.message ?? null };
}

export async function signUpUser(
  email: string,
  password: string
): Promise<{ session: Session | null; needsEmailConfirmation: boolean; error: string | null }> {
  if (!supabase) return { session: null, needsEmailConfirmation: false, error: 'Supabase not configured' };
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { session: null, needsEmailConfirmation: false, error: error.message };
  }
  return {
    session: data.session,
    needsEmailConfirmation: Boolean(data.user && !data.session),
    error: null,
  };
}

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  return { error: error?.message ?? null };
}

export async function signOutAdmin(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function adminApproveSong(songId: string): Promise<void> {
  if (supabase && !songId.startsWith('local-')) {
    const { error } = await supabase
      .from('kwp_songs')
      .update({ status: 'published', is_active: true })
      .eq('id', songId);
    if (error) throw error;
    return;
  }
  const local = getLocalSongs().map((s) =>
    s.id === songId ? { ...s, status: 'published' as const, is_active: true } : s
  );
  saveLocalSongs(local);
}

export async function adminDeleteSong(songId: string, storagePath?: string | null): Promise<void> {
  if (supabase && !songId.startsWith('local-') && !songId.startsWith('demo-')) {
    const { error } = await supabase.from('kwp_songs').delete().eq('id', songId);
    if (error) throw error;
    if (storagePath && storagePath.startsWith(`${STORAGE_FOLDER}/`)) {
      await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
    }
    return;
  }
  const local = getLocalSongs().filter((s) => s.id !== songId);
  saveLocalSongs(local);
}

export async function adminFetchReports(): Promise<SongReport[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('kwp_song_reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) return data as SongReport[];
  }
  return getLocalReports();
}

export async function adminResolveReport(reportId: string): Promise<void> {
  if (supabase && !reportId.startsWith('rep-')) {
    await supabase.from('kwp_song_reports').update({ status: 'resolved' }).eq('id', reportId);
    return;
  }
  const updated = getLocalReports().map((r) => (r.id === reportId ? { ...r, status: 'resolved' as const } : r));
  saveLocalReports(updated);
}

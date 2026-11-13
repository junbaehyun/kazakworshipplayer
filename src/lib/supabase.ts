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

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL!, SUPABASE_KEY!)
  : null;

export async function fetchSongs(includePending = false): Promise<{ songs: Song[]; usingLocalFallback: boolean }> {
  if (!supabase) {
    const local = getLocalSongs();
    return {
      songs: includePending ? local : local.filter((s) => s.status === 'published' && s.is_active),
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
    const local = getLocalSongs();
    return {
      songs: includePending ? local : local.filter((s) => s.status === 'published' && s.is_active),
      usingLocalFallback: true,
    };
  }

  return { songs: (data as Song[]) || [], usingLocalFallback: false };
}

export async function uploadSong(params: {
  title: string;
  artist: string;
  isUnknownAuthor: boolean;
  lyrics: string;
  file: File;
  durationSeconds: number;
  isAdmin: boolean;
}): Promise<{ song: Song; savedLocally: boolean }> {
  const cleanArtist = params.isUnknownAuthor || !params.artist.trim()
    ? 'Белгісіз автор (Unknown)'
    : params.artist.trim();

  if (supabase) {
    try {
      const safeName = params.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${STORAGE_FOLDER}/${Date.now()}-${safeName}`;

      const { error: uploadErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, params.file, { cacheControl: '3600', upsert: false });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

      const { data: inserted, error: insertErr } = await supabase
        .from('kwp_songs')
        .insert({
          title: params.title.trim(),
          artist: cleanArtist,
          is_unknown_author: params.isUnknownAuthor || !params.artist.trim(),
          audio_url: urlData.publicUrl,
          storage_path: storagePath,
          duration_seconds: Math.round(params.durationSeconds || 0),
          lyrics: params.lyrics.trim() || null,
          uploaded_by: params.isAdmin ? 'developer' : 'community',
          status: 'published',
          is_active: true,
        })
        .select()
        .single();

      if (insertErr) throw insertErr;
      return { song: inserted as Song, savedLocally: false };
    } catch (err) {
      console.warn('Supabase upload failed, saving to local IndexedDB:', err);
    }
  }

  // Local IndexedDB fallback
  const id = `local-${Date.now()}`;
  await saveOfflineBlob(id, params.file);
  const newSong: Song = {
    id,
    title: params.title.trim(),
    artist: cleanArtist,
    is_unknown_author: params.isUnknownAuthor || !params.artist.trim(),
    permission_note: 'Permitted for community worship sharing',
    audio_url: '',
    duration_seconds: Math.round(params.durationSeconds || 0),
    lyrics: params.lyrics.trim() || null,
    play_count: 0,
    uploaded_by: params.isAdmin ? 'developer' : 'community',
    status: 'published',
    is_active: true,
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

export async function resolveAudioSource(song: Song): Promise<{ src: string; isObjectUrl: boolean }> {
  const cachedBlob = await getOfflineBlob(song.id);
  if (cachedBlob) {
    return { src: URL.createObjectURL(cachedBlob), isObjectUrl: true };
  }
  if (song.id.startsWith('demo-')) {
    const freq = song.id === 'demo-1' ? 261.63 : 329.63;
    const demoBlob = createDemoToneWavBlob(freq, 6);
    await saveOfflineBlob(song.id, demoBlob);
    return { src: URL.createObjectURL(demoBlob), isObjectUrl: true };
  }
  return { src: song.audio_url, isObjectUrl: false };
}

// --- Admin Auth & Management ---
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

export async function signOutAdmin(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function adminApproveSong(songId: string): Promise<void> {
  if (supabase && !songId.startsWith('local-')) {
    await supabase.from('kwp_songs').update({ status: 'published', is_active: true }).eq('id', songId);
    return;
  }
  const local = getLocalSongs().map((s) => (s.id === songId ? { ...s, status: 'published' as const, is_active: true } : s));
  saveLocalSongs(local);
}

export async function adminDeleteSong(songId: string): Promise<void> {
  if (supabase && !songId.startsWith('local-') && !songId.startsWith('demo-')) {
    await supabase.from('kwp_songs').delete().eq('id', songId);
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

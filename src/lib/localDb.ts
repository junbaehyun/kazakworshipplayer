import defaultSongsData from '../data/defaultSongs.json';
import type { Song, SongReport } from '../types';

const DB_NAME = 'kwp_offline_db';
const DB_VERSION = 1;
const BLOB_STORE = 'offline_blobs';
const PLAY_COUNTS_KEY = 'kwp_play_counts_v1';
const CUSTOM_SONGS_KEY = 'kwp_custom_songs_v1';
const DELETED_IDS_KEY = 'kwp_deleted_song_ids_v1';
const WEEKLY_RESET_KEY = 'kwp_weekly_chart_reset_at';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const REPORTS_KEY = 'kwp_local_reports_v1';

interface OfflineBlobRecord {
  id: string;
  blob: Blob;
  size: number;
  savedAt: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(BLOB_STORE)) {
        db.createObjectStore(BLOB_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveOfflineBlob(songId: string, blob: Blob): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BLOB_STORE, 'readwrite');
    tx.objectStore(BLOB_STORE).put({
      id: songId,
      blob,
      size: blob.size,
      savedAt: Date.now(),
    } satisfies OfflineBlobRecord);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineBlob(songId: string): Promise<Blob | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BLOB_STORE, 'readonly');
    const req = tx.objectStore(BLOB_STORE).get(songId);
    req.onsuccess = () => {
      const record = req.result as OfflineBlobRecord | undefined;
      resolve(record ? record.blob : null);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function removeOfflineBlob(songId: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BLOB_STORE, 'readwrite');
    tx.objectStore(BLOB_STORE).delete(songId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function listOfflineIds(): Promise<{ ids: string[]; totalBytes: number }> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BLOB_STORE, 'readonly');
    const req = tx.objectStore(BLOB_STORE).getAll();
    req.onsuccess = () => {
      const records = (req.result as OfflineBlobRecord[]) || [];
      resolve({
        ids: records.map((r) => r.id),
        totalBytes: records.reduce((sum, r) => sum + (r.size || 0), 0),
      });
    };
    req.onerror = () => reject(req.error);
  });
}

export async function clearAllOfflineBlobs(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BLOB_STORE, 'readwrite');
    tx.objectStore(BLOB_STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Generate a gentle, valid WAV audio blob for local demo songs when no MP3 is uploaded yet
export function createDemoToneWavBlob(freqHz = 261.63, seconds = 6): Blob {
  const sampleRate = 22050;
  const numSamples = sampleRate * seconds;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.min(1, t * 2) * Math.min(1, (seconds - t) * 2);
    const wave =
      0.22 * Math.sin(2 * Math.PI * freqHz * t) +
      0.14 * Math.sin(2 * Math.PI * (freqHz * 1.25) * t) +
      0.1 * Math.sin(2 * Math.PI * (freqHz * 1.5) * t);
    const sample = Math.max(-1, Math.min(1, wave * envelope));
    view.setInt16(44 + i * 2, sample * 32767, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

const DEFAULT_LOCAL_SONGS: Song[] = defaultSongsData as Song[];
let extraRuSongsCache: Song[] = [];
let extraRuSongsPromise: Promise<Song[]> | null = null;

export async function ensureExtraSongsLoaded(): Promise<Song[]> {
  if (extraRuSongsCache.length > 0) return extraRuSongsCache;
  if (!extraRuSongsPromise) {
    extraRuSongsPromise = import('../data/ruExtraSongs.json')
      .then((mod) => {
        extraRuSongsCache = (mod.default ?? mod) as Song[];
        return extraRuSongsCache;
      })
      .catch((err) => {
        console.warn('Failed to load extra Russian songs:', err);
        return [];
      });
  }
  return extraRuSongsPromise;
}

function getBaseCatalog(): Song[] {
  return extraRuSongsCache.length > 0
    ? [...DEFAULT_LOCAL_SONGS, ...extraRuSongsCache]
    : DEFAULT_LOCAL_SONGS;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getWeeklyChartInfo(): { lastResetAt: number; nextResetAt: number } {
  try {
    const raw = localStorage.getItem(WEEKLY_RESET_KEY);
    const parsed = raw ? Number(raw) : NaN;
    const lastResetAt = Number.isFinite(parsed) && parsed > 0 ? parsed : Date.now();
    if (!raw || !Number.isFinite(parsed) || parsed <= 0) {
      localStorage.setItem(WEEKLY_RESET_KEY, String(lastResetAt));
    }
    return { lastResetAt, nextResetAt: lastResetAt + WEEK_MS };
  } catch {
    const now = Date.now();
    return { lastResetAt: now, nextResetAt: now + WEEK_MS };
  }
}

export function resetWeeklyChartPlays(): Song[] {
  try {
    localStorage.setItem(PLAY_COUNTS_KEY, '{}');
    localStorage.setItem(WEEKLY_RESET_KEY, String(Date.now()));
  } catch {
    // ignore storage errors
  }
  return getLocalSongs();
}

export function getLocalSongs(): Song[] {
  const base = getBaseCatalog();
  try {
    const { lastResetAt } = getWeeklyChartInfo();
    if (Date.now() - lastResetAt >= WEEK_MS) {
      localStorage.setItem(PLAY_COUNTS_KEY, '{}');
      localStorage.setItem(WEEKLY_RESET_KEY, String(Date.now()));
    }

    const playCounts = readJson<Record<string, number>>(PLAY_COUNTS_KEY, {});
    const customSongs = readJson<Song[]>(CUSTOM_SONGS_KEY, []);
    const deletedIds = new Set(readJson<string[]>(DELETED_IDS_KEY, []));

    const customById = new Map(customSongs.map((s) => [s.id, s]));
    const baseIds = new Set(base.map((s) => s.id));

    const mergedCustom = customSongs
      .filter((s) => !baseIds.has(s.id) && !deletedIds.has(s.id))
      .map((s) => ({ ...s, play_count: playCounts[s.id] ?? s.play_count ?? 0 }));

    const mergedBase = base
      .filter((s) => !deletedIds.has(s.id))
      .map((s) => {
        const override = customById.get(s.id);
        const baseSong = override ?? s;
        const count = playCounts[s.id];
        return count !== undefined ? { ...baseSong, play_count: count } : baseSong;
      });

    return [...mergedCustom, ...mergedBase];
  } catch {
    return base;
  }
}

export function saveLocalSongs(songs: Song[]): void {
  const base = getBaseCatalog();
  const baseById = new Map(base.map((s) => [s.id, s]));
  const nextIds = new Set(songs.map((s) => s.id));

  const playCounts: Record<string, number> = {};
  const customSongs: Song[] = [];

  for (const s of songs) {
    if ((s.play_count || 0) > 0) {
      playCounts[s.id] = s.play_count;
    }
    const orig = baseById.get(s.id);
    if (!orig) {
      customSongs.push(s);
    } else if (
      s.status !== orig.status ||
      s.is_active !== orig.is_active ||
      s.title !== orig.title ||
      s.lyrics !== orig.lyrics ||
      s.artist !== orig.artist
    ) {
      customSongs.push(s);
    }
  }

  const deletedIds = base.filter((s) => !nextIds.has(s.id)).map((s) => s.id);

  try {
    localStorage.setItem(PLAY_COUNTS_KEY, JSON.stringify(playCounts));
    localStorage.setItem(CUSTOM_SONGS_KEY, JSON.stringify(customSongs));
    localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(deletedIds));
  } catch (err) {
    console.warn('saveLocalSongs storage warning:', err);
  }
}

export function getLocalReports(): SongReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    return raw ? (JSON.parse(raw) as SongReport[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalReports(reports: SongReport[]): void {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

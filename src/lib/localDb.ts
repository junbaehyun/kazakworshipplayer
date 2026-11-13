import type { Song, SongReport } from '../types';

const DB_NAME = 'kwp_offline_db';
const DB_VERSION = 1;
const BLOB_STORE = 'offline_blobs';
const SONGS_KEY = 'kwp_local_songs_v1';
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

const DEFAULT_LOCAL_SONGS: Song[] = [
  {
    id: 'demo-1',
    title: 'Ұлы Құдай (Demo)',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Permitted for community worship sharing',
    audio_url: '',
    duration_seconds: 6,
    lyrics: 'Ұлы Құдай, Сені мадақтаймыз,\nЖүректен шыққан алғысты айтамыз.\nАспан мен жер Сенің даңқыңа толы,\nМәңгілік Патшамыз Сенсің, Иеміз!',
    play_count: 124,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Алғыс айтамын Саған (Demo)',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Permitted for community worship sharing',
    audio_url: '',
    duration_seconds: 6,
    lyrics: 'Алғыс айтамын Саған, Жаратушым,\nӘрбір таңым үшін, берген тынысың үшін.\nҚайғыда да, қуанышта да,\nСенің рақымың мені қорғайды.',
    play_count: 98,
    uploaded_by: 'community',
    status: 'published',
    is_active: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function getLocalSongs(): Song[] {
  try {
    const raw = localStorage.getItem(SONGS_KEY);
    if (!raw) {
      localStorage.setItem(SONGS_KEY, JSON.stringify(DEFAULT_LOCAL_SONGS));
      return DEFAULT_LOCAL_SONGS;
    }
    return JSON.parse(raw) as Song[];
  } catch {
    return DEFAULT_LOCAL_SONGS;
  }
}

export function saveLocalSongs(songs: Song[]): void {
  localStorage.setItem(SONGS_KEY, JSON.stringify(songs));
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

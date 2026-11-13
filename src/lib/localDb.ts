import type { Song, SongReport } from '../types';

const DB_NAME = 'kwp_offline_db';
const DB_VERSION = 1;
const BLOB_STORE = 'offline_blobs';
const SONGS_KEY = 'kwp_local_songs_v4';
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
    id: 'song-5855',
    title: 'Жаратқан жерді де, аспанды да (Жетеле мені, жетеле)',
    artist: 'Шынтеміров Әбілхайыр',
    is_unknown_author: false,
    permission_note: 'Top #1 Kazakh worship (#5855 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Shetele%20meni.mp3',
    storage_path: null,
    duration_seconds: 220,
    lyrics:
      'Жаратқан жерді де, аспанды да.\nШын сүйіп бас ием Құдайыма.\nАдамзат күнәдан арылсын деп\nЖіберді Өз Ұлы Исаны да.\n\nЖетеле мені, жетеле,\nҒажайып жұмақ төріне.\nРухыңды берсең кеудеме,\nМәңгілік құлмын Өзіңе.\nӨзіңе ғана бағынам,\nӨзіңе ғана табынам.\nӨзіңнен артық панам жоқ,\nҚұдайым Саған сиынам.\n\nАдасып көп жылдар шаршадым мен,\nСонда да тыныштық таппадым мен.\nСол сәтте Құдайды ойға алып едім\nБақытқа кенеліп шаттандым мен.\n\nОқыдым Киелі кітабыңды.\nЖүрегім азаптан құтқарылды.\nҰмыттым қайғы мен азабымды,\nӨйткені таныдым Құдайымды.',
    play_count: 260,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5873',
    title: 'Әр күнде Иса маған қажетсің',
    artist: 'Eddie Espinosa (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #3 Kazakh worship (#5873 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Ar%20kunde%20Isa%20magan%20kazhetsin.mp3',
    storage_path: null,
    duration_seconds: 168,
    lyrics:
      'Әр күнде Иса маған қажетсің,\nКүн сайын Иса маған қажетсің.\nКүнделікті нандай, күнделікті нандай Сен керексің.\nСенің Сөзің маған әр күн қажет.\n\nМен шаршадым, мен мұңайдым,\nМен адастым Сенсіз Иса.',
    play_count: 240,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5856',
    title: 'Жүрегімді өзгертші Тәңір',
    artist: 'Eddie Espinosa',
    is_unknown_author: false,
    permission_note: 'Top #4 Kazakh worship (#5856 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Abukhair%2006.mp3',
    storage_path: null,
    duration_seconds: 203,
    lyrics:
      'Жүрегімді өзгертші Тәңір,\nАдал ете гөр.\nЖүрегімді өзгертші Тәңір,\nСендей ете гөр.\n\nСен – Шеберсің, балшықпын мен,\nӨзің құйшы, сұраймын мен.',
    play_count: 225,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5997',
    title: 'Осы әлемде мен жүрдім (Киелі Құдай)',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #5 Kazakh worship (#5997 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Osy%20elemde%20men%20zhurdym%20%20osoboe%20mnenie_.mp3',
    storage_path: null,
    duration_seconds: 237,
    lyrics:
      'Осы әлемде мен жүрдім, мәнін білмей өмірдің.\nӨтірікке сеніппін, жалған сөзге еріппін.\nСонда Сені мен көрдім, жарық нұр боп көріндің,\nКүнәларым кешіріп, бақыт бердің өмірге!\n\nКиелі, Киелі Құдай!\nСен менің жүрегімдесің,\nСен менің көңілімдесің,\nСен менің өмірімдесің Иса!\n\nҚуанамын мен бүгін, бақыттымын мәңгілік!\nЖүрегімде ән салып, шырқаймын мен ән салып.\nМадақтаймын мен Сені, сүйем Сені Тәңірім!\nӘрбір басқан қадамым Сенің қолыңда бүгін!',
    play_count: 210,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5859',
    title: 'Жолымдағы жарық жұлдыздай',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #6 Kazakh worship (#5859 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Zholimdagi%20sharyk%20shuldysdai%201.mp3',
    storage_path: null,
    duration_seconds: 292,
    lyrics:
      'Жолымдағы жарық жұлдыздай\nЖүрегімнің нұры Өзіңсің.\nҚараңғыда адасып қалмай\nӨзіңе мен еріп келемін.\n\nЖетелеші мені Тәңірім,\nНұрыңа Сен бөлей гөр мені.\nӨзің болдың өмір тірегім,\nМәңгілікке сүйемін Сені.\n\nКөңілімнің шаттығы Сенсің,\nЖанымның Сен жұбанышысың.\nӨмірімнің мәні бір Өзің,\nЖаратушым, Құтқарушымсың.',
    play_count: 195,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5989',
    title: 'Мені қолдайсың Құдайым',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #7 Kazakh worship (#5989 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Meni%20koldaisin.mp3',
    storage_path: null,
    duration_seconds: 263,
    lyrics:
      'Мені қолдайсың Құдайым әр күнде,\nСенің қалауың менің өмірімде.\nБасыма қандай сынақ түссе дағы,\nСенің рақымың менімен мәңгіге.\n\nСен менің панамсың, таусылмас күшімсің,\nЖүрегімді билеген жалғыз Үмітімсің.\nМадақтаймын Сені, бар дауыспен ән салам,\nТәңірім Иса, мен Саған бағынам!',
    play_count: 185,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6040',
    title: 'Таң атқанда',
    artist: 'Ыдырыс',
    is_unknown_author: false,
    permission_note: 'Top #8 Kazakh worship (#6040 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/09%20Tan_%20atk_anda.mp3',
    storage_path: null,
    duration_seconds: 311,
    lyrics:
      'Таң атқанда оянып, Сені шақырам,\nҚуанып мен ән салам. Сені жырлаймын.\n\nАңсайсың Сен менің жырымды,\nСаған арналған өмірімді.\nКүні бойы Сені мақтаймын,\nМахаббатыңды жариялаймын.\nО, Иса! (О, Иса) О, Иса! Иса! О, Иса,\nДәл қазір келші маған,\nСағындым мен.\n\nСені сүйем, мен бас ием, Тәңірім-ай!',
    play_count: 175,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-9685',
    title: 'Тәңірді мадақта (Он мың себеп)',
    artist: 'Jonas Myrin, Matt Redman (Ауд. Нұржан Төлеген)',
    is_unknown_author: false,
    permission_note: 'Top #9 Kazakh worship (#9685 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/10%20On%20myn_%20sebep..Track%2010.mp3',
    storage_path: null,
    duration_seconds: 279,
    lyrics:
      'Тәңірді мадақта жан-дүнием!\nКиелі есімін!\nБар дауыспен мадақта жан-дүнием!\nТәңірді мадақта!\n\nТамаша арайлы таң атты,\nТәңірім ғажап күн жаратты.\nОсынау керемет рақымы үшін,\nАрнайық біз мадақты.\n\nРақымың мен махаббатың шексіз,\nТәңірім Сен ұлысың.\nОн мың себеп те аз болар маған\nМәңгі айтар жырымсың!\n\nҚуатым кеміп сарқылған күні,\nАжалым жетіп ақырғы.\nЖан-дүнием Сені жырлайды тағы,\nМәңгілікке Атыңды!\n\nТәңірді мадақта жан-дүнием!\nКиелі есімін!\nБар дауыспен мадақта жан-дүнием!\nТәңірді мадақта!\nТәңірді мадақта!\nТәңірді мадақта!',
    play_count: 165,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5888',
    title: 'Келемін Саған Жаратушым',
    artist: 'Эва-Лена Хеллмарк',
    is_unknown_author: false,
    permission_note: 'Top #10 Kazakh worship (#5888 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/kaelaem_n%20s_n.mp3',
    storage_path: null,
    duration_seconds: 244,
    lyrics:
      'Келемін Саған Жаратушым\nСенің шексіз махаббатың,\nТаусылмайды рақымың.\n\nҰлысың Сен,\nСен ғажайып ұлысың.\nСенен артық ешкім жоқ,\nСаған ешкім тең келмес.\n\nКелемін Саған, аңсап Сені.\nЖүрегімді жадыратшы,\nМәңгілікке жасашы.',
    play_count: 158,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-9679',
    title: 'Патшалық, салтанат',
    artist: 'Chris Tomlin, Jesse Reeves, Ed Cash (Ауд. Нұржан Төлеген)',
    is_unknown_author: false,
    permission_note: 'Top #11 Kazakh worship (#9679 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/04%20Patshalyk_%20saltanat%20Track%204.mp3',
    storage_path: null,
    duration_seconds: 232,
    lyrics:
      'Патшалық салтанат\nҰлылық жарқырап\nБәрі ән салсын\nҒаламға жар салсын!\nӨзін нұрға бөлеп\nЖасырынды түнек\nЕстіп үнін Оның,\nЕстіп үнін Оның\n\nИеміз - ұлы!\nӘнге сал бірге, Ол - ұлы!\nБарлығы көрсін,\nБілсін Ол - ұлы!\n\nҒасырдан ғасырға\nБарлығы қолында\nБасы Ол соңы да, басы Ол соңы да\nҮшбірліктегі Ол\nӘке Рух және Ұл\n«Арыстан» да Өзі\nКелген болып «Қозы»\n\nЕсімі ең жоғары\nБар мадаққа лайықты,\nЖан дүнием жырласын,\nОл - ұлы!',
    play_count: 152,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-103021',
    title: 'Жас кезімнен мені сақтап жүрдің Сен',
    artist: 'Белгісіз автор (Шаттан 2016)',
    is_unknown_author: true,
    permission_note: 'External MP3 link test (#103021)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/07%20Zhas%20kezimnen%20meni%20sak_tap%20zhurdin_%20Sen%20Track%207%201.mp3',
    storage_path: null,
    duration_seconds: 377,
    lyrics:
      '[V1]\nЖас кезімнен мені сақтап тұрдың Сен,\nӨмірімнің қиындығын көріп е(ді)ң.\nАзат еттің сол қиындық кезеңнен,\nАлғысымды жеткіземін әніммен.\n\n[C1]\n// Жан Ә--кем! Мейірімді Әкем!\nСа-ғын-дым мен Сені, мейірім-ді Әкем! //\n\n[V2]\nӘрқашанда ойымда Сен тұрасың,\nЖаңа өмір сыйлап мені қуанттың.\nБұл өмірде Сенің асыл Сөзіңе,\nОрын берем жүрегімнің төрінен.',
    play_count: 132,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5887',
    title: 'Кел, кел бізге Имануил',
    artist: 'Дамира Мусаева',
    is_unknown_author: false,
    permission_note: 'Test track from worshipleaderapp.com (#5887)',
    audio_url: 'gdrive://1HOiGn1spawD9U_qIrNOC66u4i5qj4LFd',
    storage_path: '1HOiGn1spawD9U_qIrNOC66u4i5qj4LFd',
    duration_seconds: 159,
    lyrics:
      'Кел, кел бізге, Имануил,\nҚұдай бізбен бірге Имануил.\nКүтеміз біз сені, Имануил,\nТәңір бізбен бірге - Имануил.\n\n// Шаттан, шаттан, шаттан Қазақстан,\nИмануел саған келмек //',
    play_count: 150,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
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

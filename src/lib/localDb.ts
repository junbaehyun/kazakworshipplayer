import type { Song, SongReport } from '../types';

const DB_NAME = 'kwp_offline_db';
const DB_VERSION = 1;
const BLOB_STORE = 'offline_blobs';
const SONGS_KEY = 'kwp_local_songs_v9';
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
    play_count: 0,
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
    play_count: 0,
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
    play_count: 0,
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
    play_count: 0,
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
    play_count: 0,
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
    play_count: 0,
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
    play_count: 0,
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
    play_count: 0,
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
    play_count: 0,
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
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5828',
    title: 'Барлық аспан',
    artist: 'Noel Richards, Tricia Richards',
    is_unknown_author: false,
    permission_note: 'Top #12 Kazakh worship (#5828 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Barlikaspan.mp3',
    storage_path: null,
    duration_seconds: 266,
    lyrics:
      'Барлық аспан атыңды мадақтайды Ием.\nСенің көркің немен теңеседі екен.\n\nМәңгі отырасың (Мәңгі отырасың)\nЖарқыраған тақта. (Жарқыраған тақта.)\nТек Сенің алдыңда (Тек Сенің алдыңда)\nТізе бүгемін мен !\n\nМадақтаймын Сенің даңқыңды жан Ием,\nСен біз үшін өміріңді құрбан еттің.\n\nАялаймын Сенің Сөзіңді жан Ием.\nЖаратушым, бір Өзіңе дұға етем.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-7681',
    title: 'Атың Мадақталсын',
    artist: 'Matt & Beth Redman (Ауд. Нұржан Төлеген)',
    is_unknown_author: false,
    permission_note: 'Top #13 Kazakh worship (#7681 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/01%20Track%201.mp3',
    storage_path: null,
    duration_seconds: 220,
    lyrics:
      'Атың мадақталсын\nОрман тауым көлімде\nЖер мен аспан төрінде\nАтың мадақталсын!\n\nАтың мадақталсын\nШексіз мына ғаламда\nЖүрегім ой санамда\nАтың мадақталсын!\n\nӘрбір атқан таңым үшін мадақтаймын\nЕсіміңді бар әлемге жариялаймын!\n\nАтың мадақталсын Тәңір\nМәңгі мадақталсын\nӨзіңмен ғажап біздің өмір\nКиелі есімің даңқталсын!\n\nАтың Мадақталсын\nБиік шыңға жетсем де\nТерең құзға кетсем де\nАтың Мадақталсын\n\nАтың мадақталсын\nҚандай сыннан өтсемде\nШаттыққа кенелсем де\nАтың мадақталсын\n\n// Беретін де Сенсің Ием! алатын да Сенсің Ием!\nҚұдіретің мен еркіңе, мен басымды Ием! //',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5959',
    title: 'Құрметтеймін Сені балаңдай',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #15 Kazakh worship (#5959 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/05%20K_u_rmetteimin%20Seni%20balan_dai%20Track%2005.mp3',
    storage_path: null,
    duration_seconds: 231,
    lyrics:
      'Құрметтеймін Сені балаңдай,\nМадақтаймын әнменен тынбай.\nЖар болшы маған Тәңір,\nАдалсың Сен мәңгі.\n\nҚараңғыдан шығарған,\nРақымын мол сыйлаған,\nКүнәмді кешіріп, өлімнен мені құтқарған.\n\nҚұтқарушым менің, мен Сені сүйемін.\nСаған мәңгі ризамын.\nЖан-тәніммен Сені, Иса, жалғыз Сені,\nМен мадақтаймын!\n\nҚұтқарушым менің, мен Сені сүйемін.\nКешірші деп сұраймын.\nМейірімді Иемді, жақсы адал Иемді,\nМәңгі жырлаймын, мәңгі жырлаймын.\n\nӘн саламын қуанғанымнан,\nЕшқашан кетпеші жанымнан.\nПанам болшы, О, Тәңір,\nАдалсын Сен мәңгі.\n\nТіршілікті жаратқан,\nОйын іске асырған.\nӨзін құрметтеген адамға\nЖаны ашыған.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5964',
    title: 'Қайғы тартып қиналғанда',
    artist: 'Шынтеміров Әбілхайыр',
    is_unknown_author: false,
    permission_note: 'Top #16 Kazakh worship (#5964 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/KaigitartipKinalganda.mp3',
    storage_path: null,
    duration_seconds: 166,
    lyrics:
      'Қайғы тартып қиналғанда\nЖол таба алмай адасқанда,\nБір Өзіңе келдім Әке,\nКөрінбейтін болсаң да.\n\nҚараңғыда жатқанымда,\nКүнәға әбден батқанымда\nБар екенсің сездім Әке,\nКөрінбейтін болсаң да.\n\nКөрінбейтін Көктегі Әке,\nБір Өзіңе сиынамын мен.\nЖүрегімнен шыққан осы әніммен,\nБар әлемді жаратқан Ием,\nАспаннан нан жаудыртқан Ием,\n// Көрінбейтін Көктегі менің Әкем. //\n\nЖан жүрегім жылағанда,\nӘлсізденіп құлағанда,\nҰмтыламын Саған Әке,\nКөрінбейтін болсаң да.\n\nӨзің мені құтқарғанда,\nКөңілімді жұбатқанда.\nБасымды идім Саған Әке,\nКөрінбейтін болсаң да.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5946',
    title: 'Қымбатсың Сен маған әр күнде',
    artist: 'Майя Рахимгалиева',
    is_unknown_author: false,
    permission_note: 'Top #17 Kazakh worship (#5946 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/KimbatsinSen.mp3',
    storage_path: null,
    duration_seconds: 256,
    lyrics:
      '// Қымбатсың Сен маған әр күнде,\nҚымбатсың Сен әрқашан күтем Сені Иса, жүрегім аңсайды Сені.\nСенімен боламын мәңгіге! //\n\n// Мен Саған өмірімді арнаймын,\nИса, мені Сен қолданшы.\nӘр күнде Сөзіңе ұмтыламын,\nТәңірім Саған мен сенемін. //',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6014',
    title: 'Сен, Тәңірім, күмістен де асыл',
    artist: 'DSJ',
    is_unknown_author: false,
    permission_note: 'Top #18 Kazakh worship (#6014 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/145%20Sen_%20T_n_irim_%20kumisten%20de%20asyl..mp3',
    storage_path: null,
    duration_seconds: 178,
    lyrics:
      'Сен, Тәңірім, күмістен де асыл,\nСен, Тәңірім, алтыннан да қымбат.\nСен, Тәңірім, асылдың асылы.\nСен, Бағушым, менің Құдайым!\n\n// Сенен басқа Құтқарушым жоқ,\nСенен басқа арманым да жоқ,\nСенен басқа үмітім де жоқ.\nСен менің Құдайым! //',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6042',
    title: 'Тәңір Ием арамызда',
    artist: 'Блане Моррис',
    is_unknown_author: false,
    permission_note: 'Top #19 Kazakh worship (#6042 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/06%20_T_n_ir%20Iem%20aramyzda%20%20Dorozhka%206.mp3',
    storage_path: null,
    duration_seconds: 316,
    lyrics:
      '// Тәңір Ием арамызда,\nКиелі, Киелі! //\n\n// Жоғарыда Ол мадақталсын\nҚұдіретті күшпен, қуанышпен.\nБилік етсін арамызда\nБүгіннен, мәңгіге, Аумин! //',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5860',
    title: 'Жол Ғолғотаға алыс, қиналып қарадың',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #20 Kazakh worship (#5860 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/59.%20Zhol%20G_olg_otag_a%20alys_%20k_inalyp%20k_aradyn_.mp3',
    storage_path: null,
    duration_seconds: 256,
    lyrics:
      'Жол Ғолғотаға алыс, қиналып қарадың,\nЖараңнан тамшылап қаның ақты.\nО, Иса қымбаттым, мен үшін қиналдың,\nАзабын Өз еркіңмен көрдің.\n\nЕшқашан ұмытпаймын айқасқан ағашты,\nБайланыстырдың көк пенен жерді.\nӨлімің жарастырды бізді Құдаймен,\nТаза қаның бізді өтеді.\n\nАдамзат зер салшы, әнімді тыңдашы,\nНе үміт күтесің дүниеден.\nТөгілген қанына не төлем бересің,\nРақымы Құдайдың бағасыз.\n\nРақымдылығыңды Сен жерге жаудырдың,\nСоның сырын ашшы Сен бізге.\nНұсқаған жолыңмен қорықпай жүрейін,\nӨмірдің әр-қилы кезінде.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5971',
    title: 'Қолымды көкке жайып',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #21 Kazakh worship (#5971 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/13%20Track%2013.mp3',
    storage_path: null,
    duration_seconds: 449,
    lyrics:
      '// Қолымды көкке жайып\nСүйем Сені.\nҚұтқардың азат еттің Ием менің.\nЖер көкте сиынарым бір Өзіңсің.\nӨмірдің болмас сірә Сенсіз сәні. //\n\nСүйемін Сені Иса, сүйем Сені.\nСүйемін Сені Иса, сүйем Сені Иса.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-110432',
    title: 'Көмекке келдің (Came To My Rescue)',
    artist: 'Hillsong Worship (Қазақша)',
    is_unknown_author: false,
    permission_note: 'Recently added Kazakh worship (#110432 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/KomekkeKeldin_final.mp3',
    storage_path: null,
    duration_seconds: 319,
    lyrics:
      'Тұрамын алдыңда, Өмірім қолыңда.\nБасымды иемін Сенің құзырыңда.\nЖүрегім Өзіңде, Жаным да қолыңда.\nӨмірімді бағыштап, Тұрамын алдыңда.\n\n[Қайырмасы]\nКөмекке келдің, Ием, шақырғанда.\nТұрамын алдыңда.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-110431',
    title: 'Иенің Дұғасы (The Lord\'s Prayer)',
    artist: 'Hillsong Worship (Қазақша)',
    is_unknown_author: false,
    permission_note: 'Recently added Kazakh worship (#110431 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Ienin_%20Du_g_asy%20final.mp3',
    storage_path: null,
    duration_seconds: 272,
    lyrics:
      'Көктегі Әкеміз, Киелі болсын Сенің есімің.\nПатшалығың келсін, Еркің Сенің орындалсын.\nКөктегідей жерде де, Күнделікті нанымызды бер бізге.\nКешір біздің күнәні, Кешіргендей біз де өзгені.\nПатшалық, күш-құдірет, Мәңгілік мадақ Саған, Әумин!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-110430',
    title: 'Ән Айтамын Мен (I Sing Praise)',
    artist: 'Hillsong Worship (Қазақша)',
    is_unknown_author: false,
    permission_note: 'Recently added Kazakh worship (#110430 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/_n%20Aitamyn%20Men%20final.mp3',
    storage_path: null,
    duration_seconds: 271,
    lyrics:
      'Ән айтамын мен, Сен мені құтқардың.\nӘн айтамын мен, Сен мені босаттың.\nҚұтқарушы Иса, Сен менің бақытым,\nЖанымның тынышы, Жүректің шаттығы.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-110429',
    title: 'Әлемді Құдай Сүйеді (God So Loved the World)',
    artist: 'Hillsong Worship (Қазақша)',
    is_unknown_author: false,
    permission_note: 'Recently added Kazakh worship (#110429 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/_lemdi%20K_u_dai%20Suiedi%20FINAL.mp3',
    storage_path: null,
    duration_seconds: 217,
    lyrics:
      'Көктегі Әке сыйлады Жалғыз рухани Ұлын.\nСенгендер мәңгі өлмесін, Мәңгі өмірге ие болсын.\nӘлемді Құдай сүйеді, Құтқару бізге келді.\nМахаббат нұры төгілді, Иса бізге өмір берді.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-110428',
    title: 'Мұхиттар (Oceans)',
    artist: 'Hillsong United (Қазақша)',
    is_unknown_author: false,
    permission_note: 'Recently added Kazakh worship (#110428 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Muhittar%20final.mp3',
    storage_path: null,
    duration_seconds: 523,
    lyrics:
      'Сен шақырасың толқындардан,\nБелгісіз терең жақтарға.\nСені табамын сол тереңде,\nСеніммен судың үстінде.\n\n[Қайырмасы]\nАтыңды атап мен шақырамын,\nКөзімді салып тереңге.\nМұхиттар толқып тұрғанда,\nҚұшағыңда жаным тыныштық табады.\nСенікімін Сен менікісің.\n\n[Бридж]\nРухың жетелесін шексіз сеніммен жүруге,\nСу үстінде қадам басуға мені жетеле.\nҚайда апарсаң да барам, тереңге мен батайын,\nСенің қасыңда сенімім нығая түссін.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-110249',
    title: 'Ғасырлар Үміті (Hope of the Ages)',
    artist: 'Kazakh Worship',
    is_unknown_author: false,
    permission_note: 'Recently added Kazakh worship (#110249 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/G_asyrlar%20Umiti.mp3',
    storage_path: null,
    duration_seconds: 261,
    lyrics:
      'Исаның хабары · Ғасырлардың үміті\nЕшқашан ол өшпейді · Жарқырап жанады\nИсаның қауымын ешкім жеңе алмайды\nЖұлдыздай жарқырайды · Нұрын ол төгеді\n\nМәсіх өлген, бірақ қайта тірілді\nИә, Ол қайтадан келеді\nМәсіх - патша, мәңгі жеңісте\nИә, барлық мақтау Оған тән\nӘн сал Аллилуйя, Мәсіх Құтқарушымыз!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-110246',
    title: 'Иса, Қажетсің (Jesus I Need You)',
    artist: 'Hillsong Worship (Қазақша)',
    is_unknown_author: false,
    permission_note: 'Recently added Kazakh worship (#110246 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/IsaQazhetsinfinal.mp3',
    storage_path: null,
    duration_seconds: 313,
    lyrics:
      'Үміт - әнұраным, Ием, әлем тыныш болғанда.\nҚасымда тұрсың, Түнде маған ән берші.\n\n[Қайырмасы]\nИса - қажетсің, Әрбір сәтте қажетсің.\nРақымға бөленген жүрек әнін тыңда, Мәңгі мадақтаймын.\n\n[Бридж]\n//// Махаббатың менің есімде, Мәсіх менімен әрқашанда,\nМейірімділігің жетелейді, Мәсіх менімен әрқашанда ////',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5818',
    title: 'Әлемнің бәрін Құдай жаратқан',
    artist: 'Кевин Джонас',
    is_unknown_author: false,
    permission_note: 'Top #22 Kazakh worship (#5818 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Alemnin%20barin%20Kudai%20sharatkan.mp3',
    storage_path: null,
    duration_seconds: 198,
    lyrics:
      'Әлемнің бәрін Құдай жаратқан,\nЕшнәрсе Онсыз пайда болмаған.\n\nМадақтаймын Сені,\nМадақтаймын Сені, Ием.\nМадақтаймын Сені, Мәңгілік, Аумин!\n\nО, неткен бай Құдайдың даналығы,\nНеткен терең Оның білік-парасаты.\nО, неткен шексіз Оның даналығы,\nНеткен терең Оның білік-парасаты.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6593',
    title: 'Киелі Рух, Сенің қасыңда',
    artist: 'Жанат Кусаинова',
    is_unknown_author: false,
    permission_note: 'Top #23 Kazakh worship (#6593 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Kieli%20Rukh%20Senin%20kasynda.mp3',
    storage_path: null,
    duration_seconds: 315,
    lyrics:
      'Киелі Рух, Сенің қасыңда, мәңгі болғым келеді\nҚұшағыңа алшы.\nКиелі Рух, нәзік жүзіңді, жүрегіммен сезем, толтыршы.\n\nКиелі Рух, Киелі Рух !\nКиелі Рух, Киелі Рух !\nӨз өмірімді, Саған бағыштаймын.\nБіртұтас болғым келеді, Сенімен Ием !\nРизамын Саған, жетеле мені.\nСаған теңдес ешкім жоқ, сүйемін Сені !\n\nШын жүректен, рахметімді, Саған ғана айтамын!\nСұраймын Сені, жетелеші, Әкемнің тағына!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5985',
    title: 'Мен Саған өлең айтамын',
    artist: 'Рикк Фоундс',
    is_unknown_author: false,
    permission_note: 'Top #24 Kazakh worship (#5985 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/rendered/Men_Sag_an_olen__aitam.mp3',
    storage_path: null,
    duration_seconds: 33,
    lyrics:
      'Мен Саған өлең айтамын,\nТәңір Саған табынамын.\nСаған мәңгі ризамын мен.\nҚұтқарғаныңа қуанамын.\n\nКөктен жерге келдің\nШын өмір беру үшін.\nКиелі қаныңды төктің,\nҚұнымды төледің.\nӨлімнен Сен тірілдің,\nКөкке көтерілдің.\nАтыңды мен көтерем.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6008',
    title: 'Рахмет Саған, Құдай!',
    artist: 'Хенри Смит',
    is_unknown_author: false,
    permission_note: 'Top #25 Kazakh worship (#6008 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Rakmet%20Sagan%20Kudai.mp3',
    storage_path: null,
    duration_seconds: 92,
    lyrics:
      'Рахмет Саған, Құдай!\nРахмет Саған, Құдай!\nРахмет, О, Құдай Ием!\nИса үшін рахмет!\n\nЕнді менің күшім бар!\nМенің байлығым бар!\nМен үшін Иса өмірге келді!\nРахмет!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-8995',
    title: 'Дұға етем аспанға жетуге',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #26 Kazakh worship (#8995 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Togiledi%20Onyn_%20nu_ry%201.mp3',
    storage_path: null,
    duration_seconds: 199,
    lyrics:
      'Дұға етем аспанға жетуге,\nСол жердегі Патшама ән арнаймын мен.\nЖарық сәуле сөнбейтін мекенге,\nҚалып қоймай жетсем екен.\n\nҚазақстан жерімізге,\nТөгіледі Оның нұры,\nКелді біздің төрімізге,\nИса Мәсіх - Құдай Ұлы.\n\nШын жүректен сенемін мен Оған,\nЖетелейді ғажайып көктегі үйге.\nТыныштықтың қайнар көзі болған,\nЕремін мен тек Мәсіхке.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-12631',
    title: 'Адамдар, ойланыңдар',
    artist: 'Шынтеміров Әбілхайыр',
    is_unknown_author: false,
    permission_note: 'Top #27 Kazakh worship (#12631 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/adamdar_oilanyndar.mp3',
    storage_path: null,
    duration_seconds: 151,
    lyrics:
      'Адамдар ойланыңдар,\nҚұлақ сап сөз тыңдаңдар,\nЖаратқан жер дүниені,\nҚұдайдан артық кім бар!\n\nОл сенің жанашырың!\nАңсаған арман жырың!\nМәңгілік өмір сыйлар,\nОл сенің Құтқарушың!\n\nАдамдар ойланыңдар,\nКүнәдан бой тартыңдар!\nБіз үшін құрбан болған,\nИсаны ойға алыңдар!\n\nАдамдар ойланыңдар,\nӨкініп кеш қалмаңдар,\nИсаның сөзін тыңдап,\nЖүрекпен қабылдаңдар!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6613',
    title: 'Бауырым айқыш ағашқа қара',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #28 Kazakh worship (#6613 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Kozindi%20koter%20Aikysh%20agashka.mp3',
    storage_path: null,
    duration_seconds: 351,
    lyrics:
      'Бауырым, айқыш ағашқа қара,\nСен үшін, Құдай-Иса, құрбан болды!\nӨмірін Ол сен үшін қиды, сен үшін!\nКүнәдан Ол тазартты, ақтады, босатты!\n\nКөзіңді көтер, Айқыш ағашқа!\nИудейдің Патшасы, әлемнің Патшасы!\nСенің Патшаң құрбан болды!\nИса Өз қанын төкті,\nАйқыш ағаш арқылы, саған өмір берді!\n\nБар әлем, күнәға батып, шаршаған,\nТүнекте жүріп, шындық жолдан адасқан.\nӨмірін Иса тек сен үшін қиды,\nКүнәдан Ол тазартты, ақтады, босатты.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5769',
    title: 'Мәңгілік мадақтаймын Сені',
    artist: 'Мартин Смит',
    is_unknown_author: false,
    permission_note: 'Top #29 Kazakh worship (#5769 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/M_n_gilik%20madak_taimyn%20Seni.mp3',
    storage_path: null,
    duration_seconds: 163,
    lyrics:
      'Шаттық тыныштық сыйлаған\nмахаббатың төгіледі\nжүректі Рухыңмен емдеп\nТек шындықта Сен тұр дедің\nСені ғана мадақтаймын\nШындықта мен тұрғаныма\nМәңгілік жырлап өтемін\nмахаббатыңды\n\nМәңгілік мадақтаймын Сені\nМәңгілік мадақтаймын Сені\n\nҚуанышқа толып\nШаттанып билейміз\nбүкіл әлем жарық көрсе\nОлар да билер біздермен бірге',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5804',
    title: 'Алғыс Саған, жалғыз Саған',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #30 Kazakh worship (#5804 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/06%20Alg_ys%20_%20Sag_an_%20zhalg_yz%20_%20Sag_an...Track%206.mp3',
    storage_path: null,
    duration_seconds: 296,
    lyrics:
      'Алғыс Саған, жалғыз Саған,\nАлғыс Саған Иса!\nТәңір маған сөйледің Сен\nСол сәт өзгердім мен.\nМәңгі өмір сыйладың Сен\nКиелі Рухыңмен.\nО, Құдайым, өмір бұлағы Сен!\nЖалғыз Саған табынамын мен.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5858',
    title: 'Жыр болып бізге ашылшы Тәңір',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #31 Kazakh worship (#5858 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Shir%20bolip%20bizge.mp3',
    storage_path: null,
    duration_seconds: 237,
    lyrics:
      'Жыр болып бізге ашылшы Тәңір,\nСырыңды маған ақтаршы Ием.\nҰнаттың адам баласын неге?\nМәнісін мұның ұқтыршы Құдай.\n\nО, Құдай Ием, Өзіңсің өмір.\nО, Құдай Ием жаратқан бізді.\nБас иіп Саған келіп тұр елім,\nЖетелеп баста шындыққа Иса.\n\nКүнәға батқан елімді көріп,\nЖібердің бізге Ұлыңды жерге.\nҮзілген үміт жалғанды бүгін,\nМәңгілік өмір сыйладың бізге.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5801',
    title: 'Атың Сенің киелі',
    artist: 'Нұр',
    is_unknown_author: false,
    permission_note: 'Top #32 Kazakh worship (#5801 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Atyn_%20Senin_%20kieli.mp3',
    storage_path: null,
    duration_seconds: 334,
    lyrics:
      'Атың Сенің киелі,\nИса бізді сүйеді.\nКүнәмізді кешіріп,\nБолдық өмір тиегі.\n\nҚуанайық, шаттанайық,\nЖарты жолда тоқтамайық.\nИса Мәсіх арқылы\nМәңгілікке аттанайық!\n\nИса Сені сағынамын,\nАйтқаныңа бағынамын.\nИса Сөзі арқылы\nҚұдайымды танығанбыз.\n\nСен бұл жердің тұзысың,\nСен бұл жердің нұрысың.\nҚұдай Әке жіберген\nҚұтқарушы Ұлысың.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5990',
    title: 'Міне бүгін келді уақыт Саған',
    artist: 'Шынтеміров Әбілхайыр',
    is_unknown_author: false,
    permission_note: 'Top #33 Kazakh worship (#5990 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/131.%20Mine%20bugin_%20keldi%20uak_yt%20Sag_an_.mp3',
    storage_path: null,
    duration_seconds: 163,
    lyrics:
      'Міне бүгін келді уақыт Саған\nАлдың ауыр жаза.\nБолсаңдағы мейірімге толған\nКүнәлардан таза.\n\nЖас келеді мөлдіреп жанарыма,\nҚалай ғана шыдадың азабына?\nАйқыш ағаш, қағылған темір шеге,\nЖазықсыз қолдарыңа!\n\nШақырдың Сен барлық адамзатты\nҒажайып өмірге.\nӨз қолыңмен салып берген\nЖолың жұмақтың төріне!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5958',
    title: 'Құдай сонша жақсы көрді қазақ даласын',
    artist: 'Әбдуалиева Жұлдыз',
    is_unknown_author: false,
    permission_note: 'Top #34 Kazakh worship (#5958 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Kudai%20sonsha.mp3',
    storage_path: null,
    duration_seconds: 166,
    lyrics:
      'Құдай сонша жақсы көрді қазақ даласын,\nОл жіберді Өзі сүйген Иса баласын.\nКүнәсінан құтқарылсын, аман болсын деп,\nСүйгендіктен құрбандыққа берді Баласын.\n\nО, Жаратқан неткен шексіз махаббатың,\nБітпес сонша бізге төгер шапағатың.\nСиынамыз бір Өзіңе, Құдай Әке,\nТыныштықта, қуанышта бір Өзіңде.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6022',
    title: 'Сөзіңді алдым қолыма',
    artist: 'Оспанов Қуандық',
    is_unknown_author: false,
    permission_note: 'Top #35 Kazakh worship (#6022 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Sozindialdim.mp3',
    storage_path: null,
    duration_seconds: 257,
    lyrics:
      'Сөзіңді алдым қолыма,\nЖарық боп жанған жолыма.\nӘлсіреп әлім таусылса,\nКүш-қуат берер бойыма.\n\nКиелі кітап - ырысым,\nКүнәға қарсы қылышым.\nТастай боп қатқан жүректер\nСөзіңді оқып жібісін.\nМұздай боп тоңған көңілдер\nОларды оқып жылысын.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6573',
    title: 'О, Құдай - Иса Ием, менің!',
    artist: 'Жанат Кусаинова',
    is_unknown_author: false,
    permission_note: 'Top #36 Kazakh worship (#6573 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Senin_%20k_olyn_da.mp3',
    storage_path: null,
    duration_seconds: 310,
    lyrics:
      'О, Құдай - Иса Ием менің!\nТек, Саған өмірімді арнаймын.\nҮмітім Сенде, жүзіңді, тынысымдай аңсаймын.\nӘке, Әке, Әке - деп, дүрсілдейді жүрегім!\n\nТәңірім Сенің алдыңда басымды ием,\nжалғыз тілегім,\nСенің Рухыңа, кенелемін мен!\nТәңірім Сенің алдыңда басымды ием,\nСені сүйемін!\nСенің қолыңда, менің жүрегім!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6615',
    title: 'Иса - жолымсың менің',
    artist: 'Арлан Нұрманов (Жаңа Өмір)',
    is_unknown_author: false,
    permission_note: 'Top #37 Kazakh worship (#6615 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Ansaidy%20Seni%20zhuregim.mp3',
    storage_path: null,
    duration_seconds: 237,
    lyrics:
      'Иса - жолымсың менің!\nИса - адасқан кезде, таптың - Сен, мені!\nИса - тыныштығымсың!\nИса - қайғы түндерде, жұбаттың мені!\n\nАңсайды Сені, жүрегім, Киелі Рухыңмен толтыр!\nАңсайды Сені, жүрегім, өмірдің мәні, жоқ - Сенсіз!\n\nИса - арманым менің!\nИса - Сенің еркіңде, өмір сүруге!\nИса - махаббатымсың!\nИса - өз үмітімді, Сенен үзбеймін!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6622',
    title: 'Рахмет Саған Құдай Әке',
    artist: 'Айжамал Байдаулетова',
    is_unknown_author: false,
    permission_note: 'Top #38 Kazakh worship (#6622 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Men%20eshkashan%20umytpaimy.mp3',
    storage_path: null,
    duration_seconds: 229,
    lyrics:
      'Рахмет Саған - Құдай, Әке!\nРахмет Саған - Құдай, Әке!\n\nМен ешқашан ұмытпаймын, Сенің махаббатыңды!\nМен ешқашан ұмытпаймын, рақымыңды!\n\nРахмет Саған - Тәңір Иса!\nРахмет Саған - Киелі Рух!\nРахмет Саған!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5814',
    title: 'Ән салып, би билейік',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #39 Kazakh worship (#5814 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/08%20Isa%20tiri%20Track%2008.mp3',
    storage_path: null,
    duration_seconds: 255,
    lyrics:
      'Ән салып, би билейік.\nҚолыңды көкке көтер.\nБіздің Құдай - шындық және өмір.\nМұқтаждықтар болғанда\nҚұдайға сен сиыншы.\nОл саған жауабын береді.\nСебебі Ол - Иса тірі!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5854',
    title: 'Жүрегіме жүз қарап',
    artist: 'Шынтеміров Әбілхайыр',
    is_unknown_author: false,
    permission_note: 'Top #40 Kazakh worship (#5854 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Abukhair%2004.mp3',
    storage_path: null,
    duration_seconds: 284,
    lyrics:
      'Жүрегіме жүз қарап,\nЖүруші едім тұнжырап.\nКөп іздеген бақытым Өзі келді қолыма.\nКөрінгеннен жол сұрап\nҚараушы едім жаутаңдап.\nАқыл беріп Тәңірім Салды өмір жолына.\n\nӘн айтамын ардақтап,\nТәңірімді мадақтап.\nМәңгі бірге боламын Тәңірімнің қасында.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5984',
    title: 'Мен үшін өлгеніңе',
    artist: 'Сергей Данильченко',
    is_unknown_author: false,
    permission_note: 'Top #41 Kazakh worship (#5984 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/En_eu%20birg_nen_.mp3',
    storage_path: null,
    duration_seconds: 348,
    lyrics:
      'Мен үшін өлгеніңе,\nҚаныңды төккеніңе,\nҚайта тірілгеніңе,\nӨлімді жеңгеніңе.\n\nРахмет Саған Тәңір Иса!\nРахмет Саған Тәңір Иса!\nРахмет Саған Тәңір Иса!\nЖүрегім Саған риза,\nЖүрегім Саған риза!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5986',
    title: 'Мейіріміңе толы бар әлем',
    artist: 'Сергей Данильченко',
    is_unknown_author: false,
    permission_note: 'Top #42 Kazakh worship (#5986 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Meirimine.mp3',
    storage_path: null,
    duration_seconds: 256,
    lyrics:
      'Мейіріміңе толы бар әлем,\nМейіріміңді күнде мен көрем.\nМейірімің соттан да үстем.\nБиік жоғары барлық күштен\n\nҚұнымды өтеп, ақтадың,\nАзат еттің, сақтадың.\nҚұнымды өтеп, ақтадың,\nКүнәдан Сен сақтадың.\n\nАлғыс Саған Иса',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5806',
    title: 'Асқар таулардан да Ұлысың',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #43 Kazakh worship (#5806 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Askar%20taulardanda.mp3',
    storage_path: null,
    duration_seconds: 282,
    lyrics:
      'Асқар таулардан да Ұлысың,\nАспандағы жұлдыздардан да биіксің.\n\nИә, Саған ұқсас ешкім жоқ Тәңірім\nИә, тізе бүгіп келіп тұрмын алдыңа!\n\nТек Сен ғана лайықсың мадаққа,\nТек Сен ғана лайықсың құрметке!',
    play_count: 0,
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
    play_count: 0,
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
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-102500',
    title: 'Аумин (The Blessing)',
    artist: 'Cody Carnes, Kari Jobe, Steven Furtick, Chris Brown',
    is_unknown_author: false,
    permission_note: 'Kazakh worship (#102500 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/8%20Aumin.mp3',
    storage_path: null,
    duration_seconds: 334,
    lyrics:
      '[V1]\nТәңір Ие, бірге болып\nҚорған болып саған, жарылқасын\nБет жүзін, бұрып саған\nТыныштық сыйласын\n\n[C1]\nАумин, аумин, аумин\nАумин, аумин, аумин\n\n[V2]\nТәңір Ие, бірге болып\nҚорған болып саған, жарылқасын\nБет жүзін, бұрып саған\nТыныштық сыйласын\n\n[C2]\nАумин, аумин, аумин\nАумин, аумин, аумин\n/// Аумин, аумин, аумин\nАумин, аумин, аумин ///\n\n[V3]\nОл сенімен, бірге болсын\nҰрпағыңнан ұрпағыңа\nӨз үйің де, жүрегіңде\nНемереңмен, шөбереңде\n\n[V4]\nОл сенімен, бірге болсын\nҰрпағыңнан ұрпағыңа\nӨз үйің де, жүрегіңде\nНемереңмен, шөбереңде\n\n[V5]\nҚұдай жүрсін\nҚолдап, қорғап\nОл қасыңда, тастамайды\nҚамқорлайды, жетелейді\nӘрқашанда, Ол қасыңда\n\n[V6]\nТаң сәріден\nҚара түнге\nӘрбір жерде\nОл жаныңда\nЖыласаң да, қуансаң да\nОл сенімен, тастамайды\n//// Әрқашан да, Ол қасыңда ////\n\n[C3]\nАумин, аумин, аумин\nАумин, аумин, аумин',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5821',
    title: 'Әсем Әуен',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Kazakh worship (#5821 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/06%20_sem%20_uen.mp3',
    storage_path: null,
    duration_seconds: 157,
    lyrics:
      '[V1]\nО, Құдай қарашы маған\nЖаным ұмтылады Саған\nСаған арнап, мен ән айтам\nОян жаным, оян рухым\nТыңдашы жүректің үнін\nТән сәріде Сені мадақтаймын\n\n[C1]\n// Әсем әуен! Әсем әуен!\nТәңірге - әсем әуен!\nИса! Иса! Иса - әнімсің Сен! //',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-12783',
    title: 'Бар әлемді жаратқан құдіретті Құдай',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #51 Kazakh worship (#12783 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/15%20Bar%20_lemdi%20zharatk_an%20k_u_diretti%20K_u_dai_.mp3',
    storage_path: null,
    duration_seconds: 210,
    lyrics:
      'Бар әлемді жаратқан, Құдіретті Құдай\nЖалғыз Өзің өмірімді менің өзгерттің.\nМәңгі жырлаймын енді Сенің ұлы ісіңді\nСенің шексіз рақымыңды маған сыйлаған.\n\nСаған Құдай, мадақ пен даңқ болсын,\nБасымды Саған ғана иемін.\nСаған Құдай өмірім арналсын,\nҚабыл ал, дұғамды сиынам мен.\n\nБар әлемді жаратқан, Құдіретті Құдай!\nСенсің маған түнекте жарық сыйлаған\nШексіз мейіріміңді жүрекке сездірдің,\nҚызмет етемін шын жүрекпен тек Саған!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-102497',
    title: 'Сен айттың',
    artist: 'Lauren Daigle (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #53 Kazakh worship (#102497 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/7%20Sen%20aittyn_.mp3',
    storage_path: null,
    duration_seconds: 265,
    lyrics:
      'Алысамын түкке тұрмас жансың деген ойлармен\nЛайықсыз деп ішкі дауыс үн қатады сыбырмен\nСансыз күдік торлап менің тұмшалайды санамды\nАрашалап алшы мені жойшы жаман ойларды\n\nСүйемін дейсің егер торықсам\nСенім арт дейсің егер қорықсам\nКөтерем дейсің кенет сүрінсем\nБіргемін дейсің жалғыз сезінсем\nСенемін, сенемін,\nСөзіңе сенемін\n\nҚымбатпын мен көз алдыңда алтыннанда бағалы\nТек өзіңмен жылынады жүрек тыным табады\n\nАқтарып мен бар сырымды\nЖығыламын алдыңда\nЖеңісім де жеңілісім тек өзіңнің қолыңда',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5802',
    title: 'Алып шыққан түнектен',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #54 Kazakh worship (#5802 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/08%20alyp%20shykkan.mp3',
    storage_path: null,
    duration_seconds: 357,
    lyrics:
      'Алып шыққан түнектен,\nӨміріме солмас гүл еккен.\nҮмітімді артамын Саған Тәңірім.\nӘлсіз үнді естіген.\nТұңғиықтан шығарған,\nКөз жасымды сүртіп тиылтқан,\nАлғысым менің шексіз Саған Тәңірім\nАяғыма берік тұрғызған.\n\nМен жаңа бір ән айтамын, айтамын.\nЕнді үнсіз қарап тұрмаймын.\nМен жаңа бір ән айтамын Құдайға\nСүйіспеншілігін жырлаймын.\n\nБақытты болар адам\nЖаңа өмірге жасап қадам.\nТаусылмас керемет істері Тәңірдің\nМәңгі өмір сыйлаған.\nБарлық адам қуанса,\nЖан-тәнімен Саған ұмтылған\nДауыстап Сені мадақтаса, даңқтасын,\nҰлы Құдай, Ұлы Құдай!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5838',
    title: 'Бүгін міне қуанышта шек болмас',
    artist: 'Жаңқабаева Нұрсұлу',
    is_unknown_author: false,
    permission_note: 'Top #55 Kazakh worship (#5838 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Bugin%20mine%20kuanishta%20shek%20bolmas.mp3',
    storage_path: null,
    duration_seconds: 180,
    lyrics:
      'Бүгін міне қуанышта шек болмас,\nПеріштелер әсем әнін тоқтатпас.\nНеткен Құдай қасиетті, құдіретті!\nӨз баласын Бетлехемге жіберді.\nПатша болып туылған, айналайын баладан.\nӘлем Құтқарушысы, адамзатқа берілді.\nДәуіттің қаласында нұр төгілді,\nПеріштелер сонда былай тіл қатты,\n«Лайым, Құдай аспанда құрметтелсін!\nАдамдарға шапағаты төгілсін».\nҚуанамыз, ән айтамыз, шаттана,\nНәрестенің ғажап туылғанына.\nСебебі өз уақыты келген кезде,\nКүнәдан Ол құтқарады бәрін де.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5869',
    title: 'Иемізді мадақтаңдар!',
    artist: 'Дамира Мусаева',
    is_unknown_author: false,
    permission_note: 'Top #56 Kazakh worship (#5869 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/01%201%20Iiemizdi%20madak_tan_dar%2024.mp3',
    storage_path: null,
    duration_seconds: 118,
    lyrics:
      'Иемізді мадақтаңдар!\nБарлық ұлттар.\nОны мадақтаңдар!\nКүллі халықтар.\n\nОл зор мейірімін көрсетіп,\nБізге мәңгілік адал болады\nМадақтаңдар, Иемізді!\nМадақтандар, Иемізді!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-95134',
    title: 'Кіммін мен, бүкіл әлем Патшасы',
    artist: 'Mark Hall / Casting Crowns (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #57 Kazakh worship (#95134 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Kimmin%20men.mp3',
    storage_path: null,
    duration_seconds: 193,
    lyrics:
      'Кіммін мен, бүкіл әлем Патшасы\nОйлайтын мен жайлы\nМенің жан дүнием?\nКіммін мен, Құдайдың ғажап Нұры\nЖетелейтін мені қараңғы дүниеде\n\nІстеген ісім емес, рақымың Сенің Әке\nРақымыңды төгесің, ісіме қарап емес\nМен тек бүгін бар, ертең болмайтын\nГүл іспетті мен қурайтын\nКеліп кетер өмірге, қас-қағым сәтке\nБірақ Сен үніме құлақ түресің\nҚұласам Сен кешіресің\nМәңгілік өмір беріп, шынайы, мәңгіге\n\nКіммін мен, бәрін көруші Құдай\nКешіріп күнәмді, ақтайтындай мені\nКіммін мен, бар биліктің Иесі\nСыйлайтын тыныштық, әлем қиналғанда',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5865',
    title: 'Иса сені сүйеді, ей, бауырым',
    artist: 'Нурабаева Бахыт',
    is_unknown_author: false,
    permission_note: 'Top #58 Kazakh worship (#5865 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Isa%20seni%20su_iedi.mp3',
    storage_path: null,
    duration_seconds: 216,
    lyrics:
      'Иса сені сүйеді, ей, бауырым,\nЕсігі ашық сен үшін әр қауымның.\nТәубеге кел ағайын, өтінемін,\nКімге керек уақытша сауығың.\nМәңгілік өмір береді,\nОның қолында себебі.\nКүтіңдер, іздеңдер, асығыңдар.\nИса жақында келеді, келеді.\nИса жақында келеді.\nКөкке бізді Өзімен әкетеді,\nҚабылдасаң Исаны сол жетеді.\nАтымен тек Ұлының келерсің,\nАқ ниетпен айтылған уәде еді.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5960',
    title: 'Құрбан еттің біз үшін',
    artist: 'Шынтеміров Әбілхайыр',
    is_unknown_author: false,
    permission_note: 'Top #59 Kazakh worship (#5960 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/108.%20%20K_u_rban%20ettin_%20biz%20ushin%20k_asietti%20zhanyn_dy..mp3',
    storage_path: null,
    duration_seconds: 223,
    lyrics:
      'Құрбан еттің біз үшін,\nҚасиетті жаныңды.\nТөгіп кеттің мен үшін,\nӨз Киелі қаныңды.\nКүнәлардан құтқарып,\nМәңгі өмір сыйладың.\nЖан-тәніммен ұмтылам,\nҰсынғанда бағыңды.\n\nСен әлемді жаратқан\nБір Құдайдың Ұлысың\nШынайы өмір беретін,\nМөлдір бұлақ көзісің.\nО, Тәңірім жасаған,\nПатшалығың жақындап,\nОсы әлемге жарқырап,\nТөгіп тұрған нұрысың.\n\nЖанға дәру беретін,\nЖүрекке жылу төгетін.\nЖаратқан Өзің пендеңе\nКөңілінді бөлетін.\nҚандай шексіз махаббат\nҚандай ыстық құшағың.\nҚуанғанда Өзіңе,\nҚияға самғап ұшамын.\n\nНұрыңды төкші халқыма,\nҚараңғыдан құтқаршы,\nШындық тапсын жолыңнан\nКүнәсінан арылтшы.\nЖаратқан біздің Иеміз,\nТәңіріміз Бағушы.\nТар жолменен жетелеп,\nМәңгі өмірге апаршы.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5962',
    title: 'Құдай сізді әуел баста таңдап қойған',
    artist: 'Нурабаева Бахыт',
    is_unknown_author: false,
    permission_note: 'Top #60 Kazakh worship (#5962 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/97.%20K_u_dai%20sizdi%20_uel%20basta%20tan_dap%20k_oig_an.mp3',
    storage_path: null,
    duration_seconds: 142,
    lyrics:
      'Құдай сізді әуел баста таңдап қойған,\nТәубе қылар кезің келді терең ойлан.\nСонда ғана жүрегің азат болар,\nТыныштық пен Киелі Рух келіп қонар.\n\nСізді осында Құдай әкелді,\nҚуаныштан айтамыз:\nОй, бәрекелді!\nТөрге қысылмай отырыңыз,\nҚұдайды мадақтауға қосылыңыз.\n\nИса үшін Құдайға алғыс айтайық.\nБәрімізде Киелі Рухқа толып қайтайық.\nИса - Шындық - Шынайы Өмір - Әкеге Жол.\nТатуласып Онымен сен бақытты бол!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6035',
    title: 'Теңдесі жоқ Ұлы Құдай',
    artist: 'Don Moen (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #61 Kazakh worship (#6035 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Tendesishok.mp3',
    storage_path: null,
    duration_seconds: 173,
    lyrics:
      'Теңдесі жоқ Ұлы Құдай\nСиынам Саған.\nТағзым етіп келгенімде\nТыныштыққа бөлейсің.\n\nЖан-дүниемді Тәңірім Саған берем.\nҰлы Құдай өмірімнің бұлағысың Сен.\n\nАлдыңа келіп, бас ием,\nТәңірім, Саған.\nЖұбаныштың жалғыз көзін\nТаптым мен тек Өзіңнен.\nҰлысың Сен,\nТең келер жан жоқ Саған.\nАлдыңа кеп табынамын,\nМейірімді Әкем.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-11336',
    title: 'Құдайсыз өмір - бақытсыз өмір',
    artist: 'Шынтеміров Әбілхайыр',
    is_unknown_author: false,
    permission_note: 'Top #62 Kazakh worship (#11336 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/103.%20K_u_daisyz%20omir%20_%20bak_ytsyz%20omir_.mp3',
    storage_path: null,
    duration_seconds: 236,
    lyrics:
      'Құдайсыз өмір - бақытсыз өмір,\nКүнәға толы алдамшы өмір.\nНеге шындықты біле алмайсың сен?\nАйтшы бауырым, кімді алдайсың сен?.\n\nМіне, тағы да жылап тұрсың сен,\nҚайғы-қасірет артып жүрмін деп.\nНеге Құдайды танымайсың сен?\nАйтшы, бауырым, кімді алдайсың сен?\n\nКүнәға батып, қиналасың сен,\nМұңыңды айтып, тұнжырайсың сен?\nНеге Құдайды тыңдамайсың сен?\nАйтшы бауырым, кімді алдайсың сен?\n\nКүнәңді айтсаң Тәңір алдында,\nКенелер едің шексіз бақытқа.\nКелші Құдайға, келші бауырым,\nИсаның Сөзін алшы қолыңа.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-12817',
    title: 'Киелі Рух көз бердің',
    artist: 'Сапарова Самсия / Әлімбеков Ғалымжан',
    is_unknown_author: false,
    permission_note: 'Top #63 Kazakh worship (#12817 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/83.%20Kieli%20Rukh%20koz%20berdin_..mp3',
    storage_path: null,
    duration_seconds: 153,
    lyrics:
      'Киелі Рух көз бердің.\nКөмейіме сөз бердің.\nДүние бүкіл дөңгелеп,\nКөз алдымда өзгердің.\n\nКүнәмді Сен кешірдің,\nПәк қаныңмен өшірдің,\nАшып бердің мен үшін\nМәңгіліктің есігін!\n\nИса Мәсіх, жан Ием,\nБүгін, міне, кез келдің.\nҚұдіретті Құдайдың\nАузындағы сөз бе едің?\n\nСен Құдайдың Сөзісің,\nБір Құдайдың Өзісің.\nҚұрбандыққа шалынған\nҚасиетті «Қозысың».',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-12850',
    title: 'Пана (Ал мені қанатыңа)',
    artist: 'Reuben Morgan / Hillsong (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #64 Kazakh worship (#12850 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/01%20Al%20meni%20k_anatyn_a%20%20Track%201.mp3',
    storage_path: null,
    duration_seconds: 243,
    lyrics:
      'Ал мені, қанатыңа,\nСақташы, қолыңмен Құдіретті!\n\nТеңіз долданып, дауыл тұрса,\nСенімен самғайм(ын) жоғарыда.\nӘке, Патшасың тасқынға да,\nСен біргесің, білем(ін), Құдайым!\n\nТыным табам, тек Мәсіхте,\nСенемін құдіретіңе Сенің!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-42579',
    title: 'Нұрсың Сен, киелі Сенің қасиетің',
    artist: 'Илияс Турсун / Абләһәт ака',
    is_unknown_author: false,
    permission_note: 'Top #65 Kazakh worship (#42579 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Nu_rsyn_%20Sen%20%20korrektiroavan.%20variant.%201%202.mp3',
    storage_path: null,
    duration_seconds: 206,
    lyrics:
      'Нұрсың Сен, киелі Сенің қасиетің,\nБіз үшін бағасыз кешірім бергенсің.\nТаусылмас рақымың, шексіз құдіретің,\nТәңірім, неткен сонша ұлы едің.\n\nНұр шаштың әрбір басқан қадамыма,\nЖол аштың, жұмаққа біз бара алуға!\nО, Құдай, шындығыңды аштың маған,\nСен ғана жүрегімнің бол тағында!\nКиелі сөздерің әсер еткенде,\nЖан-дүнием жайнайды, раушан гүліндей.\nБақытым, байлығым Сенің қолыңда,\nБарымды арнаймын Сенің жолыңда!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6036',
    title: 'Тәңір жолыма жарық шашып',
    artist: 'Amy Grant & Michael W. Smith (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #66 Kazakh worship (#6036 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Zholyma%20zharyk_%20shashyp.mp3',
    storage_path: null,
    duration_seconds: 150,
    lyrics:
      'Тәңір жолыма жарық шашып\nҮйге ертіп келеді.\n\nЖалғыз қалсам да,\nЖолымнан адассам да\nСен мені жетелейсің.\nСонда қорқыныш бірден ғайып болады.\nТәңір мені тастама, тастама.\n\nТәңір жолыма жарық шашып,\nҮйге ертіп келеді.\n\nРақымыңа мен\nКенелемін, О, Әкем!\nСенде менің бақ-берекем.\nЖолымда менің\nИса адал серігім.\nҚұтқарушы Ол менің,\nОл менің.\n\nТәңір жолыма жарық шашып,\nҮйге ертіп келеді.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6571',
    title: 'Иса - Тәңір, Патшамыз',
    artist: 'Don Moen & Paul Kyle (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #67 Kazakh worship (#6571 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/03%20Isa%20T_n_ir%20Patshamyz.mp3',
    storage_path: null,
    duration_seconds: 272,
    lyrics:
      'Иса - Тәңір, Патшамыз,\nКелші осында!\nТағыңнан, орын алшы,\nМадақты, қабыл алшы!\n\nСиынам Саған - Құтқарушым,\nМадақтаймын Сені - Мәсіғім,\nПатша боп келші, Тәңір-Иса,\nҚазір келші, басқара көрші!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-7746',
    title: 'Жасыл жайлауға мені жаясың',
    artist: 'Каты Зузиак',
    is_unknown_author: false,
    permission_note: 'Top #68 Kazakh worship (#7746 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/56.%20Zhasyl%20zhailaug_a%20meni%20zhaiasyn_.mp3',
    storage_path: null,
    duration_seconds: 193,
    lyrics:
      'Жасыл жайлауға мені жаясың,\nЖақсыны жаныма жаудырасың.\nСүт ішкендей мен еш тарықпаймын,\nКиелі Сөзіңді іше берем.\nҚұшағыңды жайып қарсы аласың,\nСонда мен қуанып табынамын\nБағушым менің, балаңмын Сенің,\nМейірімді Әкем!\n\nКүнәкар болған мені құтқардың,\nҚұрбандық қаныңмен ағарттың.\nҚұнымды төлеген, мен үшін өлген,\nҚұтқарушым, Саған сенем.\nҚұлақ маған асып, қабыл алдың,\nЕнді мен қуанып, бағынамын,\nҚұдайым менің, құлыңмын Сенің,\nМейірімді Ием.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-11335',
    title: 'Қиналсам да бұл өмірде',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #69 Kazakh worship (#11335 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/87.%20K_inalsam%20da%20bu_l%20omirde_.mp3',
    storage_path: null,
    duration_seconds: 218,
    lyrics:
      'Қиналсам да бұл өмірде,\nСен тұрасың жүрегімде,\nТар жолменен өтіп келем,\nЖалғыз Өзің тірегім де.\n\nЕлім алыс, бірақ Саған қайырылмайды,\nО, Құдайым, көмегіңсіз еш болмайды!\n\nҚұдай Әке, құтқара гөр бауырымды,\nИса, Ием, құтқара гөр елімді.\nӨтініп мен Сенен сұрап тұрмын!\n\nДауыл соғып долданса да,\nЖалғыз Сенсің елге пана,\nЖұмыр жер мен көк аспан да,\nБарлық билік Сенде Иса.\n\nЖаным күйеді солар үшін,\nӘрбір бейбақ қазақ үшін,\nАрашала тозақ оттан,\nМенің халқым құтқарылсын.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-12747',
    title: 'Дүниені сүйгендіктен Жаратқан Тәңір',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #70 Kazakh worship (#12747 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/01%20Dunieni%20suigendikten%20Zharatk_an%20T_n_ir%20Track%201.mp3',
    storage_path: null,
    duration_seconds: 185,
    lyrics:
      'Дүниені сүйгендіктен,\nЖаратқан Тәңір,\nКүнәкар бұл дүниеге Ұлын берген!\nТөгілген қанымен құтқарып бізді,\nМәңгілік өмірді, бізге сыйлық еткен!\n\nДүниенің күнәларын мойынына алып,\nОл сенің күнәң үшін, құрбан болған!\nБүгін де сені күтеді, құшағын жайып,\nҚабыл ал, Оның сыйын берген саған!\n\nКүнәның тұтқынында, біз жасап келдік,\nАзғырып күнәларға жетеленіп,\nҚолымызбен жасаған жамандық үшін,\nАйыпсыз, Исаның қолы шегеленген!\n\nОл сенің жүрегіңді тебіренткенде,\nҚанша рет тастамаймын дедің, күнәларды!\nҚұмарлық күнәлары елестегенде,\nКеттің сен күнә толған шексіз шөлге!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5805',
    title: 'Аспанда жарық ай, самсаған жұлдыздар',
    artist: 'Темірбеков Азамат',
    is_unknown_author: false,
    permission_note: 'Top #72 Kazakh worship (#5805 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/06%20_%20Aspanda%20zharyk_%20ai_%20samsag_an%20zhu_ldyzdar%20%20Aspana%20zharik%20ai.mp3',
    storage_path: null,
    duration_seconds: 254,
    lyrics:
      'Аспанда жарық ай, самсаған жұлдыздар.\nРақымын аямай нұрын төкті Құдай.\nБүгін жар саламыз Иса Сөзін елге\nҚұдайдан Ол келген күнәң үшін жерге\n\nИса Тәңір жүрегімде жаса мәңгі,\nӨзіңменен өміріміз болсын сәнді.\nМадақталсын киелі Атың бар әлемге.\nБір Өзіңе арнайық жыр менен әнді.\n\nКөктегі Әкемнің айтқан сөзі балғын\nІнжу маржан Сөзін бауыр сенде алғын.\nКешірім алғанда күнәңды ақтайды\nАжалдан, апаттан жаныңды сақтайды.\n\nИем Жаратушым, Тәңірім, Бағушым!\nАтыңды даңқтаймын Иса Құтқарушым.\nШексіз мейіріңмен аштың құшағыңды.\nСыйладың Сен бізге ғажап жұмағыңды.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5995',
    title: 'О, Құдай Ием!',
    artist: 'Pete Sanchez Jr. (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #73 Kazakh worship (#5995 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/OKudai%20Iem%20Sen%20Alemdi.mp3',
    storage_path: null,
    duration_seconds: 136,
    lyrics:
      'О, Құдай Ием! Сен әлемді жараттың.\nСен барлық бұлттардан биіксің!\nСаған табынам, Саған табынам,\nСаған табынам Құдай Ием!\nО, Құдай Ием! Сен әлемді жараттың.\nСен барлық бұлттардан жоғарысың!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5998',
    title: 'Осы күнді Құдай жаратқан',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #74 Kazakh worship (#5998 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/04%20Osy%20kundi.mp3',
    storage_path: null,
    duration_seconds: 214,
    lyrics:
      'Осы күнді Құдай жаратқан\nШаттанамыз Оның алдында\n\nШаттан Тәңірге\n\nҚуан сен Оның алдында\nИса лайық құрмет алуға',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-8979',
    title: 'Ұлы Құдай, Әкелік мейіріммен',
    artist: 'Carl Boberg (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #75 Kazakh worship (#8979 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/rendered/veliki_boje%206.mp3',
    storage_path: null,
    duration_seconds: 195,
    lyrics:
      'Ұлы Құдай, Әкелік мейіріммен,\nСыйға тартып, нұрыңды төккенде,\nӨз қолыңмен Жаратушым жасаған,\nБар тіршілік, әлемді көргенде.\nТәңірім, сонда Саған рухым жырлайды:\nҰлысың Сен! Ұлысың Сен!.\n\nАспанға, жұлдыздарға көз салсам мен,\nҒажайып жарқын әлем жүзіне.\nМұхиттағы кемедей жүзіп жүрген,\nАй мен күнді әуеде көргенде.\n\nЖаратылыс көктемде құлпырғанда,\nЖұпар иісі кеудеме толғанда,\nБұлбұл әнін тоғайда естігенде,\nБұлақтың сылдырын тыңдағанда.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-12806',
    title: 'Жаман ойлар мазалайды жанымды',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #76 Kazakh worship (#12806 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/50.%20Zhaman%20oilar%20mazalaidy%20zhanymdy..mp3',
    storage_path: null,
    duration_seconds: 290,
    lyrics:
      'Жаман ойлар мазалайды жанымды.\nЖаным талай ойға еріп жаңылды.\nАрылмаған азаптың дәмін таттым ұзақ тым.\nҚайғысына көндім бір сәт тозақтың.\n\nҚиналғанда тек Өзіңді іздеймін, неге?\nАйтшы маған Тәңірім,\nқандай менің өмірім.\nСенсіз өткен мағынасыз әр күнім.\n\nЖан-дүнием сөздеріңе шөлдеген.\nРухым бірақ тірі әлі өлмеген.\nӘке дейді дауыстап, алақаныңнан ұстап.\nӨлі сезім, мәнсіз ойларды тастап.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-12851',
    title: 'О, Құдай Иса Тәңір Сенімен болғым келеді',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #77 Kazakh worship (#12851 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/O_%20K_u_daiym%20Ia_T_n_ir_%20Senimen%20bolg_ymyz%20keledi.mp3',
    storage_path: null,
    duration_seconds: 282,
    lyrics:
      'О, Құдай Иса Тәңір,\nСенімен болғым келеді!\nСыйладың бізге өмір,\nМәңгілік өміріңді!\n\nО, Тәңір, алғыс Саған!\nО, Құдай, мадақ Саған!\nҚұтқардың Сен, ұлың мен қызыңды!\n\nАлғысымыз, тек - Саған!\nМадақталсын Есімің!\nПаналаймыз, тек Сені,\nКиелі Патша - Құдайым Иса!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6553',
    title: 'Иешуа!',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #79 Kazakh worship (#6553 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Ieshua%20_3_.mp3',
    storage_path: null,
    duration_seconds: 185,
    lyrics:
      'Иешуа! Иешуа!\nИешуа! Иешуа!\n\nКелгейсің-Құтқарушымыз!\nҚастерлі Ием!\nҚауымың Сені күтуде!\nҚалыңдығың күтуде Сені!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6614',
    title: 'Иса - ғажайыпсың Сен',
    artist: 'Нургуль Амзеева',
    is_unknown_author: false,
    permission_note: 'Top #80 Kazakh worship (#6614 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Isa%20gazhaiypsyn%20Sen.mp3',
    storage_path: null,
    duration_seconds: 252,
    lyrics:
      'Иса-Тәңірім! Иса-өмірім!\nСенімен бірге, менің әр күнім.\nМәңгілікке Сен, өмір сыйладың!\nШындық сөзіңмен, нұр боп төгілген,\nБақыттымын мен, қуанышым - Сен!\nМәңгілік Иса - жеңіс сыйладың!\n\nҚұдайдың күші, көтерді мені биікке,\nЖеңістің рухын, қондырды маған жүрекке!\nМадақ әнімен, Сені көтерем!\nИса, ғажайыпсың - Сен, ғажайыпсың - Сен!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-12493',
    title: 'Ақ пейілді Ием менің',
    artist: 'Жанат Кусаинова',
    is_unknown_author: false,
    permission_note: 'Top #81 Kazakh worship (#12493 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Moi%20dobryi%20i%20blagoi%20Gospod_%20_na%20kazakhskom_%20%20kaum%20almaty%20Zhanna%20Kusainova.mp3',
    storage_path: null,
    duration_seconds: 417,
    lyrics:
      'Ақ пейілді Ием менің\nЗор сеніммен Саған келемін\nЖүрегімнен шыққан әнімен\nАлғысымды айтамын мен\nЖүректің төріне, Иса\nКүтемін, шақырам Сені\nАңсап, сағынамын жүзіңді\nКелші осы жерге.\n\n// Иса - Саған, басымды ием! //\n\n// Киелі, Сен Ұлысың, Сені сүйемін.\nСен сондай ғажапсың, Сені сүйемін.\nСен сондай кереметсің, Сені сүйемін.\nСен маған қымбатсың, Сені сүйемін! //',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-12556',
    title: 'Қуаныңдар, бүгін қуаныңдар!',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #82 Kazakh worship (#12556 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/01K_uanyn_dar%20bugin_%20k_uanyn_dar%20%20Track%2001.mp3',
    storage_path: null,
    duration_seconds: 262,
    lyrics:
      'Қуаныңдар, бүгін қуаныңдар!\nҚұтқарушым өмірге келген күн.\nПайғамбарлар айтқан, сағынып аңсаған,\nУәдесі жеткен күн.\n\nКеліңдер, бәрің де келіңдер,\nҰлылығын Тәңірдің көріңдер.\nСүйді Ол бізді бастан,\nКүнәға қарамастан,\nМахаббаты төгілген.\n\nШаттаныңдар, бүгін шаттаныңдар!\nКүнәнің құлдығынан босатып,\nЖүрекке Иса кірді, рухымыз тірілді\nБұрын өмірсіз болған.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-12780',
    title: 'Анық сенемін, менің Исам',
    artist: 'Fanny Crosby & Phoebe Knapp (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #84 Kazakh worship (#12780 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/6%20Anyk_%20senemin_%20menin_%20Isam_.mp3',
    storage_path: null,
    duration_seconds: 281,
    lyrics:
      'Анық сенемін, менің Исам,\nАспанның мұрасын берді маған.\nМені жұбатып, қуантады.\nИеленемін сол мұраны.\nСалтанат әнді айтам мәңгі,\nМенің ғажап Исам туралы!\n\nЖан-тәніммен Оған берілдім,\nИсаның перзенті енді болдым.\nТек одан табам нан мен сусын,\nТыныштыққа толды жүрегім.\nПана болды күшті қолымен,\nОған батыл анық сенемін мен.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-102485',
    title: 'Мұхит',
    artist: 'Joel Houston (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #85 Kazakh worship (#102485 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/3%20Mu_khit.mp3',
    storage_path: null,
    duration_seconds: 270,
    lyrics:
      'Су бетімен кел деп шақырдың\nКім жүрген су үстімен\nСонда жүзіңді мен көремін\nСу үстінде сенім артсам\n\nАтыңды мен шақырамын\nкөзімді тек Саған қадап\nСу буырқанса\nЖаным табар тыным Сенен\nМен Сендікпін, Сен мендіксің\n\nКиелі Рух сенімім менің шектелмес\nЖүргізсең кешіп су бетін\nШақырсаң мен барамын\nМені аяқ баспаған жерге апаршы\nСенімім нығайып өссін\nҚұтқарушымның алдында',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5808',
    title: 'Киелі Әке',
    artist: 'Жанат Кусаинова',
    is_unknown_author: false,
    permission_note: 'Top #87 Kazakh worship (#5808 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Sviatomu%20Ottsu%20pokloniaius_%20_na%20kazakhskom_%20%20Zhanat%20Kusainova.mp3',
    storage_path: null,
    duration_seconds: 333,
    lyrics:
      'Айқыш ағашта қиналдың\nКиелі қаныңды төктің\nИса рахмет Саған\nБарлық күнәмді кешірдің\nЖаңа өмірді сыйладың,\nИса рахмет Саған!\n\nТүнектің қақпасын Сен жаптың,\nӘкеме жолымды Сен аштың!\nКиелі Әкеме табынамын,\nТабынамын өміріммен.\nКиелі Әкеме мен арнаймын,\nМен арнаймын жүрегімді.\nКиелі Әкеме бағыштаймын,\nБағыштаймын сенімімді.\nКиелі Әкеме бас иемін,\nМен сүйемін мәңгілікке!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5862',
    title: 'Жас кезімнен мені сақтап жүрдің Сен',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #88 Kazakh worship (#5862 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/07%20Zhas%20kezimnen%20meni%20sak_tap%20zhurdin_%20Sen%20Track%207.mp3',
    storage_path: null,
    duration_seconds: 377,
    lyrics:
      'Жас кезімнен мені сақтап тұрдың Сен,\nӨмірімнің қиындығын көріп Сен.\nҚұтқардың ғой сол қиындық кездерден,\nТанып Сені Әке жүрмін енді мен.\n\nЖан Ә--кем! Мейірімді Әкем!\nСа-ғын-дым мен Сені, мейірім-ді Әкем!\n\nӨмір бойы ойымда Сен тұрасың,\nҰлың Иса Мәсіх арқылы тірілдім.\nБұл өмірде Сенің асыл Сөзіңе\nЖүрегімнің төрінен жай беремін.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6611',
    title: 'Әр бір айтқан сөзіңді',
    artist: 'Самат и Майя Рахимгалиева',
    is_unknown_author: false,
    permission_note: 'Top #89 Kazakh worship (#6611 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Ar%20bir%20aitkan%20sozindi.mp3',
    storage_path: null,
    duration_seconds: 260,
    lyrics:
      'Әрбір айтқан сөзіңді, мен аңсаймын Тәңірім!\nЖарылқауға толады, бүкіл менің өмірім!\n\nСені көргім келеді Иса-Құтқарушымсың менің!\nСенімен болғым келеді, мәңгілікке, тек Сенімен!\n\nАлып бердің азаттық, Өз-киелі қаныңмен,\nШындық жолмен келемін, салып берген Рухыңмен!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-9792',
    title: 'Мәсіхтегі азаттық',
    artist: 'Арман Кайназаров',
    is_unknown_author: false,
    permission_note: 'Top #101 Kazakh worship (#9792 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/06%20M_sikhtegi%20azattyk_%20Arman_%2006.mp3',
    storage_path: null,
    duration_seconds: 235,
    lyrics:
      'Мәсіхтегі азаттық\nЖанға берді бостандық\nМейірімін білдірген,\nЖалғыз Иса Ием!\nМәсіхтегі азаттық\nЖұбаныш пен тыныштық!\nӨмірдегі береке,\nЖалғыз Иса Ием!\n\nМерейімді өсірді,\nЖаңа болмыс сыйлады,\nМаған берген шаттығы,\nЖан дүниеме симады!\nҮмітімді жалғады,\nНұрлы күнге алдағы,\nСенімімді оятты махаббаты!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-12841',
    title: 'Ыбрайымның Құдайы',
    artist: 'John Louden (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #102 Kazakh worship (#12841 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/178%20Ybraiymnyn_%20K_u_daiy_.mp3',
    storage_path: null,
    duration_seconds: 227,
    lyrics:
      'Ыбрайымның Құдайы,\nБіз үшін қан төккен.\nҚұрбандыққа Иса,\nкелді көктен.\n\nТағзым етіп алдына келемін,\nӘділетті Патшамның!\nТағзым етіп алдына келемін,\nМейірімді Патшамның!\n\nСүйіп бізді құтқарды,\nТәңіріміз ұлы.\nМәңгі тірі сөздері,\nтиеді жылы.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-91693',
    title: 'Мұхиттар',
    artist: 'Joel Houston (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #103 Kazakh worship (#91693 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/downloaded/25683-52154.mp3',
    storage_path: null,
    duration_seconds: 512,
    lyrics:
      'Үндедің мені тереңдікке -\nАяқ баспаған ұлы ғайып.\nСол құпиядан таптым Сені,\nТұңғиықта сенімім берік.\n\nАтыңмен Сені шақырам\nТолқындардан көз аударам\nСаған, Құдай, жаным демалсын қолыңда\nМен Сенікімін, меніңсің Сен.\n\nМейріміңе тереңдік толы,\nЖөн сілтейді Маңғаз қолың.\nҚорқыныш анталасқан жерде,\nТірегім Сенсің әрдайым.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-99364',
    title: 'Әрбір Адамзат',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #104 Kazakh worship (#99364 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Men%20Ony%20madak_taimyn.mp3',
    storage_path: null,
    duration_seconds: 176,
    lyrics:
      'Әрбір адамзат Исаға келіп\nАлдында тізе бүгеді\nӘрбір тіл біткен\nпенде мойындайды\nИса мәңгілік Тәңір\n\nМен Оны мадақтаймын\nМен Оны даңқтаймын\nӘр күні Оның атын мадақтаймын\nИса, Иса\nИса Аллелуйя Иса!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-99411',
    title: 'Біздің Құдай',
    artist: 'Matt Redman (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #105 Kazakh worship (#99411 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/downloaded/1814-49385.mp3',
    storage_path: null,
    duration_seconds: 320,
    lyrics:
      'Судан шарап жасадың,\nСоқыр көздерді аштың.\nТең жоқ Саған Құдай,\nЖоқ Сен сияқты\nШаңнан бізді көтердің,\nҚараңғы нұр төктің.\nТең жоқ Саған Тәңір,\nЖоқ Сен сияқты!\n\nБіздің Құдай ұлы, Ол құдіретті,\nҚұдай, Сен барлығынан жоғарысың!\nБіздің Құдай емші, шексіз Оның күші,\nО, Құдай! Біздің Құдай!\n\nЕгер Құдай бізбен болса,\nКім жолымызда тұрады?\nЕгер Құдай бізбен болса,\nКім қарсы болады бізге?',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5809',
    title: 'Арайлы бүгін таң атты',
    artist: 'Әбдуалиева Жүлдыз',
    is_unknown_author: false,
    permission_note: 'Top #106 Kazakh worship (#5809 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/9%20Araily%20bugin%20tan_%20atty_.mp3',
    storage_path: null,
    duration_seconds: 124,
    lyrics:
      'Арайлы бүгін таң атты,\nҚұшағын Құдай бізге ашты.\nКездесіп бүгін, Тәңірім,\nТағзым еттім алдыңда.\n\nСездің бе жүрек, сездің бе?\nКездесер күнді Құдаймен.\nКештің бе мені, кештің бе?\nКүнәмды менің Құдайым.\n\nСенімен болу тамаша,\nҚолымды бердім балаша.\nЖетелеп мені келесің,\nТастама, Иса, тастама.\n\nКөнліңді бұршы жеріме,\nҚазақ деген еліме.\nЖалынып, Иса, сұраймын,\nҚұтқаршы қазақ елімді',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5877',
    title: 'Иса, Иса!',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #107 Kazakh worship (#5877 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Isa%20Isa%20kieli%20tan_dalg_an.mp3',
    storage_path: null,
    duration_seconds: 268,
    lyrics:
      'Иса, Иса!\nКиелі таңдалған Иса!\nИса, Иса!\nТірілген Жаратқан Иса!\nСенің атың бал сияқты ерніме,\nСенің Рухың су сияқты жаныма.\nСені сүйемін-ау, Иса!\n\nЖаратқан Ием жалынам Саған!\nЖаратқан Ием бата бер маған!\nСөзіңді Сенің таратайын,\nХалқыма Сені аңсаған!',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5893',
    title: 'Күлімдеп күннің көзі',
    artist: 'Шынтеміров Әбілхайыр',
    is_unknown_author: false,
    permission_note: 'Top #108 Kazakh worship (#5893 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/106.%20Kulimdep%20kunnin_%20kozi_%20boiyma%20zhylu%20berdi..mp3',
    storage_path: null,
    duration_seconds: 189,
    lyrics:
      'Күлімдеп күннің көзі,\nБойыма жылу берді.\nКиелі Тәңір Сөзі,\nЖаныма қуат берді.\n\nТәңірім, сүйем деді.\nЖанарым күлімдеді.\nАрманым бұдан артық,\nБар ма еді?\n\nЖарқырап көрінеді,\nМәңгілік өмір лебі.\nЖүректен сезіледі,\nТәңірдің ыстық демі.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-5988',
    title: 'Міне қандай көп туыс',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #109 Kazakh worship (#5988 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Mine%20kandai.mp3',
    storage_path: null,
    duration_seconds: 163,
    lyrics:
      'Міне қандай көп туыс,\nКерек емес басқасы.\nЫстық сәлем жолдаймыз\nМәсіхшілер отбасы.\nОлар бізге тым ыстық\nМәсіхтегі бауырлар.\nТілейміз біз тыныштық,\nАмансың ба, бар достар?\n\nМадақ достыққа киелі,\nЖүрекке жылы тиеді.\nАғайындарын көргенде\nШешілді сырдың тиегі.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6009',
    title: 'Рақымын төгіп құтқарды бізді',
    artist: 'Нұр',
    is_unknown_author: false,
    permission_note: 'Top #110 Kazakh worship (#6009 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/Rahymyn%20togip%20k_u_tk_ardy%20bizdi.mp3',
    storage_path: null,
    duration_seconds: 331,
    lyrics:
      'Рақымын төгіп құтқарды бізді\nТозақтың мәңгі отынан.\nҚұтқарды бізді жан-рухымызды\nШайтанның шырмауынан.\n\nАлғыс Саған, алғыс Саған.\nЖасасын Иса, мәңгіге Иса,\nМәңгіге Иса - Жеңімпаз!\n\nШайтанды жеңді Өз жанын қиып,\nҚағылып айқыш ағашта.\nКиелі қанын біз үшін төгіп\nТазартты күнәмыздан.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6013',
    title: 'Сенің махаббатың жарқырап тұр',
    artist: 'Graham Kendrick (Қазақша аударма)',
    is_unknown_author: false,
    permission_note: 'Top #111 Kazakh worship (#6013 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/rendered/Senin__makhabbatyn__zhark_yrap_tu_r.mp3',
    storage_path: null,
    duration_seconds: 77,
    lyrics:
      'Сенің махаббатың жарқырап тұр,\nҚараңғыда жарқырап тұр.\nИса, әлемге жарқырашы,\nБізді күнәдан босатшы.\nЖарқырашы, Иса! Жарқырашы Иса!\n\nЖарқырашы, Иса!\nӘлемді жарқыратшы Иса\nБіздің жүректер,\nСенің Рухыңмен толсын.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6034',
    title: 'Тазалап мені арылттың мүлде күнәдан',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #112 Kazakh worship (#6034 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/167%20Tazalap%20meni_%20arylttyn_%20mulde%20kun_dan..mp3',
    storage_path: null,
    duration_seconds: 166,
    lyrics:
      'Тазалап мені арылттың мүлде күнәдан,\nАлғысымды айтам шын жүрекпенен мен Саған.\nМәңгілік сүю шын көңілменен Исадан,\nИса сүйеді, Иса сүйеді.\n\nӨмірдің мәнін түсіндім енді жаңадан,\nҚуаныш шексіз тасиды толқып шамадан.\nӨзгертті Иса жасады менен жаңа адам,\nИса сүйеді, Иса сүйеді.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-6494',
    title: 'Дүниені бір сөзіңмен жараттың',
    artist: 'Әбдуалиева Жүлдыз',
    is_unknown_author: false,
    permission_note: 'Top #113 Kazakh worship (#6494 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/32%20Dunieni%20bir%20sozin_men%20zharattyn_.mp3',
    storage_path: null,
    duration_seconds: 232,
    lyrics:
      'Дүниені бір сөзіңмен жараттың\nӘлемді шындығыңа қараттың\nРухыңмен Киелі сенім бойлатып,\nОсы әнді жүрегімде ояттың.\n\nО, Иса, Сен әлемнің тірегі,\nАдамзаттың тілегі, Тіршіліктің өзегі\nО, Иса әмір бердің өмірге\nСенген адам Өзіңе, Тірілсін деп мәңгіге.',
    play_count: 0,
    uploaded_by: 'developer',
    status: 'published',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'song-8866',
    title: '«Болсын!» десең, әлем болар бұдан басқа',
    artist: 'Белгісіз автор',
    is_unknown_author: true,
    permission_note: 'Top #114 Kazakh worship (#8866 · worshipleaderapp.com)',
    audio_url: 'https://repo.worshipleaderapp.com/mp3/01%20_Bolsing_%20_%20Deseng.mp3',
    storage_path: null,
    duration_seconds: 183,
    lyrics:
      '«Болсын!» десең, әлем болады бұдан басқа,\n«Шықсын!» десең, гүлдер шығады қара тасқа.\nГүлденген жер күлге айналады, теңіз құрғап,\nКенеттен ұлы Құдай қаһарланса.\n\nСиынамыз - бір Құдайға,\nҚорғаушымыз - бір Құдайға,\nСоттаушымыз - бір Құдайға.',
    play_count: 0,
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
    play_count: 0,
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
    play_count: 0,
    uploaded_by: 'community',
    status: 'published',
    is_active: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

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
    const raw = localStorage.getItem(SONGS_KEY);
    const base = raw ? (JSON.parse(raw) as Song[]) : DEFAULT_LOCAL_SONGS;
    const reset = base.map((s) => ({ ...s, play_count: 0 }));
    localStorage.setItem(SONGS_KEY, JSON.stringify(reset));
    localStorage.setItem(WEEKLY_RESET_KEY, String(Date.now()));
    return reset;
  } catch {
    return DEFAULT_LOCAL_SONGS;
  }
}

export function getLocalSongs(): Song[] {
  try {
    const raw = localStorage.getItem(SONGS_KEY);
    if (!raw) {
      localStorage.setItem(SONGS_KEY, JSON.stringify(DEFAULT_LOCAL_SONGS));
      localStorage.setItem(WEEKLY_RESET_KEY, String(Date.now()));
      return DEFAULT_LOCAL_SONGS;
    }
    const songs = JSON.parse(raw) as Song[];
    const { lastResetAt } = getWeeklyChartInfo();
    if (Date.now() - lastResetAt >= WEEK_MS) {
      const reset = songs.map((s) => ({ ...s, play_count: 0 }));
      localStorage.setItem(SONGS_KEY, JSON.stringify(reset));
      localStorage.setItem(WEEKLY_RESET_KEY, String(Date.now()));
      return reset;
    }
    return songs;
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

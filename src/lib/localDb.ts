import type { Song, SongReport } from '../types';

const DB_NAME = 'kwp_offline_db';
const DB_VERSION = 1;
const BLOB_STORE = 'offline_blobs';
const SONGS_KEY = 'kwp_local_songs_v6';
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
    play_count: 149,
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
    play_count: 146,
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
    play_count: 143,
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
    play_count: 140,
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
    play_count: 138,
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
    play_count: 136,
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
    play_count: 134,
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
    play_count: 133,
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
    play_count: 131,
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
    play_count: 130,
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
    play_count: 129,
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
    play_count: 128,
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
    play_count: 127,
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
    play_count: 126,
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
    play_count: 125,
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
    play_count: 124,
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
    play_count: 122,
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
    play_count: 120,
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
    play_count: 118,
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
    play_count: 116,
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
    play_count: 114,
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
    play_count: 112,
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
    play_count: 110,
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
    play_count: 108,
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
    play_count: 106,
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
    play_count: 104,
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
    play_count: 102,
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
    play_count: 100,
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
    play_count: 99,
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
    play_count: 97,
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
    play_count: 95,
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
    play_count: 93,
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
    play_count: 91,
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
    play_count: 89,
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
    play_count: 87,
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
    play_count: 85,
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
    play_count: 83,
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
    play_count: 81,
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

import type { Language } from '../types';

const CACHE_KEY = 'kwp_ru_ko_cache_v1';
const MAX_CACHED_SONGS = 100;

interface RuKoCacheStore {
  order: string[];
  entries: Record<string, Record<string, string>>;
}

// Hangul Jamo tables
// CHO (19): 0:ㄱ 1:ㄲ 2:ㄴ 3:ㄷ 4:ㄸ 5:ㄹ 6:ㅁ 7:ㅂ 8:ㅃ 9:ㅅ 10:ㅆ 11:ㅇ 12:ㅈ 13:ㅉ 14:ㅊ 15:ㅋ 16:ㅌ 17:ㅍ 18:ㅎ
// JUNG (21): 0:ㅏ 1:ㅐ 2:ㅑ 3:ㅒ 4:ㅓ 5:ㅔ 6:ㅕ 7:ㅖ 8:ㅗ 9:ㅘ 10:ㅙ 11:ㅚ 12:ㅛ 13:ㅜ 14:ㅝ 15:ㅞ 16:ㅟ 17:ㅠ 18:ㅡ 19:ㅢ 20:ㅣ
// JONG (28): 0:'' 1:ㄱ 4:ㄴ 8:ㄹ 16:ㅁ 17:ㅂ 21:ㅇ

const VOWEL_JUNG: Record<string, number> = {
  а: 0, // ㅏ
  э: 5, // ㅔ
  о: 8, // ㅗ
  у: 13, // ㅜ
  ы: 18, // ㅡ
  и: 20, // ㅣ
  я: 2, // ㅑ
  е: 7, // ㅖ (becomes 5 ㅔ after consonant or soft cluster depending on context)
  ё: 12, // ㅛ
  ю: 17, // ㅠ
};

const CONSONANT_CHO: Record<string, number> = {
  г: 0, // ㄱ
  н: 2, // ㄴ
  д: 3, // ㄷ
  т: 4, // ㄸ (closer to unaspirated Russian т than aspirated ㅌ)
  л: 5, // ㄹ
  р: 5, // ㄹ
  м: 6, // м
  б: 7, // ㅂ
  в: 7, // ㅂ
  с: 9, // ㅅ
  ж: 12, // ㅈ
  з: 12, // ㅈ
  ц: 14, // ㅊ
  ч: 14, // ㅊ
  к: 15, // ㅋ
  п: 17, // ㅍ
  ф: 17, // ㅍ
  х: 18, // ㅎ
  ш: 9, // ㅅ (with ㅠ/ㅡ)
  щ: 9, // ㅅ (with ㅣ/ㅠ)
};

// Coda allowed when this consonant closes a CV syllable before another consonant or word end
const CODA_JONG: Record<string, number> = {
  л: 8, // ㄹ
  м: 16, // ㅁ
  н: 4, // ㄴ
  к: 1, // ㄱ (only for doubled кк)
  п: 17, // ㅂ (only for doubled пп)
};

function composeHangul(cho: number, jung: number, jong = 0): string {
  return String.fromCharCode(0xac00 + (cho * 21 + jung) * 28 + jong);
}

function isCyrillicLetter(ch: string): boolean {
  return /[А-Яа-яЁё]/.test(ch);
}

function transliterateWord(word: string): string {
  const lower = word.toLowerCase();
  const len = lower.length;
  let i = 0;
  let out = '';

  const isVowel = (ch: string) => ch in VOWEL_JUNG;
  const isConsonant = (ch: string) => ch in CONSONANT_CHO;

  while (i < len) {
    const ch = lower[i];

    // Skip hard/soft signs; they modify surrounding letters subtly
    if (ch === 'ъ' || ch === 'ь') {
      i += 1;
      continue;
    }

    if (ch === 'й') {
      // If followed by я/ю/е/о, fuse naturally (Аллилуйя -> 알릴루야)
      const next = lower[i + 1];
      if (next === 'я' || next === 'ю' || next === 'е' || next === 'о') {
        i += 1;
        continue;
      }
      // After 'и', ий sounds like single '이'
      if (i > 0 && lower[i - 1] === 'и') {
        i += 1;
        continue;
      }
      out += '이';
      i += 1;
      continue;
    }

    if (isVowel(ch)) {
      let jung = VOWEL_JUNG[ch];
      if (ch === 'е' && i > 0 && lower[i - 1] === 'ь') {
        jung = 7; // ㅖ
      }
      // Check if next consonant can close this syllable cleanly (н, м, л before consonant/end)
      let jong = 0;
      const next = lower[i + 1];
      const next2 = lower[i + 2];
      if (
        next &&
        (next === 'н' || next === 'м' || next === 'л') &&
        (!next2 || (!isVowel(next2) && next2 !== 'ь' && next2 !== 'ъ' && next2 !== 'й') || next2 === next)
      ) {
        jong = CODA_JONG[next];
        out += composeHangul(11, jung, jong);
        i += next2 === next ? 2 : 2;
        continue;
      }
      out += composeHangul(11, jung, 0);
      i += 1;
      continue;
    }

    if (isConsonant(ch)) {
      const cho = CONSONANT_CHO[ch];
      let j = i + 1;
      // Check for soft/hard sign right after consonant
      const hasSoft = lower[j] === 'ь';
      if (hasSoft || lower[j] === 'ъ') {
        j += 1;
      }

      const next = lower[j];
      if (next && isVowel(next)) {
        let jung = VOWEL_JUNG[next];
        if (next === 'е') {
          // After ch/sh/sch/ts/zh -> 에 (5); after other consonants -> ㅖ or ㅔ (ㅔ looks cleaner for те/не/се)
          jung = ch === 'ч' || ch === 'ш' || ch === 'щ' || ch === 'ж' || ch === 'ц' ? 5 : hasSoft ? 7 : 5;
        }
        if ((ch === 'ч' || ch === 'ш' || ch === 'щ') && (next === 'я' || next === 'ю' || next === 'а' || next === 'у')) {
          if (ch === 'ч' && next === 'а') jung = 0;
          if (ch === 'ч' && next === 'у') jung = 13;
        }
        if (ch === 'щ' && next === 'а') jung = 2; // 샤
        if (ch === 'щ' && next === 'у') jung = 17; // 슈

        let jong = 0;
        const afterV = lower[j + 1];
        const afterV2 = lower[j + 2];
        if (
          afterV &&
          (afterV === 'н' || afterV === 'м' || afterV === 'л') &&
          (!afterV2 || !isVowel(afterV2) || afterV2 === afterV) &&
          afterV2 !== 'ь' &&
          afterV2 !== 'й'
        ) {
          jong = CODA_JONG[afterV];
          out += composeHangul(cho, jung, jong);
          i = j + 2;
          continue;
        }

        out += composeHangul(cho, jung, 0);
        i = j + 1;
        continue;
      }

      // Consonant with no following vowel -> use ㅡ (18), or ㅣ for soft/ch/shch/sh
      let epentheticJung = 18; // ㅡ
      if (
        ch === 'ч' ||
        ch === 'щ' ||
        ch === 'ш' ||
        (hasSoft && (ch === 'л' || ch === 'н' || ch === 'т' || ch === 'д' || ch === 'в' || ch === 'б'))
      ) {
        epentheticJung = 20; // ㅣ (e.g. Наш -> 나쉬/나시, Кровь -> 크로비)
      }

      // If this consonant is immediately followed by 'л' + vowel, add ㄹ coda so Слава -> 슬라바, благо -> 블라고
      const epentheticJong =
        !hasSoft && lower[j] === 'л' && lower[j + 1] && isVowel(lower[j + 1]) ? 8 : 0;

      // Skip doubled consonant without vowel
      if (lower[i + 1] === ch && !isVowel(lower[i + 2] || '')) {
        i += 1;
      }

      out += composeHangul(cho, epentheticJung, epentheticJong);
      i += hasSoft || lower[i + 1] === 'ъ' ? 2 : 1;
      continue;
    }

    out += word[i];
    i += 1;
  }

  return out;
}

export function isRussianLyrics(
  songLang?: Language,
  songId?: string,
  lyrics?: string | null
): boolean {
  if (songLang === 'ru' || songId?.startsWith('song-ru-')) {
    return true;
  }
  if (!lyrics) return false;
  const hasCyrillic = /[А-Яа-яЁё]/.test(lyrics);
  const hasKazakhSpecific = /[ӘәҒғҚқҢңӨөҰұҮүҺһІі]/.test(lyrics);
  return hasCyrillic && !hasKazakhSpecific;
}

export function transliterateRussianToKorean(input: string): string {
  if (!input) return '';
  return input.replace(/[А-Яа-яЁё]+/g, (word) =>
    isCyrillicLetter(word[0]) ? transliterateWord(word) : word
  );
}

function readCacheStore(): RuKoCacheStore {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return { order: [], entries: {} };
    const parsed = JSON.parse(raw) as RuKoCacheStore;
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.order) || !parsed.entries) {
      return { order: [], entries: {} };
    }
    return parsed;
  } catch {
    return { order: [], entries: {} };
  }
}

function writeCacheStore(store: RuKoCacheStore): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage quota errors
  }
}

export function getCachedRussianTranslation(songKey: string): Record<string, string> | null {
  const store = readCacheStore();
  return store.entries[songKey] ?? null;
}

export async function translateRussianLinesToKorean(
  songKey: string,
  lines: string[]
): Promise<Record<string, string>> {
  const uniqueLines = Array.from(
    new Set(lines.map((l) => l.trim()).filter((l) => l.length > 0 && /[А-Яа-яЁё]/.test(l)))
  );

  const existing = getCachedRussianTranslation(songKey) ?? {};
  const missing = uniqueLines.filter((l) => !existing[l]);

  if (missing.length === 0) {
    return existing;
  }

  const merged: Record<string, string> = { ...existing };

  // Process up to 150 lines per request
  for (let i = 0; i < missing.length; i += 150) {
    const batch = missing.slice(i, i + 150);
    const res = await fetch('/api/translate-lyrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lines: batch, source: 'ru', target: 'ko' }),
    });
    if (!res.ok) {
      throw new Error(`Translation failed (${res.status})`);
    }
    const data = (await res.json()) as { translations?: string[] };
    const translations = Array.isArray(data.translations) ? data.translations : [];
    batch.forEach((src, idx) => {
      const tr = translations[idx]?.trim();
      if (tr) {
        merged[src] = tr;
      }
    });
  }

  const store = readCacheStore();
  store.order = [songKey, ...store.order.filter((k) => k !== songKey)];
  store.entries[songKey] = merged;
  while (store.order.length > MAX_CACHED_SONGS) {
    const evicted = store.order.pop();
    if (evicted) delete store.entries[evicted];
  }
  writeCacheStore(store);

  return merged;
}

const WORD_CACHE_KEY = 'kwp_ru_word_cache_v1';
const VOCAB_KEY = 'kwp_ru_vocab_v1';
const MAX_CACHED_WORDS = 500;

export interface RussianWordInfo {
  word: string;
  normalized: string;
  readingKo: string;
  romanization?: string;
  meaning: string;
  pos?: string;
  note?: string;
  dictEntries?: Array<{ pos: string; terms: string[] }>;
}

const WORSHIP_RU_DICT: Record<string, { meaning: string; pos?: string; note?: string }> = {
  бог: { meaning: '하나님', pos: '명사', note: '원형 Бог (주격)' },
  бога: { meaning: '하나님(을/의)', pos: '명사', note: 'Бог의 생격·대격' },
  богу: { meaning: '하나님께', pos: '명사', note: 'Бог의 여격 (~에게)' },
  боже: { meaning: '하나님이여', pos: '명사', note: 'Бог의 호격 (부름)' },
  божий: { meaning: '하나님의, 거룩한', pos: '형용사', note: 'Бог에서 파생된 형용사' },
  господь: { meaning: '주님, 여호와', pos: '명사', note: '원형 Господь' },
  господи: { meaning: '주여, 주님', pos: '명사', note: '기도할 때 부르는 호격' },
  господа: { meaning: '주님(을/의)', pos: '명사', note: 'Господь의 생격·대격' },
  иисус: { meaning: '예수님', pos: '고유명사', note: '예수 그리스도' },
  иисуса: { meaning: '예수님(을/의)', pos: '고유명사', note: 'Иисус의 생격·대격' },
  христос: { meaning: '그리스도', pos: '명사', note: '기름 부음 받은 자' },
  христа: { meaning: '그리스도(를/의)', pos: '명사', note: 'Христос의 생격·대격' },
  слава: { meaning: '영광, 찬양', pos: '명사', note: '원형 слава (여성 명사)' },
  славу: { meaning: '영광을', pos: '명사', note: 'слава의 대격 (~을/를)' },
  славь: { meaning: '찬양하라', pos: '동사', note: 'славить의 명령형' },
  святой: { meaning: '거룩한', pos: '형용사', note: '원형 святой' },
  святое: { meaning: '거룩한 것, 지성소', pos: '형용사', note: '중성 단수 (святое святых = 지성소)' },
  святых: { meaning: '지성소 / 거룩한 이들의', pos: '형용사', note: '복수 생격 (святое святых = 지성소)' },
  святую: { meaning: '거룩한(여성 대격)', pos: '형용사', note: 'святая의 대격' },
  кровь: { meaning: '피, 보혈', pos: '명사', note: '여성 명사 (대격·주격 동일)' },
  крови: { meaning: '피(의/로)', pos: '명사', note: 'кровь의 생격·전치격' },
  любовь: { meaning: '사랑', pos: '명사', note: '원형 любовь (여성 명사)' },
  любви: { meaning: '사랑(의/에)', pos: '명사', note: 'любовь의 생격·여격' },
  любит: { meaning: '사랑하신다', pos: '동사', note: 'любить 3인칭 단수 현재' },
  милость: { meaning: '자비, 긍휼, 은혜', pos: '명사', note: '구약의 헤세드(인자하심)' },
  милости: { meaning: '자비, 긍휼(의)', pos: '명사', note: 'милость의 생격/복수' },
  благодать: { meaning: '은혜', pos: '명사', note: '값없이 주시는 하나님의 은혜' },
  благодати: { meaning: '은혜(의/로)', pos: '명사', note: 'благодать의 생격·전치격' },
  отец: { meaning: '아버지', pos: '명사', note: '하나님 아버지' },
  отца: { meaning: '아버지(를/의)', pos: '명사', note: 'отец의 생격·대격' },
  отче: { meaning: '아버지여', pos: '명사', note: '주기도문(Отче наш)의 호격' },
  дух: { meaning: '영, 성령', pos: '명사', note: 'Святой Дух = 성령' },
  духа: { meaning: '영(의/을)', pos: '명사', note: 'дух의 생격·대격' },
  духом: { meaning: '영으로, 성령으로', pos: '명사', note: 'дух의 조격 (~으로)' },
  царь: { meaning: '왕', pos: '명사', note: 'Царь царей = 만왕의 왕' },
  царя: { meaning: '왕(을/의)', pos: '명사', note: 'царь의 생격·대격' },
  сердце: { meaning: '마음, 심장', pos: '명사', note: '중성 명사' },
  сердца: { meaning: '마음들 / 마음의', pos: '명사', note: 'сердце의 생격·복수' },
  душа: { meaning: '영혼', pos: '명사', note: '여성 명사' },
  души: { meaning: '영혼(의/들)', pos: '명사', note: 'душа의 생격·복수' },
  жизнь: { meaning: '생명, 삶', pos: '명사', note: '원형 жизнь' },
  жизни: { meaning: '생명(의)', pos: '명사', note: 'жизнь의 생격·여격' },
  жизнью: { meaning: '생명으로', pos: '명사', note: 'жизнь의 조격 (~으로)' },
  свобода: { meaning: '자유', pos: '명사', note: '그리스도 안의 자유' },
  свободу: { meaning: '자유를', pos: '명사', note: 'свобода의 대격' },
  сила: { meaning: '힘, 능력, 권능', pos: '명사', note: '여성 명사' },
  силу: { meaning: '능력을', pos: '명사', note: 'сила의 대격' },
  свет: { meaning: '빛', pos: '명사', note: '세상의 빛' },
  света: { meaning: '빛(의)', pos: '명사', note: 'свет의 생격' },
  мир: { meaning: '평강, 평화 / 세상', pos: '명사', note: '문맥에 따라 평화 또는 세상' },
  мира: { meaning: '세상(의) / 평화의', pos: '명사', note: 'мир의 생격' },
  надежда: { meaning: '소망, 희망', pos: '명사', note: '여성 명사' },
  надежду: { meaning: '소망을', pos: '명사', note: 'надежда의 대격' },
  вера: { meaning: '믿음, 신앙', pos: '명사', note: '여성 명사' },
  веру: { meaning: '믿음을', pos: '명사', note: 'вера의 대격' },
  хвала: { meaning: '찬양, 찬미', pos: '명사', note: '여성 명사' },
  хвалы: { meaning: '찬양의', pos: '명사', note: 'хвала의 생격' },
  хвале: { meaning: '찬양 가운데', pos: '명사', note: 'хвала의 전치격·여격' },
  поклоняюсь: { meaning: '경배합니다', pos: '동사', note: 'поклоняться 1인칭 단수' },
  поклонение: { meaning: '경배, 예배', pos: '명사', note: '중성 명사' },
  аллилуйя: { meaning: '할렐루야', pos: '감탄사', note: '여호와를 찬양하라' },
  осанна: { meaning: '호산나', pos: '감탄사', note: '이제 구원하소서' },
  аминь: { meaning: '아멘', pos: '감탄사', note: '진실로 그러합니다' },
  спаситель: { meaning: '구원자, 구주', pos: '명사', note: 'спасать(구원하다)에서 파생' },
  спасение: { meaning: '구원', pos: '명사', note: '중성 명사' },
  крест: { meaning: '십자가', pos: '명사', note: '남성 명사' },
  кресте: { meaning: '십자가 위에서', pos: '명사', note: 'крест의 전치격' },
  небо: { meaning: '하늘', pos: '명사', note: '단수' },
  небеса: { meaning: '하늘(들)', pos: '명사', note: 'небо의 복수형' },
  небесах: { meaning: '하늘에서', pos: '명사', note: '복수 전치격' },
  земля: { meaning: '땅, 지구', pos: '명사', note: '여성 명사' },
  земли: { meaning: '땅(의)', pos: '명사', note: 'земля의 생격' },
  землей: { meaning: '온 땅으로 / 땅 위에', pos: '명사', note: 'земля의 조격' },
  землёй: { meaning: '온 땅으로', pos: '명사', note: 'земля의 조격' },
  вечный: { meaning: '영원한', pos: '형용사', note: '변치 않는' },
  вечно: { meaning: '영원히', pos: '부사', note: '늘, 영원토록' },
  веках: { meaning: '세세에, 대대로', pos: '명사', note: 'в веках = 영원무궁토록' },
  всемогущий: { meaning: '전능하신', pos: '형용사', note: '모든 것이 가능하신' },
  искупил: { meaning: '구속(대속)하셨다', pos: '동사', note: 'искупить(값을 치르고 건지다) 과거형' },
  творец: { meaning: '창조주', pos: '명사', note: '만물을 지으신 분' },
  творца: { meaning: '창조주(를/의)', pos: '명사', note: 'творец의 생격·대격' },
  тебе: { meaning: '주님께, 당신에게', pos: '대명사', note: 'ты(당신)의 여격·전치격' },
  тебя: { meaning: '주님을, 당신을', pos: '대명사', note: 'ты(당신)의 생격·대격' },
  тобой: { meaning: '주님으로 말미암아, 주님과 함께', pos: '대명사', note: 'ты의 조격 (~와 함께/~로)' },
  мой: { meaning: '나의 (남성)', pos: '대명사', note: '예: мой Бог (나의 하나님)' },
  моя: { meaning: '나의 (여성)', pos: '대명사', note: '예: моя душа (내 영혼)' },
  мою: { meaning: '나의(을/를)', pos: '대명사', note: 'моя의 대격' },
  моего: { meaning: '나의(의)', pos: '대명사', note: 'мой의 생격' },
  твой: { meaning: '주의, 당신의 (남성)', pos: '대명사', note: '경배 대상은 대문자 Т' },
  твоя: { meaning: '주의, 당신의 (여성)', pos: '대명사', note: '예: Твоя любовь (주의 사랑)' },
  твою: { meaning: '주의, 당신의 (대격)', pos: '대명사', note: 'Твоя의 대격' },
  твоей: { meaning: '주의, 당신의 (생격/여격)', pos: '대명사', note: 'Твоя의 간접격' },
  ты: { meaning: '주님, 당신', pos: '대명사', note: '하나님을 친밀하게 부르는 2인칭' },
  я: { meaning: '나', pos: '대명사', note: '1인칭 단수' },
  мы: { meaning: '우리', pos: '대명사', note: '1인칭 복수' },
  наш: { meaning: '우리의', pos: '대명사', note: '예: наш Бог (우리 하나님)' },
  нашего: { meaning: '우리의(의)', pos: '대명사', note: 'наш의 생격' },
  всё: { meaning: '모든 것, 전부', pos: '대명사', note: 'все와 구별' },
  все: { meaning: '모두, 모든 사람들', pos: '대명사', note: '복수' },
  всей: { meaning: '온, 모든', pos: '대명사', note: '예: всей душой (온 마음으로)' },
  через: { meaning: '~을 통하여', pos: '전치사', note: '대격과 함께 사용' },
  превозносим: { meaning: '높여 드립니다', pos: '동사', note: 'превозносить 1인칭 복수' },
  благодарим: { meaning: '감사합니다', pos: '동사', note: 'благодарить 1인칭 복수' },
  достоин: { meaning: '합당하십니다, 존귀하십니다', pos: '형용사', note: '찬양받기 합당하신' },
  верю: { meaning: '믿습니다', pos: '동사', note: 'верить 1인칭 단수' },
  имя: { meaning: '이름', pos: '명사', note: '중성 명사' },
  имени: { meaning: '이름(의/에)', pos: '명사', note: 'имя의 생격·여격' },
  песня: { meaning: '노래, 찬양', pos: '명사', note: '여성 명사' },
  песню: { meaning: '노래를', pos: '명사', note: 'песня의 대격' },
  голос: { meaning: '목소리, 음성', pos: '명사', note: '남성 명사' },
  источник: { meaning: '샘, 근원', pos: '명사', note: '생수의 근원' },
  вода: { meaning: '물', pos: '명사', note: '여성 명사' },
  воды: { meaning: '물(의)', pos: '명사', note: 'вода의 생격' },
  живой: { meaning: '살아 계신, 생수의', pos: '형용사', note: 'живая вода = 생수' },
};

export function normalizeRussianWord(raw: string): string {
  return raw
    .replace(/^[^А-Яа-яЁё]+|[^А-Яа-яЁё]+$/g, '')
    .toLowerCase();
}

interface WordCacheStore {
  order: string[];
  entries: Record<string, RussianWordInfo>;
}

function readWordCache(): WordCacheStore {
  try {
    const raw = localStorage.getItem(WORD_CACHE_KEY);
    if (!raw) return { order: [], entries: {} };
    const parsed = JSON.parse(raw) as WordCacheStore;
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.order) || !parsed.entries) {
      return { order: [], entries: {} };
    }
    return parsed;
  } catch {
    return { order: [], entries: {} };
  }
}

function writeWordCache(store: WordCacheStore): void {
  try {
    localStorage.setItem(WORD_CACHE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage quota errors
  }
}

export async function lookupRussianWord(rawWord: string): Promise<RussianWordInfo> {
  const cleanWord = rawWord.replace(/^[^А-Яа-яЁё]+|[^А-Яа-яЁё]+$/g, '') || rawWord.trim();
  const normalized = normalizeRussianWord(cleanWord);
  const readingKo = transliterateRussianToKorean(cleanWord);

  if (normalized && WORSHIP_RU_DICT[normalized]) {
    const entry = WORSHIP_RU_DICT[normalized];
    return {
      word: cleanWord,
      normalized,
      readingKo,
      meaning: entry.meaning,
      pos: entry.pos,
      note: entry.note,
    };
  }

  const cache = readWordCache();
  if (normalized && cache.entries[normalized]) {
    return {
      ...cache.entries[normalized],
      word: cleanWord,
      readingKo,
    };
  }

  const res = await fetch('/api/translate-lyrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'word', word: cleanWord, source: 'ru', target: 'ko' }),
  });

  if (!res.ok) {
    throw new Error(`Word lookup failed (${res.status})`);
  }

  const data = (await res.json()) as {
    meaning?: string;
    romanization?: string;
    dictEntries?: Array<{ pos: string; terms: string[] }>;
  };

  const info: RussianWordInfo = {
    word: cleanWord,
    normalized: normalized || cleanWord.toLowerCase(),
    readingKo,
    romanization: data.romanization || undefined,
    meaning: data.meaning?.trim() || '뜻을 찾지 못했습니다',
    pos: data.dictEntries?.[0]?.pos,
    dictEntries: data.dictEntries && data.dictEntries.length > 0 ? data.dictEntries : undefined,
  };

  if (normalized && data.meaning?.trim()) {
    const store = readWordCache();
    store.order = [normalized, ...store.order.filter((k) => k !== normalized)];
    store.entries[normalized] = info;
    while (store.order.length > MAX_CACHED_WORDS) {
      const evicted = store.order.pop();
      if (evicted) delete store.entries[evicted];
    }
    writeWordCache(store);
  }

  return info;
}

export function getSavedRussianVocab(): RussianWordInfo[] {
  try {
    const raw = localStorage.getItem(VOCAB_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as RussianWordInfo[]) : [];
  } catch {
    return [];
  }
}

function saveRussianVocab(list: RussianWordInfo[]): void {
  try {
    localStorage.setItem(VOCAB_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage quota errors
  }
}

export function toggleSavedRussianWord(info: RussianWordInfo): RussianWordInfo[] {
  const current = getSavedRussianVocab();
  const exists = current.some((w) => w.normalized === info.normalized);
  const next = exists
    ? current.filter((w) => w.normalized !== info.normalized)
    : [info, ...current];
  saveRussianVocab(next);
  return next;
}

export function removeSavedRussianWord(normalized: string): RussianWordInfo[] {
  const next = getSavedRussianVocab().filter((w) => w.normalized !== normalized);
  saveRussianVocab(next);
  return next;
}

export function speakRussianWord(word: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech synthesis errors
  }
}

export interface WordTextPiece {
  text: string;
  fullWord?: string;
  normalized?: string;
}

export function tokenizeTextWithWordMap(
  segments: Array<{ chord?: string; text: string }>
): Array<{ chord?: string; pieces: WordTextPiece[] }> {
  const fullText = segments.map((s) => s.text).join('');
  const spans: Array<{ start: number; end: number; fullWord: string; normalized: string }> = [];
  const regex = /[А-Яа-яЁё]+/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(fullText)) !== null) {
    const fullWord = match[0];
    spans.push({
      start: match.index,
      end: match.index + fullWord.length,
      fullWord,
      normalized: fullWord.toLowerCase(),
    });
  }

  let offset = 0;
  return segments.map((seg) => {
    const segStart = offset;
    const segEnd = offset + seg.text.length;
    offset = segEnd;

    if (!seg.text) {
      return { chord: seg.chord, pieces: [] };
    }

    const pieces: WordTextPiece[] = [];
    let pos = segStart;

    for (const span of spans) {
      if (span.end <= segStart) continue;
      if (span.start >= segEnd) break;

      const overlapStart = Math.max(pos, span.start);
      const overlapEnd = Math.min(segEnd, span.end);

      if (overlapStart > pos) {
        pieces.push({
          text: seg.text.slice(pos - segStart, overlapStart - segStart),
        });
      }
      if (overlapEnd > overlapStart) {
        pieces.push({
          text: seg.text.slice(overlapStart - segStart, overlapEnd - segStart),
          fullWord: span.fullWord,
          normalized: span.normalized,
        });
      }
      pos = overlapEnd;
    }

    if (pos < segEnd) {
      pieces.push({
        text: seg.text.slice(pos - segStart),
      });
    }

    return { chord: seg.chord, pieces };
  });
}

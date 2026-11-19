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

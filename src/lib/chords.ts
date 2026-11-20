const NOTE_TO_INDEX: Record<string, number> = {
  C: 0,
  'B#': 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  F: 5,
  'E#': 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
  Cb: 11,
  H: 11,
};

const SHARP_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_SCALE = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const MIXED_FALLBACK_SCALE = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

const PREFERRED_MAJOR_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const PREFERRED_MINOR_KEYS = [
  'Cm',
  'C#m',
  'Dm',
  'Ebm',
  'Em',
  'Fm',
  'F#m',
  'Gm',
  'G#m',
  'Am',
  'Bbm',
  'Bm',
];

const FLAT_PREFERRED_KEYS = new Set([
  'F',
  'Bb',
  'Eb',
  'Ab',
  'Db',
  'Gb',
  'Dm',
  'Gm',
  'Cm',
  'Fm',
  'Bbm',
  'Ebm',
]);

const CYRILLIC_LOOKALIKES: Record<string, string> = {
  А: 'A',
  В: 'B',
  С: 'C',
  Е: 'E',
  Н: 'H',
};

function cleanCyrillicLookalikes(input: string): string {
  return input.replace(
    /(^|[/\\\s(-])([АВСЕН])(?=$|[^А-Яа-яЁё])/g,
    (_, prefix: string, ch: string) => `${prefix}${CYRILLIC_LOOKALIKES[ch] || ch}`
  );
}

function normalizeAccidental(acc: string): string {
  if (acc === '&' || acc === '♭') return 'b';
  if (acc === '♯') return '#';
  return acc;
}

export function transposeChord(
  chord: string,
  semitones: number,
  preferFlats?: boolean
): string {
  const cleaned = cleanCyrillicLookalikes(chord).replace(/&(?=\d)/g, 'b');
  return cleaned.replace(
    /(^|[^A-Za-z])([A-GH])([#b&♭♯]?)(?=$|m(?!aj)|maj|min|dim|aug|sus|add|M|o|°|\d|\/|\\|\||:|\s|\(|\)|\.|,|-|>|\+|[A-GH])/g,
    (_full, prefix: string, letter: string, rawAcc: string) => {
      const normLetter = letter === 'H' ? 'B' : letter;
      const normAcc = normalizeAccidental(rawAcc);
      if (!semitones) {
        return `${prefix}${normLetter}${normAcc}`;
      }
      const idx = NOTE_TO_INDEX[`${normLetter}${normAcc}`];
      if (idx === undefined) {
        return `${prefix}${normLetter}${normAcc}`;
      }
      const nextIdx = ((idx + semitones) % 12 + 12) % 12;
      let nextNote: string;
      if (preferFlats === true) {
        nextNote = FLAT_SCALE[nextIdx];
      } else if (preferFlats === false) {
        nextNote = SHARP_SCALE[nextIdx];
      } else {
        nextNote =
          normAcc === 'b' ? FLAT_SCALE[nextIdx] : MIXED_FALLBACK_SCALE[nextIdx];
      }
      return `${prefix}${nextNote}`;
    }
  );
}

export function transposeKey(baseKey: string, semitones: number): string {
  const cleaned = cleanCyrillicLookalikes(baseKey.trim());
  const match = cleaned.match(/^([A-GH])([#b&♭♯]?)(m)?(.*)$/);
  if (!match) {
    return transposeChord(cleaned, semitones);
  }
  const [, letter, rawAcc = '', minor = '', rest = ''] = match;
  const normLetter = letter === 'H' ? 'B' : letter;
  const normAcc = normalizeAccidental(rawAcc);

  if (!semitones) {
    return `${normLetter}${normAcc}${minor}${rest}`;
  }
  if (!rest.trim()) {
    const idx = NOTE_TO_INDEX[`${normLetter}${normAcc}`];
    if (idx !== undefined) {
      const nextIdx = ((idx + semitones) % 12 + 12) % 12;
      return minor ? PREFERRED_MINOR_KEYS[nextIdx] : PREFERRED_MAJOR_KEYS[nextIdx];
    }
  }
  return transposeChord(cleaned, semitones);
}

export function shouldUseFlats(
  baseKey: string | null | undefined,
  semitones: number
): boolean | undefined {
  if (!baseKey) return undefined;
  const targetKey = transposeKey(baseKey, semitones);
  return FLAT_PREFERRED_KEYS.has(targetKey);
}

export function stripChords(line: string): string {
  return line.replace(/\[([^\]]+)\]/g, '');
}

export function hasInlineChords(line: string): boolean {
  return /\[([A-GH][^\]]*)\]/.test(line);
}

export function parseChordedLine(
  chorded: string,
  semitones: number,
  preferFlats?: boolean
): Array<{ chord?: string; text: string }> {
  const parts: Array<{ chord?: string; text: string }> = [];
  const regex = /\[([^\]]+)\]([^\[]*)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(chorded)) !== null) {
    if (match.index > lastIdx) {
      parts.push({ text: chorded.slice(lastIdx, match.index) });
    }
    parts.push({
      chord: transposeChord(match[1].trim(), semitones, preferFlats),
      text: match[2],
    });
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < chorded.length) {
    parts.push({ text: chorded.slice(lastIdx) });
  }
  return parts;
}

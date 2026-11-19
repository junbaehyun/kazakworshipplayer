import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, Music2, X } from 'lucide-react';
import type { KaynarSong } from '../data/bakhytKaynarSongs';
import type { Language } from '../types';

interface Stanza {
  tag: string | null;
  lines: string[];
}

interface LyricsViewProps {
  lyrics: string;
  songKey?: string | null;
  capo?: number | null;
  kaynarSong?: KaynarSong | null;
  lang: Language;
  defaultVersion?: 'standard' | 'kaynar';
  standardLabel: string;
  kaynarLabel: string;
  title: string;
  author: string;
  gradient: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  lyricsLabel: string;
  onSeek: (time: number) => void;
  onClose: () => void;
}

const FONT_SIZE_CLASSES = [
  'text-[15px] leading-[1.6]',
  'text-[18px] leading-[1.65]',
  'text-[21px] leading-[1.7]',
] as const;

const SHARP_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_TO_SHARP: Record<string, string> = {
  Db: 'C#',
  Eb: 'D#',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
};

function transposeNote(note: string, semitones: number): string {
  if (!semitones) return note;
  const normalized = FLAT_TO_SHARP[note] || note;
  const idx = SHARP_SCALE.indexOf(normalized);
  if (idx < 0) return note;
  return SHARP_SCALE[(idx + semitones + 120) % 12];
}

function transposeChord(chord: string, semitones: number): string {
  if (!semitones) return chord;
  return chord.replace(/([A-G][#b]?)/g, (m) => transposeNote(m, semitones));
}

function stripChords(line: string): string {
  return line.replace(/\[([^\]]+)\]/g, '');
}

function hasInlineChords(line: string): boolean {
  return /\[([A-GH][^\]]*)\]/.test(line);
}

function parseChordedLine(
  chorded: string,
  semitones: number
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
      chord: transposeChord(match[1].trim(), semitones),
      text: match[2],
    });
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < chorded.length) {
    parts.push({ text: chorded.slice(lastIdx) });
  }
  return parts;
}

function parseStanzas(raw: string): Stanza[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  return trimmed
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length === 0) return null;

      const tagMatch = lines[0].match(/^\[([^\]]+)\]$/);
      if (tagMatch) {
        return {
          tag: tagMatch[1],
          lines: lines.slice(1),
        };
      }
      return { tag: null, lines };
    })
    .filter((s): s is Stanza => s !== null && s.lines.length > 0);
}

function formatSectionTag(tag: string, lang: Language): { label: string; isChorus: boolean } {
  const lower = tag.toLowerCase();
  const isChorus = lower.startsWith('қр') || lower === 'chorus' || lower === '후렴' || lower.startsWith('припев');
  if (isChorus) {
    return {
      label: lang === 'ko' ? '후렴 (Қр.)' : 'Қр.',
      isChorus: true,
    };
  }
  if (/^\d+$/.test(tag) && lang === 'ko') {
    return { label: `${tag}절`, isChorus: false };
  }
  return { label: tag, isChorus: false };
}

export function LyricsView({
  lyrics,
  songKey = null,
  capo = null,
  kaynarSong = null,
  lang,
  defaultVersion = 'standard',
  standardLabel,
  kaynarLabel,
  title,
  author,
  gradient,
  currentTime,
  duration,
  isPlaying,
  lyricsLabel,
  onSeek,
  onClose,
}: LyricsViewProps) {
  const [fontStep, setFontStep] = useState<0 | 1 | 2>(1);
  const [copied, setCopied] = useState(false);
  const [showChords, setShowChords] = useState(true);
  const [transpose, setTranspose] = useState(0);
  const [version, setVersion] = useState<'standard' | 'kaynar'>(
    kaynarSong ? defaultVersion : 'standard'
  );
  const lastManualScrollRef = useRef(0);
  const stanzaRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setVersion(kaynarSong ? defaultVersion : 'standard');
    setTranspose(0);
  }, [kaynarSong, defaultVersion, title]);

  const activeVersion = kaynarSong ? version : 'standard';

  const stanzas = useMemo(() => parseStanzas(lyrics), [lyrics]);
  const kaynarSections = useMemo(() => kaynarSong?.sections ?? [], [kaynarSong]);
  const totalBlocks = activeVersion === 'kaynar' ? kaynarSections.length : stanzas.length;

  const standardHasChords = useMemo(
    () => stanzas.some((s) => s.lines.some((l) => hasInlineChords(l))),
    [stanzas]
  );
  const kaynarHasChords = useMemo(
    () => kaynarSections.some((sec) => sec.lines.some((l) => Boolean(l.chords))),
    [kaynarSections]
  );
  const activeHasChords =
    activeVersion === 'kaynar' ? kaynarHasChords || standardHasChords : standardHasChords;
  const activeKey = songKey || kaynarSong?.songKey || null;
  const activeCapo = capo || kaynarSong?.capo || null;

  const activeIndex = useMemo(() => {
    if (totalBlocks <= 1 || duration <= 0) return 0;
    const progress = Math.min(0.999, Math.max(0, currentTime / duration));
    return Math.min(totalBlocks - 1, Math.floor(progress * totalBlocks));
  }, [totalBlocks, currentTime, duration]);

  useEffect(() => {
    if (!isPlaying || totalBlocks <= 1) return;
    if (Date.now() - lastManualScrollRef.current < 3000) return;

    const el = stanzaRefs.current[activeIndex];
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeIndex, isPlaying, totalBlocks]);

  const copyableText = useMemo(() => {
    if (activeVersion === 'kaynar' && kaynarSong) {
      return kaynarSong.sections
        .map((sec) => {
          const header = sec.label[lang === 'ko' ? 'ko' : 'kk'] || sec.label.kk || '';
          const body = sec.lines.map((l) => (showChords && l.chords ? l.chords : l.kk)).filter(Boolean).join('\n');
          return header ? `[${header}]\n${body}` : body;
        })
        .join('\n\n')
        .trim();
    }
    return stanzas
      .map((st) => {
        const body = st.lines
          .map((l) => (showChords ? l : stripChords(l)))
          .filter(Boolean)
          .join('\n');
        return st.tag ? `[${st.tag}]\n${body}` : body;
      })
      .join('\n\n')
      .trim();
  }, [activeVersion, kaynarSong, lang, showChords, stanzas]);

  const handleCopy = async () => {
    if (!copyableText) return;
    try {
      await navigator.clipboard.writeText(copyableText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard errors in restricted contexts
    }
  };

  const chordBtnLabel =
    lang === 'ko'
      ? '악보 코드'
      : lang === 'kk'
      ? 'Аккордтар'
      : lang === 'ru'
      ? 'Аккорды'
      : 'Chords';

  return (
    <div className="flex-1 min-h-0 my-3 bg-white/90 backdrop-blur-xl rounded-3xl border border-black/[0.06] shadow-[0_12px_36px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden">
      {/* Compact Lyrics Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-black/[0.05] shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shrink-0 shadow-sm`}
          >
            <Music2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#1D1D1F] truncate">{title}</p>
            <p className="text-[11px] font-medium text-[#86868B] truncate">{author}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setFontStep((s) => (s > 0 ? ((s - 1) as 0 | 1 | 2) : 0))}
            disabled={fontStep === 0}
            aria-label="Decrease lyrics font size"
            className="px-2 py-1 rounded-lg bg-[#F5F5F7] text-[11px] font-bold text-[#1D1D1F] disabled:opacity-35 active:scale-95 transition"
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => setFontStep((s) => (s < 2 ? ((s + 1) as 0 | 1 | 2) : 2))}
            disabled={fontStep === 2}
            aria-label="Increase lyrics font size"
            className="px-2 py-1 rounded-lg bg-[#F5F5F7] text-[11px] font-bold text-[#1D1D1F] disabled:opacity-35 active:scale-95 transition"
          >
            A+
          </button>
          <button
            type="button"
            onClick={() => void handleCopy()}
            disabled={!copyableText}
            aria-label="Copy lyrics"
            className="p-1.5 rounded-lg bg-[#F5F5F7] text-[#1D1D1F] disabled:opacity-35 active:scale-95 transition"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#34C759]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${lyricsLabel}`}
            className="p-1.5 rounded-lg bg-[#F5F5F7] text-[#86868B] hover:text-[#1D1D1F] active:scale-95 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2-Version Lyrics Switcher (Standard vs Бақыт қайнар) */}
      {kaynarSong && (
        <div className="px-4 py-2 border-b border-black/[0.05] bg-[#F5F5F7]/60 shrink-0">
          <div className="grid grid-cols-2 gap-1 p-0.5 rounded-xl bg-black/[0.05]">
            <button
              type="button"
              onClick={() => setVersion('standard')}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition ${
                activeVersion === 'standard'
                  ? 'bg-white text-[#1D1D1F] shadow-xs'
                  : 'text-[#86868B]'
              }`}
            >
              {standardLabel}
            </button>
            <button
              type="button"
              onClick={() => setVersion('kaynar')}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition ${
                activeVersion === 'kaynar'
                  ? 'bg-white text-[#FA243C] shadow-xs'
                  : 'text-[#86868B]'
              }`}
            >
              {kaynarLabel}
            </button>
          </div>
        </div>
      )}

      {/* Worship Reader Basic Chords & Key Bar */}
      {(activeHasChords || activeKey) && (
        <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-[#FA243C]/15 bg-[#FFF8F6] shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            {activeHasChords && (
              <button
                type="button"
                onClick={() => setShowChords((v) => !v)}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border transition ${
                  showChords
                    ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                    : 'bg-white text-[#86868B] border-black/10'
                }`}
              >
                {chordBtnLabel}
              </button>
            )}
            {activeKey && (
              <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-extrabold text-[#1D1D1F] border border-black/[0.06] truncate">
                Key: {transposeChord(activeKey, transpose)}
                {activeCapo ? ` (Capo ${activeCapo})` : ''}
              </span>
            )}
          </div>

          {activeHasChords && showChords && (
            <div className="inline-flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setTranspose((t) => Math.max(-6, t - 1))}
                className="w-6 h-6 rounded-lg bg-white border border-black/[0.08] text-xs font-bold text-[#1D1D1F] active:scale-95"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setTranspose(0)}
                className="px-1.5 h-6 rounded-lg bg-white border border-black/[0.08] text-[10px] font-bold text-[#515154]"
              >
                {transpose === 0 ? '0' : transpose > 0 ? `+${transpose}` : transpose}
              </button>
              <button
                type="button"
                onClick={() => setTranspose((t) => Math.min(6, t + 1))}
                className="w-6 h-6 rounded-lg bg-white border border-black/[0.08] text-xs font-bold text-[#1D1D1F] active:scale-95"
              >
                +
              </button>
            </div>
          )}
        </div>
      )}

      {/* Worship Reader Stanza Cards */}
      <div
        onWheel={() => {
          lastManualScrollRef.current = Date.now();
        }}
        onTouchMove={() => {
          lastManualScrollRef.current = Date.now();
        }}
        className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-3"
      >
        {activeVersion === 'kaynar' && kaynarSong ? (
          kaynarSections.length === 0 ? (
            <p className="text-sm font-medium text-[#86868B] text-center py-10">—</p>
          ) : (
            kaynarSections.map((sec, idx) => {
              const isActive = idx === activeIndex;
              const targetTime = duration > 0 ? (idx / kaynarSections.length) * duration : 0;
              const rawTag = sec.label[lang === 'ko' ? 'ko' : 'kk'] || sec.label.kk || sec.label.ko;
              const isChorus = sec.kind === 'chorus';

              return (
                <button
                  key={`${sec.id}-${idx}`}
                  ref={(el) => {
                    stanzaRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => {
                    if (duration > 0) onSeek(targetTime);
                  }}
                  className={`w-full text-left rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isActive
                      ? 'border-[#FA243C]/35 bg-[#FFF8F6]/70 shadow-xs'
                      : 'border-black/[0.06] bg-white'
                  }`}
                >
                  {rawTag && (
                    <div className="bg-[#F5F5F7]/80 px-3.5 py-1.5 border-b border-black/[0.04] flex items-center justify-between">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                          isChorus
                            ? 'bg-[#1D1D1F] text-white'
                            : 'bg-[#FA243C]/12 text-[#FA243C]'
                        }`}
                      >
                        {rawTag}
                      </span>
                    </div>
                  )}
                  <div className="divide-y divide-black/[0.04]">
                    {sec.lines.map((line, lineIdx) => {
                      const chordSegments =
                        showChords && line.chords ? parseChordedLine(line.chords, transpose) : null;
                      return (
                        <div key={lineIdx} className="px-3.5 py-2.5 space-y-1">
                          {chordSegments ? (
                            <div
                              className={`flex flex-wrap items-end leading-snug text-[#1D1D1F] ${FONT_SIZE_CLASSES[fontStep]}`}
                            >
                              {chordSegments.map((seg, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="inline-flex flex-col items-start whitespace-pre-wrap"
                                >
                                  <span className="text-[11px] font-extrabold font-mono text-[#FA243C] leading-none mb-1 min-h-[12px]">
                                    {seg.chord || '\u00A0'}
                                  </span>
                                  <span className="font-bold">{seg.text || '\u00A0'}</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className={`font-bold text-[#1D1D1F] ${FONT_SIZE_CLASSES[fontStep]}`}>
                              {line.kk}
                            </p>
                          )}
                          {lang === 'ko' && line.reading && (
                            <p className="text-xs font-medium text-sky-700">{line.reading}</p>
                          )}
                          {lang === 'ko' && line.meaning && (
                            <p className="text-xs text-[#6E6E73]">{line.meaning}</p>
                          )}
                          {lang === 'ko' && line.koHymn && (
                            <p className="text-xs font-semibold text-violet-700">{line.koHymn}</p>
                          )}
                          {lang === 'en' && line.en && (
                            <p className="text-xs font-medium italic text-emerald-700">{line.en}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </button>
              );
            })
          )
        ) : stanzas.length === 0 ? (
          <p className="text-sm font-medium text-[#86868B] text-center py-10">—</p>
        ) : (
          stanzas.map((stanza, idx) => {
            const isActive = idx === activeIndex;
            const targetTime = duration > 0 ? (idx / stanzas.length) * duration : 0;
            const tagInfo = stanza.tag ? formatSectionTag(stanza.tag, lang) : null;

            return (
              <button
                key={`${stanza.tag ?? 's'}-${idx}`}
                ref={(el) => {
                  stanzaRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => {
                  if (duration > 0) onSeek(targetTime);
                }}
                className={`w-full text-left rounded-2xl border overflow-hidden transition-all duration-300 ${
                  isActive
                    ? 'border-[#FA243C]/35 bg-[#FFF8F6]/70 shadow-xs'
                    : 'border-black/[0.06] bg-white'
                }`}
              >
                {tagInfo && (
                  <div className="bg-[#F5F5F7]/80 px-3.5 py-1.5 border-b border-black/[0.04] flex items-center justify-between">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                        tagInfo.isChorus
                          ? 'bg-[#1D1D1F] text-white'
                          : 'bg-[#FA243C]/12 text-[#FA243C]'
                      }`}
                    >
                      {tagInfo.label}
                    </span>
                  </div>
                )}
                <div className="divide-y divide-black/[0.04]">
                  {stanza.lines.map((line, lineIdx) => {
                    const lineHasChords = showChords && hasInlineChords(line);
                    const chordSegments = lineHasChords
                      ? parseChordedLine(line, transpose)
                      : null;
                    const plainLine = stripChords(line);

                    return (
                      <div key={lineIdx} className="px-3.5 py-2.5">
                        {chordSegments ? (
                          <div
                            className={`flex flex-wrap items-end leading-snug text-[#1D1D1F] ${FONT_SIZE_CLASSES[fontStep]}`}
                          >
                            {chordSegments.map((seg, sIdx) => (
                              <span
                                key={sIdx}
                                className="inline-flex flex-col items-start whitespace-pre-wrap"
                              >
                                <span className="text-[11px] font-extrabold font-mono text-[#FA243C] leading-none mb-1 min-h-[12px]">
                                  {seg.chord || '\u00A0'}
                                </span>
                                <span className="font-bold">{seg.text || '\u00A0'}</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p
                            className={`font-bold tracking-[-0.01em] text-[#1D1D1F] ${FONT_SIZE_CLASSES[fontStep]}`}
                          >
                            {plainLine}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

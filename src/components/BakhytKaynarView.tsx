import { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import {
  BAKHYT_KAYNAR_AUDIO_MAP,
  bakhytKaynarSongs,
  type KaynarLyricLine,
  type KaynarSong,
} from '../data/bakhytKaynarSongs';
import type { Language, Song } from '../types';

interface BakhytKaynarViewProps {
  lang: Language;
  search: string;
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
}

const FONT_SCALES = [
  { kk: 'text-[17px]', reading: 'text-[13px]', meaning: 'text-[12px]', hymn: 'text-[13px]', en: 'text-[12px]' },
  { kk: 'text-[20px]', reading: 'text-[15px]', meaning: 'text-[13px]', hymn: 'text-[14px]', en: 'text-[13px]' },
  { kk: 'text-[23px]', reading: 'text-[17px]', meaning: 'text-[15px]', hymn: 'text-[16px]', en: 'text-[15px]' },
  { kk: 'text-[27px]', reading: 'text-[19px]', meaning: 'text-[16px]', hymn: 'text-[18px]', en: 'text-[16px]' },
] as const;

export function BakhytKaynarView({
  lang,
  search,
  songs,
  currentSong,
  isPlaying,
  onPlaySong,
}: BakhytKaynarViewProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'scroll' | 'page'>('scroll');
  const [showReading, setShowReading] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);
  const [showKoHymn, setShowKoHymn] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [worshipLeaderMode, setWorshipLeaderMode] = useState(false);
  const [transpose, setTranspose] = useState(0);
  const [fontLevel, setFontLevel] = useState(1);

  const filteredSongs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bakhytKaynarSongs;
    return bakhytKaynarSongs.filter(
      (s) =>
        s.title.kk.toLowerCase().includes(q) ||
        (s.title.ko && s.title.ko.toLowerCase().includes(q)) ||
        (s.title.koHymn && s.title.koHymn.toLowerCase().includes(q)) ||
        (s.title.reading && s.title.reading.toLowerCase().includes(q))
    );
  }, [search]);

  const songIndex = useMemo(
    () => bakhytKaynarSongs.findIndex((s) => s.slug === selectedSlug),
    [selectedSlug]
  );

  const activeSong: KaynarSong | null = songIndex >= 0 ? bakhytKaynarSongs[songIndex] : null;
  const prevSong = songIndex > 0 ? bakhytKaynarSongs[songIndex - 1] : null;
  const nextSong =
    songIndex >= 0 && songIndex < bakhytKaynarSongs.length - 1
      ? bakhytKaynarSongs[songIndex + 1]
      : null;

  const findLinkedAudio = (kaynarId: string): Song | undefined => {
    const mappedId = BAKHYT_KAYNAR_AUDIO_MAP[kaynarId];
    if (!mappedId) return undefined;
    return songs.find((s) => s.id === mappedId);
  };

  const openSong = (slug: string) => {
    setSelectedSlug(slug);
    setSectionIdx(0);
    setTranspose(0);
  };

  // 1. Song List View (13 songs)
  if (!activeSong) {
    return (
      <div className="space-y-3">
        <div className="bg-[#FFF8F6] border border-[#FA243C]/15 rounded-2xl p-3.5 flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-extrabold text-[#1D1D1F]">Бақыт қайнар (바컷 카이나르)</p>
            <p className="text-xs text-[#515154]">
              {lang === 'ko'
                ? `카자흐어 · 한글 읽기 · 의미 · 한국 찬양 (${bakhytKaynarSongs.length}곡)`
                : lang === 'kk'
                ? `Қазақша · Оқылуы · Мағынасы · Корейше (${bakhytKaynarSongs.length} ән)`
                : lang === 'ru'
                ? `Казахский · Чтение · Перевод · Корейский (${bakhytKaynarSongs.length} песен)`
                : `Kazakh · Korean Reading · Meaning · Hymn (${bakhytKaynarSongs.length} songs)`}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#FA243C]/10 text-[#FA243C] text-xs font-bold shrink-0">
            {bakhytKaynarSongs.length}
          </span>
        </div>

        <div className="divide-y divide-black/[0.06]">
          {filteredSongs.map((item) => {
            const globalIdx = bakhytKaynarSongs.findIndex((s) => s.id === item.id) + 1;
            const linkedAudio = findLinkedAudio(item.id);
            const isCurr = Boolean(linkedAudio && currentSong?.id === linkedAudio.id);

            return (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => openSong(item.slug)}
                  className="flex items-center gap-3 min-w-0 flex-1 text-left active:opacity-75 transition"
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                      globalIdx <= 3
                        ? 'bg-[#FA243C]/12 text-[#FA243C]'
                        : 'bg-[#F5F5F7] text-[#86868B]'
                    }`}
                  >
                    {globalIdx}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#1D1D1F] truncate">{item.title.kk}</p>
                    {lang === 'ko' && (item.title.koHymn || item.title.ko || item.title.reading) && (
                      <p className="text-xs text-[#86868B] truncate">
                        {item.title.koHymn || item.title.ko}
                        {item.title.reading ? ` · ${item.title.reading}` : ''}
                      </p>
                    )}
                  </div>
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  {linkedAudio && (
                    <button
                      type="button"
                      onClick={() => onPlaySong(linkedAudio)}
                      aria-label={`Play ${item.title.kk}`}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                        isCurr
                          ? 'bg-[#FA243C] text-white'
                          : 'bg-[#F5F5F7] text-[#FA243C] active:bg-black/10'
                      }`}
                    >
                      {isCurr && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openSong(item.slug)}
                    aria-label={`Open lyrics for ${item.title.kk}`}
                    className="w-8 h-8 rounded-full bg-[#F5F5F7] text-[#515154] flex items-center justify-center active:bg-black/10 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Worship Lyric Deck View (inspired by WorshipLyricDeck.js)
  const sections = activeSong.sections || [];
  const currentSection = sections[sectionIdx] || sections[0];
  const font = FONT_SCALES[fontLevel] || FONT_SCALES[1];
  const hasKoreanHymn = activeSong.hasKoreanHymn !== false;
  const hasEnglish = Boolean(activeSong.hasEnglish);
  const hasChords = sections.some((sec) => sec.lines.some((l) => Boolean(l.chords)));
  const linkedAudio = findLinkedAudio(activeSong.id);
  const isCurrAudio = Boolean(linkedAudio && currentSong?.id === linkedAudio.id);

  const flatLines = sections.flatMap((sec, sIdx) =>
    sec.lines.map((line, lIdx) => ({
      ...line,
      sIdx,
      lIdx,
      sectionLabel: sec.label[lang === 'ko' ? 'ko' : 'kk'] || sec.label.kk || sec.label.ko,
      sectionKind: sec.kind,
      isSectionStart: lIdx === 0,
    }))
  );

  return (
    <div className="space-y-3">
      {/* Top Deck Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setSelectedSlug(null)}
          className="px-2.5 py-1.5 rounded-full bg-[#F5F5F7] text-xs font-bold text-[#1D1D1F] flex items-center gap-1 active:scale-95 transition shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{songIndex + 1}/{bakhytKaynarSongs.length}</span>
        </button>

        <div className="min-w-0 flex-1 text-center">
          <p className="text-sm font-extrabold text-[#1D1D1F] truncate">{activeSong.title.kk}</p>
          {lang === 'ko' && (activeSong.title.koHymn || activeSong.title.ko) && (
            <p className="text-[11px] font-medium text-[#86868B] truncate">
              {activeSong.title.koHymn || activeSong.title.ko}
            </p>
          )}
        </div>

        {linkedAudio ? (
          <button
            type="button"
            onClick={() => onPlaySong(linkedAudio)}
            className={`px-2.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 transition ${
              isCurrAudio ? 'bg-[#FA243C] text-white' : 'bg-[#FA243C]/12 text-[#FA243C]'
            }`}
          >
            {isCurrAudio && isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>
        ) : (
          <div className="w-9 shrink-0" />
        )}
      </div>

      {/* Layer Toggle Chips + Font Size Control */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <LayerChip active={worshipLeaderMode} onClick={() => setWorshipLeaderMode((v) => !v)}>
            {lang === 'ko'
              ? '악보 코드'
              : lang === 'kk'
              ? 'Аккордтар'
              : lang === 'ru'
              ? 'Аккорды'
              : 'Chords'}
          </LayerChip>
          {lang === 'ko' && (
            <>
              <LayerChip active={showReading} onClick={() => setShowReading((v) => !v)}>
                읽기
              </LayerChip>
              <LayerChip active={showMeaning} onClick={() => setShowMeaning((v) => !v)}>
                의미
              </LayerChip>
              {hasKoreanHymn && (
                <LayerChip active={showKoHymn} onClick={() => setShowKoHymn((v) => !v)}>
                  {activeSong.hymnChip || '한국 찬양'}
                </LayerChip>
              )}
            </>
          )}
          {hasEnglish && (
            <LayerChip active={showEnglish} onClick={() => setShowEnglish((v) => !v)}>
              EN
            </LayerChip>
          )}
        </div>

        {/* Font Scale Pill */}
        <div className="inline-flex shrink-0 items-center rounded-full border border-black/[0.08] bg-white px-1 py-0.5">
          <button
            type="button"
            disabled={fontLevel <= 0}
            onClick={() => setFontLevel((n) => Math.max(0, n - 1))}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[11px] font-bold text-[#1D1D1F] disabled:opacity-30"
          >
            A-
          </button>
          <div className="flex items-center gap-1 px-0.5">
            {FONT_SCALES.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i <= fontLevel ? 'bg-[#FA243C]' : 'bg-black/15'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            disabled={fontLevel >= FONT_SCALES.length - 1}
            onClick={() => setFontLevel((n) => Math.min(FONT_SCALES.length - 1, n + 1))}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[13px] font-bold text-[#1D1D1F] disabled:opacity-30"
          >
            A+
          </button>
        </div>
      </div>

      {/* Worship Leader Mode: Key & Transpose Bar */}
      {worshipLeaderMode && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-[#FA243C]/20 bg-[#FFF8F6] px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] font-extrabold text-[#FA243C] uppercase tracking-wider">
              {lang === 'ko' ? '악보 코드' : 'Chords'}
            </span>
            {activeSong.songKey ? (
              <span className="rounded-md bg-white px-2 py-0.5 text-xs font-extrabold text-[#1D1D1F] border border-black/[0.06]">
                Key: {transposeChord(activeSong.songKey, transpose)}
                {activeSong.capo ? ` (Capo ${activeSong.capo})` : ''}
              </span>
            ) : null}
            {!hasChords && (
              <span className="text-[11px] text-[#86868B] truncate">
                {lang === 'ko'
                  ? '코드 준비 중'
                  : lang === 'kk'
                  ? 'Аккордтар дайындалуда'
                  : lang === 'ru'
                  ? 'Аккорды готовятся'
                  : 'Chords coming soon'}
              </span>
            )}
          </div>
          {hasChords && (
            <div className="inline-flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setTranspose((t) => Math.max(-6, t - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-black/[0.08] text-xs font-bold text-[#1D1D1F] active:scale-95"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setTranspose(0)}
                className="px-2 h-7 rounded-lg bg-white border border-black/[0.08] text-[11px] font-bold text-[#515154]"
              >
                {transpose === 0 ? '0' : transpose > 0 ? `+${transpose}` : transpose}
              </button>
              <button
                type="button"
                onClick={() => setTranspose((t) => Math.min(6, t + 1))}
                className="w-7 h-7 rounded-lg bg-white border border-black/[0.08] text-xs font-bold text-[#1D1D1F] active:scale-95"
              >
                +
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Lyric Card */}
      <div className="rounded-2xl border border-black/[0.08] bg-white shadow-xs overflow-hidden">
        {/* Section Tabs + Scroll/Page Toggle */}
        <div className="bg-[#F5F5F7] px-2.5 py-2 border-b border-black/[0.05] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
            {viewMode === 'page' ? (
              sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setSectionIdx(idx)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition ${
                    idx === sectionIdx
                      ? 'bg-white text-[#1D1D1F] shadow-xs'
                      : 'text-[#86868B]'
                  }`}
                >
                  {sec.label[lang === 'ko' ? 'ko' : 'kk'] || sec.label.kk || sec.label.ko}
                </button>
              ))
            ) : (
              <span className="text-[11px] font-semibold text-[#515154] px-1">
                {lang === 'ko' ? '전체 가사' : lang === 'kk' ? 'Толық мәтін' : 'Full Lyrics'}
              </span>
            )}
          </div>

          <div className="inline-flex rounded-lg bg-black/[0.06] p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('scroll')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
                viewMode === 'scroll' ? 'bg-white text-[#1D1D1F] shadow-xs' : 'text-[#86868B]'
              }`}
            >
              {lang === 'ko' ? '전체' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('page')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
                viewMode === 'page' ? 'bg-white text-[#1D1D1F] shadow-xs' : 'text-[#86868B]'
              }`}
            >
              {lang === 'ko' ? '절별' : 'Page'}
            </button>
          </div>
        </div>

        {/* Lyric Lines */}
        {viewMode === 'scroll' ? (
          <div className="divide-y divide-black/[0.05]">
            {flatLines.map((line) => (
              <div key={`${line.sIdx}-${line.lIdx}`}>
                {line.isSectionStart && (
                  <div className="bg-[#F5F5F7]/80 px-3.5 py-1.5">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                        line.sectionKind === 'chorus'
                          ? 'bg-[#1D1D1F] text-white'
                          : 'bg-[#FA243C]/12 text-[#FA243C]'
                      }`}
                    >
                      {line.sectionLabel}
                    </span>
                  </div>
                )}
                <LyricLineCard
                  line={line}
                  font={font}
                  showReading={lang === 'ko' && showReading}
                  showMeaning={lang === 'ko' && showMeaning}
                  showKoHymn={lang === 'ko' && showKoHymn}
                  showEnglish={showEnglish}
                  showChords={worshipLeaderMode}
                  transpose={transpose}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-black/[0.05]">
            {(currentSection?.lines || []).map((line, i) => (
              <LyricLineCard
                key={`${currentSection?.id}-${i}`}
                line={line}
                font={font}
                showReading={lang === 'ko' && showReading}
                showMeaning={lang === 'ko' && showMeaning}
                showKoHymn={lang === 'ko' && showKoHymn}
                showEnglish={showEnglish}
                showChords={worshipLeaderMode}
                transpose={transpose}
              />
            ))}
          </div>
        )}
      </div>

      {/* Prev / Next Song Footer */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          disabled={!prevSong}
          onClick={() => prevSong && openSong(prevSong.slug)}
          className="py-2.5 px-3 rounded-xl bg-[#F5F5F7] text-xs font-bold text-[#1D1D1F] disabled:opacity-35 flex items-center justify-center gap-1 active:scale-95 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="truncate">{prevSong ? prevSong.title.kk : '—'}</span>
        </button>

        <button
          type="button"
          disabled={!nextSong}
          onClick={() => nextSong && openSong(nextSong.slug)}
          className="py-2.5 px-3 rounded-xl bg-[#FA243C] text-xs font-bold text-white disabled:opacity-35 flex items-center justify-center gap-1 active:scale-95 transition"
        >
          <span className="truncate">{nextSong ? nextSong.title.kk : '—'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function LayerChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold transition ${
        active
          ? 'border-[#1D1D1F] bg-[#1D1D1F] text-white'
          : 'border-black/10 bg-white text-[#86868B]'
      }`}
    >
      {children}
    </button>
  );
}

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

function LyricLineCard({
  line,
  font,
  showReading,
  showMeaning,
  showKoHymn,
  showEnglish,
  showChords,
  transpose,
}: {
  line: KaynarLyricLine;
  font: (typeof FONT_SCALES)[number];
  showReading: boolean;
  showMeaning: boolean;
  showKoHymn: boolean;
  showEnglish: boolean;
  showChords: boolean;
  transpose: number;
}) {
  const chordSegments =
    showChords && line.chords ? parseChordedLine(line.chords, transpose) : null;

  return (
    <article className="px-4 py-3.5">
      {chordSegments ? (
        <div className={`flex flex-wrap items-end leading-snug text-[#1D1D1F] ${font.kk}`}>
          {chordSegments.map((seg, idx) => (
            <span key={idx} className="inline-flex flex-col items-start whitespace-pre-wrap">
              <span className="text-[11px] font-extrabold font-mono text-[#FA243C] leading-none mb-1 min-h-[12px]">
                {seg.chord || '\u00A0'}
              </span>
              <span className="font-bold">{seg.text || '\u00A0'}</span>
            </span>
          ))}
        </div>
      ) : (
        <p className={`font-bold leading-snug text-[#1D1D1F] ${font.kk}`}>{line.kk}</p>
      )}
      {showReading && line.reading && (
        <p className={`mt-1.5 font-medium leading-snug text-sky-700 ${font.reading}`}>
          {line.reading}
        </p>
      )}
      {showMeaning && line.meaning && (
        <p className={`mt-1 leading-snug text-[#6E6E73] ${font.meaning}`}>{line.meaning}</p>
      )}
      {showKoHymn && line.koHymn && (
        <p className={`mt-1 font-semibold leading-snug text-violet-700 ${font.hymn}`}>
          {line.koHymn}
        </p>
      )}
      {showEnglish && line.en && (
        <p className={`mt-1 font-medium italic leading-snug text-emerald-700 ${font.en}`}>
          {line.en}
        </p>
      )}
    </article>
  );
}

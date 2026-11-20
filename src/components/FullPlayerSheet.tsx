import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  BookOpen,
  Check,
  ChevronDown,
  Download,
  Heart,
  Loader2,
  MoreHorizontal,
  Music2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import type { KaynarSong } from '../data/bakhytKaynarSongs';
import type { TranslationStrings } from '../i18n/translations';
import type { Language, RepeatMode, Song } from '../types';
import { LyricsView } from './LyricsView';
import { getSongGradient } from './SongRow';

interface FullPlayerSheetProps {
  isOpen: boolean;
  song: Song;
  prevSong?: Song | null;
  nextSong?: Song | null;
  kaynarSong?: KaynarSong | null;
  lang: Language;
  defaultLyricsVersion?: 'standard' | 'kaynar';
  openLyricsSignal?: number;
  isPlaying: boolean;
  isOffline: boolean;
  isLiked?: boolean;
  isSavingOffline?: boolean;
  currentTime: number;
  duration: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  t: TranslationStrings;
  onClose: () => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onSwipePrev?: () => void;
  onNext: () => void;
  onSeek: (sec: number) => void;
  onCycleRepeat: () => void;
  onToggleShuffle: () => void;
  onToggleOffline: (song: Song) => void;
  onToggleLike?: (song: Song) => void;
  onOpenReport: (song: Song) => void;
  onOpenLyricsMode?: (song: Song) => void;
}

const CARD_SPACING = 284;

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function FullPlayerSheet({
  isOpen,
  song,
  prevSong = null,
  nextSong = null,
  kaynarSong = null,
  lang,
  defaultLyricsVersion = 'standard',
  openLyricsSignal = 0,
  isPlaying,
  isOffline,
  isLiked = false,
  isSavingOffline = false,
  currentTime,
  duration,
  repeatMode,
  isShuffle,
  t,
  onClose,
  onTogglePlay,
  onPrev,
  onSwipePrev,
  onNext,
  onSeek,
  onCycleRepeat,
  onToggleShuffle,
  onToggleOffline,
  onToggleLike,
  onOpenReport,
  onOpenLyricsMode,
}: FullPlayerSheetProps) {
  const [showLyrics, setShowLyrics] = useState(false);

  // Horizontal artwork swipe & vertical sheet-dismiss drag states
  const [dragX, setDragX] = useState(0);
  const [isDraggingArtwork, setIsDraggingArtwork] = useState(false);
  const [skipArtworkTransition, setSkipArtworkTransition] = useState(false);
  const [sheetDragY, setSheetDragY] = useState(0);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);

  // Elastic Apple Music scrubber states
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState(0);

  const scrubberRef = useRef<HTMLDivElement | null>(null);
  const swipeTimeoutRef = useRef<number | null>(null);
  const suppressTapRef = useRef(false);
  const gestureRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    t: number;
    axis: 'none' | 'x' | 'y';
    moved: boolean;
    source: 'artwork' | 'header';
  } | null>(null);

  useEffect(() => {
    if (openLyricsSignal > 0) {
      setShowLyrics(true);
    }
  }, [openLyricsSignal]);

  useEffect(() => {
    setDragX(0);
    setIsDraggingArtwork(false);
    setSheetDragY(0);
    setIsDraggingSheet(false);
  }, [song.id, isOpen]);

  useEffect(() => {
    return () => {
      if (swipeTimeoutRef.current !== null) {
        window.clearTimeout(swipeTimeoutRef.current);
      }
    };
  }, []);

  const handlePointerDown = (
    source: 'artwork' | 'header',
    e: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (source === 'header' && (e.target as HTMLElement | null)?.closest('button')) {
      return;
    }
    if (swipeTimeoutRef.current !== null) {
      window.clearTimeout(swipeTimeoutRef.current);
      swipeTimeoutRef.current = null;
    }
    gestureRef.current = {
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      t: Date.now(),
      axis: 'none',
      moved: false,
      source,
    };
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gestureRef.current;
    if (!g || g.pointerId !== e.pointerId) return;

    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > 8 || absDy > 8) {
      g.moved = true;
    }

    if (g.axis === 'none') {
      if (absDx < 10 && absDy < 10) return;
      if (g.source === 'artwork' && absDx > absDy * 1.35) {
        g.axis = 'x';
        setIsDraggingArtwork(true);
        try {
          e.currentTarget.setPointerCapture(g.pointerId);
        } catch {
          // Ignore pointer capture errors
        }
      } else if (dy > 0 && absDy > absDx * 1.35) {
        g.axis = 'y';
        setIsDraggingSheet(true);
        try {
          e.currentTarget.setPointerCapture(g.pointerId);
        } catch {
          // Ignore pointer capture errors
        }
      } else {
        return;
      }
    }

    if (g.axis === 'x') {
      const canMoveRight = prevSong !== null;
      const canMoveLeft = nextSong !== null;
      const dampened =
        (dx > 0 && !canMoveRight) || (dx < 0 && !canMoveLeft)
          ? dx * 0.25
          : Math.max(-CARD_SPACING, Math.min(CARD_SPACING, dx));
      setDragX(dampened);
    } else if (g.axis === 'y') {
      setSheetDragY(Math.max(0, dy));
    }
  };

  const handlePointerEnd = (
    e: ReactPointerEvent<HTMLDivElement>,
    cancelled = false
  ) => {
    const g = gestureRef.current;
    if (!g || g.pointerId !== e.pointerId) return;
    gestureRef.current = null;

    try {
      if (e.currentTarget.hasPointerCapture(g.pointerId)) {
        e.currentTarget.releasePointerCapture(g.pointerId);
      }
    } catch {
      // Ignore release errors
    }

    if (g.moved) {
      suppressTapRef.current = true;
      window.setTimeout(() => {
        suppressTapRef.current = false;
      }, 240);
    }

    const dx = cancelled ? 0 : e.clientX - g.x;
    const dy = cancelled ? 0 : e.clientY - g.y;
    const dt = Math.max(Date.now() - g.t, 1);

    if (g.axis === 'x') {
      setIsDraggingArtwork(false);
      const velocity = Math.abs(dx) / dt;
      const shouldCommit =
        !cancelled &&
        (Math.abs(dx) > 72 || (Math.abs(dx) > 24 && velocity > 0.45));
      const dir = dx < 0 ? -1 : 1;
      const allowed = dir < 0 ? nextSong !== null : prevSong !== null;

      if (shouldCommit && allowed) {
        setDragX(dir * CARD_SPACING);
        if (typeof navigator.vibrate === 'function') {
          navigator.vibrate(10);
        }
        swipeTimeoutRef.current = window.setTimeout(() => {
          swipeTimeoutRef.current = null;
          setSkipArtworkTransition(true);
          setDragX(0);
          if (dir < 0) onNext();
          else (onSwipePrev ?? onPrev)();
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => setSkipArtworkTransition(false));
          });
        }, 160);
      } else {
        setDragX(0);
      }
      return;
    }

    if (g.axis === 'y') {
      setIsDraggingSheet(false);
      const velocityY = dy / dt;
      if (!cancelled && (sheetDragY > 110 || (dy > 40 && velocityY > 0.55))) {
        setSheetDragY(0);
        onClose();
      } else {
        setSheetDragY(0);
      }
    }
  };

  const effectiveDuration = duration > 0 ? duration : 0;
  const displayTime = isScrubbing ? scrubTime : currentTime;
  const progressPct =
    effectiveDuration > 0
      ? Math.min(100, Math.max(0, (displayTime / effectiveDuration) * 100))
      : 0;
  const remaining = Math.max(0, effectiveDuration - displayTime);

  const computeSeekTime = (clientX: number): number => {
    const el = scrubberRef.current;
    if (!el || effectiveDuration <= 0) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return ratio * effectiveDuration;
  };

  const handleScrubPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (effectiveDuration <= 0) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore capture failure
    }
    const sec = computeSeekTime(e.clientX);
    setIsScrubbing(true);
    setScrubTime(sec);
  };

  const handleScrubPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;
    setScrubTime(computeSeekTime(e.clientX));
  };

  const finishScrub = (e: ReactPointerEvent<HTMLDivElement>, commit: boolean) => {
    if (!isScrubbing) return;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore release failure
    }
    const finalSec = computeSeekTime(e.clientX);
    setIsScrubbing(false);
    if (commit && effectiveDuration > 0) {
      onSeek(finalSec);
    }
  };

  const handleScrubKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (effectiveDuration <= 0) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onSeek(Math.min(effectiveDuration, currentTime + 5));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onSeek(Math.max(0, currentTime - 5));
    }
  };

  const author = song.is_unknown_author ? t.unknownAuthor : song.artist;
  const gradient = getSongGradient(song.id);
  const dragProgress = Math.min(1, Math.abs(dragX) / CARD_SPACING);
  const artworkTransition =
    isDraggingArtwork || skipArtworkTransition
      ? 'none'
      : 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease';

  return (
    <div
      className={`${
        isDraggingSheet ? '' : 'am-spring'
      } fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-gradient-to-b from-[#FFF5F6] via-white to-[#F5F5F7] flex flex-col justify-between px-6 pt-4 pb-8 ${
        sheetDragY > 0 ? 'rounded-t-3xl shadow-2xl' : ''
      } ${
        isOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none'
      }`}
      style={{
        transform: sheetDragY > 0 ? `translateY(${sheetDragY}px)` : undefined,
      }}
    >
      {/* Top Grabber Bar (Supports Drag-Down to Close on Mobile & Desktop) */}
      <div
        onPointerDown={(e) => handlePointerDown('header', e)}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => handlePointerEnd(e, false)}
        onPointerCancel={(e) => handlePointerEnd(e, true)}
        className="flex items-center justify-between touch-none select-none cursor-grab active:cursor-grabbing"
      >
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-[#86868B] px-2 py-1 rounded-lg active:bg-black/5 flex items-center gap-1"
        >
          <ChevronDown className="w-4 h-4" />
          <span>{t.closePlayer}</span>
        </button>
        <div className="w-10 h-1.5 rounded-full bg-black/15" />
        <button
          type="button"
          onClick={() => onOpenReport(song)}
          className="text-[#FA243C] p-1.5 rounded-full bg-[#FA243C]/10 active:opacity-75"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Full-Bleed Artwork Carousel (Swipe L/R to Skip, Down to Close, Tap to Open Lyrics) */}
      {!showLyrics ? (
        <div
          onPointerDown={(e) => handlePointerDown('artwork', e)}
          onPointerMove={handlePointerMove}
          onPointerUp={(e) => handlePointerEnd(e, false)}
          onPointerCancel={(e) => handlePointerEnd(e, true)}
          className="my-auto relative -mx-6 w-[calc(100%+48px)] overflow-hidden py-4 flex items-center justify-center touch-none select-none cursor-grab active:cursor-grabbing"
        >
          {/* Peeking Previous Song Card */}
          {prevSong && dragX > 4 && (
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: `translateX(${-CARD_SPACING + dragX}px) scale(${0.88 + dragProgress * 0.12})`,
                opacity: Math.min(1, 0.35 + dragProgress * 0.65),
                transition: artworkTransition,
              }}
            >
              <div
                className={`w-64 h-64 rounded-3xl bg-gradient-to-br ${getSongGradient(
                  prevSong.id
                )} shadow-lg flex flex-col items-center justify-center text-white p-6 text-center`}
              >
                <Music2 className="w-12 h-12 mb-2.5 opacity-90" />
                <p className="text-sm font-bold leading-snug line-clamp-2">{prevSong.title}</p>
                <p className="text-[11px] opacity-80 mt-1">{t.brand}</p>
              </div>
            </div>
          )}

          {/* Active Artwork Card */}
          <div
            key={song.id}
            style={{
              transform:
                dragX !== 0
                  ? `translateX(${dragX}px) scale(${Math.max(0.92, 1 - dragProgress * 0.08)})`
                  : undefined,
              opacity: Math.max(0.45, 1 - dragProgress * 0.55),
              transition: artworkTransition,
            }}
          >
            <button
              type="button"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onClick={() => {
                if (suppressTapRef.current) return;
                if (onOpenLyricsMode) onOpenLyricsMode(song);
                else setShowLyrics(true);
              }}
              aria-label={t.lyricsBtn}
              className={`am-spring ${
                isPlaying ? 'scale-100' : 'scale-90 opacity-90'
              } w-64 h-64 rounded-3xl bg-gradient-to-br ${gradient} shadow-[0_24px_50px_rgba(250,36,60,0.22)] flex flex-col items-center justify-center text-white p-6 text-center cursor-pointer active:scale-95`}
            >
              <Music2 className="w-14 h-14 mb-3 opacity-95" />
              <p className="text-base font-bold leading-snug line-clamp-2">{song.title}</p>
              <p className="text-xs opacity-80 mt-1">{t.brand}</p>
              <span className="mt-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold">
                {t.lyricsBtn}
              </span>
            </button>
          </div>

          {/* Peeking Next Song Card */}
          {nextSong && dragX < -4 && (
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: `translateX(${CARD_SPACING + dragX}px) scale(${0.88 + dragProgress * 0.12})`,
                opacity: Math.min(1, 0.35 + dragProgress * 0.65),
                transition: artworkTransition,
              }}
            >
              <div
                className={`w-64 h-64 rounded-3xl bg-gradient-to-br ${getSongGradient(
                  nextSong.id
                )} shadow-lg flex flex-col items-center justify-center text-white p-6 text-center`}
              >
                <Music2 className="w-12 h-12 mb-2.5 opacity-90" />
                <p className="text-sm font-bold leading-snug line-clamp-2">{nextSong.title}</p>
                <p className="text-[11px] opacity-80 mt-1">{t.brand}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <LyricsView
          songId={song.id}
          songLang={song.lang}
          lyrics={song.lyrics ?? ''}
          songKey={song.song_key ?? kaynarSong?.songKey ?? null}
          capo={song.capo ?? kaynarSong?.capo ?? null}
          kaynarSong={kaynarSong}
          lang={lang}
          defaultVersion={defaultLyricsVersion}
          standardLabel={t.lyricsStandard}
          kaynarLabel={t.tabKaynar}
          title={song.title}
          author={author}
          gradient={gradient}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          lyricsLabel={t.lyricsBtn}
          onSeek={onSeek}
          onClose={() => setShowLyrics(false)}
        />
      )}

      {/* Track Metadata + Scrubber + Transport */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-extrabold text-[#1D1D1F] truncate">{song.title}</h2>
            <p className="text-xs font-medium text-[#FA243C] truncate">{author}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {onToggleLike && (
              <button
                type="button"
                onClick={() => onToggleLike(song)}
                aria-label={t.myPlaylistTitle}
                aria-pressed={isLiked}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition active:scale-90 ${
                  isLiked
                    ? 'bg-[#FA243C]/12 border-[#FA243C]/25 text-[#FA243C]'
                    : 'bg-[#F5F5F7] border-black/[0.06] text-[#86868B]'
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-transform duration-150 ${
                    isLiked ? 'fill-[#FA243C] text-[#FA243C] scale-110' : 'scale-100'
                  }`}
                />
              </button>
            )}
            <button
              type="button"
              disabled={isSavingOffline}
              onClick={() => onToggleOffline(song)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 border transition ${
                isSavingOffline
                  ? 'bg-[#FA243C]/10 text-[#FA243C] border-[#FA243C]/20'
                  : isOffline
                  ? 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/25'
                  : 'bg-[#F5F5F7] text-[#1D1D1F] border-black/[0.06] active:bg-black/10'
              }`}
            >
              {isSavingOffline ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isOffline ? (
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>
                {isSavingOffline
                  ? lang === 'ko'
                    ? '저장 중...'
                    : lang === 'kk'
                    ? 'Сақталуда...'
                    : lang === 'ru'
                    ? 'Сохранение...'
                    : 'Saving...'
                  : isOffline
                  ? t.savedOffline
                  : t.saveOffline}
              </span>
            </button>
          </div>
        </div>

        {/* Elastic Apple Music Scrubber */}
        <div
          className="space-y-1.5"
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div
            ref={scrubberRef}
            role="slider"
            tabIndex={0}
            aria-label="Seek timeline"
            aria-valuemin={0}
            aria-valuemax={effectiveDuration}
            aria-valuenow={displayTime}
            onPointerDown={handleScrubPointerDown}
            onPointerMove={handleScrubPointerMove}
            onPointerUp={(e) => finishScrub(e, true)}
            onPointerCancel={(e) => finishScrub(e, false)}
            onKeyDown={handleScrubKeyDown}
            className="group py-2 -my-2 cursor-pointer touch-none select-none flex items-center"
          >
            <div
              className={`relative w-full rounded-full bg-black/[0.09] overflow-visible transition-[height] duration-150 ${
                isScrubbing ? 'h-2.5' : 'h-1.5 group-hover:h-2'
              }`}
            >
              <div
                className="h-full rounded-full bg-[#FA243C] relative transition-[width] duration-75"
                style={{ width: `${progressPct}%` }}
              >
                <span
                  className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#FA243C] shadow-sm transition-transform duration-150 ${
                    isScrubbing ? 'w-3.5 h-3.5 scale-100' : 'w-2.5 h-2.5 scale-0'
                  }`}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs font-mono text-[#86868B]">
            <span className={isScrubbing ? 'text-[#FA243C] font-bold' : ''}>
              {formatTime(displayTime)}
            </span>
            <span className="text-[#1D1D1F] font-sans font-medium">
              ▶ {song.play_count.toLocaleString()} {t.plays}
            </span>
            <span>-{formatTime(remaining)}</span>
          </div>
        </div>

        {/* Transport Controls */}
        <div className="flex items-center justify-around py-1">
          <button type="button" onClick={onPrev} className="p-2 text-[#1D1D1F] active:scale-90 transition">
            <SkipBack className="w-7 h-7 fill-[#1D1D1F]" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className="w-16 h-16 rounded-full bg-[#FA243C] text-white shadow-lg shadow-[#FA243C]/30 flex items-center justify-center active:scale-95 transition"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white ml-1" />
            )}
          </button>

          <button type="button" onClick={onNext} className="p-2 text-[#1D1D1F] active:scale-90 transition">
            <SkipForward className="w-7 h-7 fill-[#1D1D1F]" />
          </button>
        </div>

        {/* Bottom Mode Pills */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              if (onOpenLyricsMode) onOpenLyricsMode(song);
              else setShowLyrics((prev) => !prev);
            }}
            className="py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 bg-[#F5F5F7] text-[#1D1D1F] active:bg-black/10 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FA243C]" />
            <span>{t.lyricsBtn}</span>
          </button>

          <button
            type="button"
            onClick={onToggleShuffle}
            className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition ${
              isShuffle ? 'bg-[#FA243C] text-white' : 'bg-[#F5F5F7] text-[#1D1D1F]'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{t.shuffleBtn}</span>
          </button>

          <button
            type="button"
            onClick={onCycleRepeat}
            className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition ${
              repeatMode === 'off'
                ? 'bg-[#F5F5F7] text-[#86868B]'
                : repeatMode === 'all'
                ? 'bg-[#FA243C]/15 text-[#FA243C]'
                : 'bg-[#FA243C] text-white'
            }`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
            <span>
              {repeatMode === 'off' ? t.repeatOff : repeatMode === 'all' ? t.repeatAll : t.repeatOne}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

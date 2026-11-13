import { useState } from 'react';
import {
  Check,
  ChevronDown,
  Download,
  MessageSquareQuote,
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
import type { TranslationStrings } from '../i18n/translations';
import type { RepeatMode, Song } from '../types';
import { getSongGradient } from './SongRow';

interface FullPlayerSheetProps {
  isOpen: boolean;
  song: Song;
  isPlaying: boolean;
  isOffline: boolean;
  currentTime: number;
  duration: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  t: TranslationStrings;
  onClose: () => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (sec: number) => void;
  onCycleRepeat: () => void;
  onToggleShuffle: () => void;
  onToggleOffline: (song: Song) => void;
  onOpenReport: (song: Song) => void;
}

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function FullPlayerSheet({
  isOpen,
  song,
  isPlaying,
  isOffline,
  currentTime,
  duration,
  repeatMode,
  isShuffle,
  t,
  onClose,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onCycleRepeat,
  onToggleShuffle,
  onToggleOffline,
  onOpenReport,
}: FullPlayerSheetProps) {
  const [showLyrics, setShowLyrics] = useState(false);

  const author = song.is_unknown_author ? t.unknownAuthor : song.artist;
  const gradient = getSongGradient(song.id);
  const remaining = Math.max(0, (duration || 0) - currentTime);

  return (
    <div
      className={`am-spring fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-gradient-to-b from-[#FFF5F6] via-white to-[#F5F5F7] flex flex-col justify-between px-6 pt-4 pb-8 ${
        isOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none'
      }`}
    >
      {/* Top Grabber Bar */}
      <div className="flex items-center justify-between">
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

      {/* Center Artwork or Lyrics */}
      {!showLyrics ? (
        <div className="my-auto flex flex-col items-center py-2">
          <div
            className={`am-spring ${
              isPlaying ? 'scale-100' : 'scale-90 opacity-90'
            } w-64 h-64 rounded-3xl bg-gradient-to-br ${gradient} shadow-[0_24px_50px_rgba(250,36,60,0.22)] flex flex-col items-center justify-center text-white p-6 text-center`}
          >
            <Music2 className="w-14 h-14 mb-3 opacity-95" />
            <p className="text-base font-bold leading-snug line-clamp-2">{song.title}</p>
            <p className="text-xs opacity-80 mt-1">{t.brand}</p>
          </div>
        </div>
      ) : (
        <div className="my-auto bg-[#F5F5F7] rounded-3xl p-5 max-h-64 overflow-y-auto space-y-2 border border-black/[0.04]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FA243C]">
              {t.lyricsBtn}
            </span>
            <button
              type="button"
              onClick={() => setShowLyrics(false)}
              className="text-xs font-semibold text-[#86868B]"
            >
              ✕
            </button>
          </div>
          <p className="text-sm font-semibold text-[#1D1D1F] whitespace-pre-line leading-relaxed">
            {song.lyrics || '—'}
          </p>
        </div>
      )}

      {/* Track Metadata + Scrubber + Transport */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-[#1D1D1F] truncate">{song.title}</h2>
            <p className="text-xs font-medium text-[#FA243C] truncate">{author}</p>
          </div>
          <button
            type="button"
            onClick={() => onToggleOffline(song)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1 transition ${
              isOffline ? 'bg-[#34C759]/15 text-[#34C759]' : 'bg-[#F5F5F7] text-[#1D1D1F]'
            }`}
          >
            {isOffline ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isOffline ? t.savedOffline : t.saveOffline}</span>
          </button>
        </div>

        {/* Scrubber */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.5}
            value={Math.min(currentTime, duration || 1)}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full accent-[#FA243C] h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-xs font-mono text-[#86868B]">
            <span>{formatTime(currentTime)}</span>
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
            onClick={() => setShowLyrics((v) => !v)}
            className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition ${
              showLyrics ? 'bg-[#FA243C] text-white' : 'bg-[#F5F5F7] text-[#1D1D1F]'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
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

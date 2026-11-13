import { Music2, Pause, Play, Shuffle, SkipForward } from 'lucide-react';
import type { TranslationStrings } from '../i18n/translations';
import type { Song } from '../types';
import { getSongGradient } from './SongRow';

interface MiniPlayerProps {
  song: Song | null;
  isPlaying: boolean;
  isOffline: boolean;
  isShuffle: boolean;
  hasSongs: boolean;
  hasBottomNav?: boolean;
  currentTime: number;
  duration: number;
  t: TranslationStrings;
  onExpand: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPlayFirst: () => void;
  onShufflePlay: () => void;
  onToggleShuffle: () => void;
}

export function MiniPlayer({
  song,
  isPlaying,
  isOffline,
  isShuffle,
  hasSongs,
  hasBottomNav = true,
  currentTime,
  duration,
  t,
  onExpand,
  onTogglePlay,
  onNext,
  onPlayFirst,
  onShufflePlay,
  onToggleShuffle,
}: MiniPlayerProps) {
  if (!song) {
    if (!hasSongs) return null;
    return (
      <div
        className={`fixed ${hasBottomNav ? 'bottom-[64px]' : 'bottom-3'} left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[406px] z-30 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] border border-black/[0.06] p-2`}
      >
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onPlayFirst}
            className="py-2.5 rounded-xl bg-[#F5F5F7] active:bg-black/10 text-[#FA243C] font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Play className="w-3.5 h-3.5 fill-[#FA243C]" />
            <span>{t.playBtn}</span>
          </button>
          <button
            type="button"
            onClick={onShufflePlay}
            className="py-2.5 rounded-xl bg-[#F5F5F7] active:bg-black/10 text-[#FA243C] font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{t.shuffleBtn}</span>
          </button>
        </div>
      </div>
    );
  }

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const author = song.is_unknown_author ? t.unknownAuthor : song.artist;
  const gradient = getSongGradient(song.id);

  return (
    <div
      onClick={onExpand}
      className={`fixed ${hasBottomNav ? 'bottom-[64px]' : 'bottom-3'} left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[406px] z-30 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] border border-black/[0.06] px-3 py-2 cursor-pointer active:scale-[0.99] am-spring`}
    >
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-xs shrink-0`}
          >
            <Music2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#1D1D1F] truncate">{song.title}</p>
            <p className="text-xs text-[#86868B] truncate">
              {author} · {isOffline ? 'IndexedDB ✓' : 'Stream'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={onToggleShuffle}
            aria-label={t.shuffleBtn}
            className={`w-8 h-8 rounded-full flex items-center justify-center active:bg-black/5 transition ${
              isShuffle ? 'text-[#FA243C]' : 'text-[#86868B]'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onTogglePlay}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#1D1D1F] active:bg-black/5"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-[#1D1D1F]" /> : <Play className="w-4 h-4 fill-[#1D1D1F] ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={onNext}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1D1D1F] active:bg-black/5"
          >
            <SkipForward className="w-4 h-4 fill-[#1D1D1F]" />
          </button>
        </div>
      </div>

      <div className="w-full bg-black/[0.06] h-0.5 rounded-full mt-1.5 overflow-hidden">
        <div className="bg-[#FA243C] h-full transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

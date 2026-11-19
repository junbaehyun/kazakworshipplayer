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
  const positionClass = hasBottomNav
    ? 'bottom-[calc(72px+env(safe-area-inset-bottom))]'
    : 'bottom-[calc(14px+env(safe-area-inset-bottom))]';

  if (!song) {
    if (!hasSongs) return null;
    return (
      <div
        className={`fixed ${positionClass} left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[406px] z-30 rounded-[28px] liquid-glass px-3 py-2 flex items-center justify-between gap-2.5 am-spring`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FA243C] to-[#FF6B81] flex items-center justify-center text-white shadow-xs shrink-0">
            <Music2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#1D1D1F] truncate">{t.tabListen}</p>
            <p className="text-[11px] text-[#6E6E73] truncate">{t.brand}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onShufflePlay}
            aria-label={t.shuffleBtn}
            className="w-9 h-9 rounded-full bg-[#FA243C]/12 text-[#FA243C] flex items-center justify-center active:scale-95 transition"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onPlayFirst}
            aria-label={t.playBtn}
            className="w-9 h-9 rounded-full bg-[#FA243C] text-white flex items-center justify-center shadow-xs active:scale-95 transition"
          >
            <Play className="w-4 h-4 fill-white ml-0.5" />
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
      className={`fixed ${positionClass} left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[406px] z-30 rounded-[28px] liquid-glass px-3 py-2 cursor-pointer active:scale-[0.99] am-spring`}
    >
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-10 h-10 rounded-[16px] bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-xs shrink-0`}
          >
            <Music2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#1D1D1F] truncate">{song.title}</p>
            <div className="flex items-center gap-1.5 min-w-0">
              {isOffline && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] shrink-0" title={t.savedOffline} />
              )}
              <p className="text-[11px] text-[#6E6E73] truncate">{author}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={onToggleShuffle}
            aria-label={t.shuffleBtn}
            className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition ${
              isShuffle ? 'bg-[#FA243C]/12 text-[#FA243C]' : 'text-[#6E6E73] active:bg-black/5'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause' : t.playBtn}
            className="w-9 h-9 rounded-full bg-[#1D1D1F]/[0.07] active:bg-[#1D1D1F]/15 text-[#1D1D1F] flex items-center justify-center transition"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-[#1D1D1F]" />
            ) : (
              <Play className="w-4 h-4 fill-[#1D1D1F] ml-0.5" />
            )}
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1D1D1F] active:bg-black/5 transition"
          >
            <SkipForward className="w-4 h-4 fill-[#1D1D1F]" />
          </button>
        </div>
      </div>

      <div className="mx-2.5 mt-1.5 h-[2.5px] rounded-full bg-black/[0.06] overflow-hidden">
        <div className="bg-[#FA243C] h-full rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

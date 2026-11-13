import { Music2, Pause, Play, SkipForward } from 'lucide-react';
import type { TranslationStrings } from '../i18n/translations';
import type { Song } from '../types';
import { getSongGradient } from './SongRow';

interface MiniPlayerProps {
  song: Song;
  isPlaying: boolean;
  isOffline: boolean;
  currentTime: number;
  duration: number;
  t: TranslationStrings;
  onExpand: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
}

export function MiniPlayer({
  song,
  isPlaying,
  isOffline,
  currentTime,
  duration,
  t,
  onExpand,
  onTogglePlay,
  onNext,
}: MiniPlayerProps) {
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const author = song.is_unknown_author ? t.unknownAuthor : song.artist;
  const gradient = getSongGradient(song.id);

  return (
    <div
      onClick={onExpand}
      className="fixed bottom-[64px] left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[406px] z-30 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] border border-black/[0.06] px-3 py-2 cursor-pointer active:scale-[0.99] am-spring"
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

        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
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

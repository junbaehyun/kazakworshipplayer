import { Heart, ListCheck, ListPlus, Music2, Pause, Play } from 'lucide-react';
import type { TranslationStrings } from '../i18n/translations';
import type { Song } from '../types';

const GRADIENTS = [
  'from-[#FA243C] to-[#FF7A00]',
  'from-[#007AFF] to-[#00C6FF]',
  'from-[#AF52DE] to-[#FF2D55]',
  'from-[#34C759] to-[#00B09B]',
  'from-[#FF9500] to-[#FF3B30]',
];

export function getSongGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

interface SongRowProps {
  song: Song;
  rank?: number;
  isCurrent: boolean;
  isPlaying: boolean;
  isOffline?: boolean;
  isSavingOffline?: boolean;
  isInPlaylist?: boolean;
  isLiked?: boolean;
  t: TranslationStrings;
  onPlay: (song: Song) => void;
  onToggleOffline?: (song: Song) => void;
  onTogglePlaylist?: (song: Song) => void;
  onToggleLike?: (song: Song) => void;
  onOpenReport?: (song: Song) => void;
}

export function SongRow({
  song,
  rank,
  isCurrent,
  isPlaying,
  isInPlaylist = false,
  isLiked = false,
  t,
  onPlay,
  onTogglePlaylist,
  onToggleLike,
}: SongRowProps) {
  const authorLabel = song.is_unknown_author ? t.unknownAuthor : song.artist;
  const gradient = getSongGradient(song.id);

  return (
    <div className="py-2.5 flex items-center justify-between gap-2.5">
      <button
        type="button"
        onClick={() => onPlay(song)}
        className="flex items-center gap-3 min-w-0 flex-1 text-left active:opacity-75 transition"
      >
        {typeof rank === 'number' && (
          <span
            className={`w-6 text-center text-xs font-extrabold tabular-nums shrink-0 ${
              rank <= 3 ? 'text-[#FA243C]' : 'text-[#86868B]'
            }`}
          >
            {rank}
          </span>
        )}

        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-xs shrink-0`}
        >
          {isCurrent && isPlaying ? (
            <Pause className="w-4 h-4 fill-white" />
          ) : isCurrent ? (
            <Play className="w-4 h-4 fill-white ml-0.5" />
          ) : (
            <Music2 className="w-4 h-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-semibold truncate ${
              isCurrent ? 'text-[#FA243C]' : 'text-[#1D1D1F]'
            }`}
          >
            {song.title}
          </p>
          <p className="text-xs text-[#86868B] truncate">
            {authorLabel} · ▶ {song.play_count.toLocaleString()} {t.plays}
          </p>
        </div>
      </button>

      <div className="flex items-center gap-1.5 shrink-0">
        {onTogglePlaylist && (
          <button
            type="button"
            onClick={() => onTogglePlaylist(song)}
            title={isInPlaylist ? t.inPlaylist : t.addToPlaylist}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
              isInPlaylist
                ? 'bg-[#FA243C]/12 text-[#FA243C]'
                : 'bg-[#F5F5F7] text-[#86868B] active:bg-black/10'
            }`}
          >
            {isInPlaylist ? (
              <ListCheck className="w-3.5 h-3.5" />
            ) : (
              <ListPlus className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {onToggleLike && (
          <button
            type="button"
            onClick={() => onToggleLike(song)}
            aria-label="Like"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
              isLiked
                ? 'bg-[#FA243C]/12 text-[#FA243C]'
                : 'bg-[#F5F5F7] text-[#86868B] active:bg-black/10'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#FA243C]' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
}

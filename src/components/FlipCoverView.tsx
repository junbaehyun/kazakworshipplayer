import { useState } from 'react';
import {
  BookOpen,
  Heart,
  ListMusic,
  Maximize2,
  Music2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Sun,
} from 'lucide-react';
import type { KaynarSong } from '../data/bakhytKaynarSongs';
import type { TranslationStrings } from '../i18n/translations';
import type { Language, RepeatMode, Song } from '../types';
import { LyricsView } from './LyricsView';
import { getSongGradient } from './SongRow';

type CoverSubView = 'player' | 'lyrics' | 'list';
type CoverFilter = 'all' | 'kaynar' | 'playlist';

interface FlipCoverViewProps {
  lang: Language;
  t: TranslationStrings;
  song: Song | null;
  kaynarSong: KaynarSong | null;
  defaultLyricsVersion: 'standard' | 'kaynar';
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  allSongs: Song[];
  kaynarAudioIds: Set<string>;
  playlistIds: string[];
  wakeLockEnabled: boolean;
  wakeLockLocked: boolean;
  onToggleWakeLock: () => void;
  onExitCoverMode: () => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (sec: number) => void;
  onCycleRepeat: () => void;
  onToggleShuffle: () => void;
  onPlaySong: (song: Song, fromKaynar?: boolean) => void;
  onTogglePlaylist: (song: Song) => void;
}

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function FlipCoverView({
  lang,
  t,
  song,
  kaynarSong,
  defaultLyricsVersion,
  isPlaying,
  currentTime,
  duration,
  repeatMode,
  isShuffle,
  allSongs,
  kaynarAudioIds,
  playlistIds,
  wakeLockEnabled,
  wakeLockLocked,
  onToggleWakeLock,
  onExitCoverMode,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onCycleRepeat,
  onToggleShuffle,
  onPlaySong,
  onTogglePlaylist,
}: FlipCoverViewProps) {
  const [subView, setSubView] = useState<CoverSubView>('player');
  const [filter, setFilter] = useState<CoverFilter>('all');

  const filteredList =
    filter === 'kaynar'
      ? allSongs.filter((s) => kaynarAudioIds.has(s.id))
      : filter === 'playlist'
      ? allSongs.filter((s) => playlistIds.includes(s.id))
      : allSongs;

  const isCurrentInPlaylist = Boolean(song && playlistIds.includes(song.id));
  const gradient = song ? getSongGradient(song.id) : 'from-[#FA243C] to-[#FF7A00]';
  const author = song ? (song.is_unknown_author ? t.unknownAuthor : song.artist) : t.brand;

  const wakeLabel =
    lang === 'ko'
      ? '화면 켜짐'
      : lang === 'kk'
      ? 'Экран ояу'
      : lang === 'ru'
      ? 'Экран вкл.'
      : 'Keep On';

  const listLabel =
    lang === 'ko' ? '목록' : lang === 'kk' ? 'Тізім' : lang === 'ru' ? 'Список' : 'List';

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] max-w-none bg-white flex flex-col justify-between overflow-hidden select-none z-40">
      {/* Compact Flip 5 Top Bar */}
      <header className="px-3 pt-2.5 pb-2 border-b border-black/[0.06] bg-white/95 backdrop-blur-md flex items-center justify-between gap-1.5 shrink-0">
        {/* 2-Tab Switcher: Player (Tap card for Lyrics) | List */}
        <div className="inline-flex rounded-xl bg-[#F5F5F7] p-0.5 border border-black/[0.04]">
          <button
            type="button"
            onClick={() => setSubView('player')}
            className={`px-3 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition ${
              subView === 'player' || subView === 'lyrics'
                ? 'bg-[#FA243C] text-white shadow-xs'
                : 'text-[#1D1D1F]'
            }`}
          >
            <Music2 className="w-3 h-3" />
            <span>Flip</span>
          </button>
          <button
            type="button"
            onClick={() => setSubView('list')}
            className={`px-3 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition ${
              subView === 'list'
                ? 'bg-[#FA243C] text-white shadow-xs'
                : 'text-[#1D1D1F]'
            }`}
          >
            <ListMusic className="w-3 h-3" />
            <span>{listLabel}</span>
          </button>
        </div>

        {/* Keep Screen On (Wake Lock) + Exit Cover Mode */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onToggleWakeLock}
            title={wakeLabel}
            className={`px-2 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1 border transition ${
              wakeLockEnabled
                ? 'bg-[#34C759]/15 text-[#1D1D1F] border-[#34C759]/40'
                : 'bg-[#F5F5F7] text-[#86868B] border-black/[0.04]'
            }`}
          >
            <Sun
              className={`w-3 h-3 ${
                wakeLockEnabled ? 'text-[#34C759] fill-[#34C759]' : 'text-[#86868B]'
              }`}
            />
            <span>{wakeLabel}</span>
            {wakeLockLocked && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
            )}
          </button>

          <button
            type="button"
            onClick={onExitCoverMode}
            title="Full View"
            aria-label="Exit cover screen mode"
            className="w-7 h-7 rounded-xl bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center border border-black/[0.04] active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* SUB-VIEW 1: BIG THUMB-FRIENDLY COVER PLAYER */}
      {subView === 'player' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between px-4 pt-3 pb-7">
          {/* Song Card — Tap Card to Open Lyrics & Chords */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSubView('lyrics')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setSubView('lyrics');
            }}
            className="flex items-center gap-3 bg-[#F5F5F7] active:bg-[#EBEBF0] rounded-2xl p-3.5 border border-black/[0.04] cursor-pointer transition"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm shrink-0`}
            >
              <Music2 className="w-7 h-7" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                {kaynarSong && (
                  <span className="px-1.5 py-0.5 rounded-md bg-[#FA243C]/12 text-[#FA243C] text-[9px] font-extrabold shrink-0">
                    {t.tabKaynar}
                  </span>
                )}
                {song?.song_key && (
                  <span className="px-1.5 py-0.5 rounded-md bg-white text-[#1D1D1F] text-[9px] font-extrabold border border-black/[0.06] shrink-0">
                    Key: {song.song_key}
                  </span>
                )}
                <span className="px-1.5 py-0.5 rounded-md bg-black/[0.06] text-[#515154] text-[9px] font-bold shrink-0">
                  {t.lyricsBtn}
                </span>
              </div>
              <h1 className="text-base font-extrabold text-[#1D1D1F] truncate mt-0.5">
                {song ? song.title : t.brand}
              </h1>
              <p className="text-xs font-medium text-[#86868B] truncate">{author}</p>
            </div>
            {song && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePlaylist(song);
                }}
                aria-label={isCurrentInPlaylist ? t.inPlaylist : t.addToPlaylist}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition ${
                  isCurrentInPlaylist
                    ? 'bg-[#FA243C]/15 text-[#FA243C]'
                    : 'bg-white text-[#86868B]'
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isCurrentInPlaylist ? 'fill-[#FA243C]' : ''}`}
                />
              </button>
            )}
          </div>

          {/* Scrubber */}
          <div className="space-y-1 px-0.5">
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.5}
              value={Math.min(currentTime, duration || 1)}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="w-full accent-[#FA243C] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-[#86868B]">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(Math.max(0, (duration || 0) - currentTime))}</span>
            </div>
          </div>

          {/* Oversized Transport Controls */}
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              onClick={onToggleShuffle}
              aria-label={t.shuffleBtn}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition ${
                isShuffle
                  ? 'bg-[#FA243C] text-white'
                  : 'bg-[#F5F5F7] text-[#1D1D1F]'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous"
              className="w-12 h-12 rounded-2xl bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center active:scale-95 transition"
            >
              <SkipBack className="w-6 h-6 fill-[#1D1D1F]" />
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              aria-label="Play or Pause"
              className="w-16 h-16 rounded-3xl bg-[#FA243C] text-white shadow-lg shadow-[#FA243C]/30 flex items-center justify-center active:scale-95 transition"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-white" />
              ) : (
                <Play className="w-7 h-7 fill-white ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={onNext}
              aria-label="Next"
              className="w-12 h-12 rounded-2xl bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center active:scale-95 transition"
            >
              <SkipForward className="w-6 h-6 fill-[#1D1D1F]" />
            </button>

            <button
              type="button"
              onClick={onCycleRepeat}
              aria-label="Repeat"
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition ${
                repeatMode === 'off'
                  ? 'bg-[#F5F5F7] text-[#86868B]'
                  : repeatMode === 'all'
                  ? 'bg-[#FA243C]/15 text-[#FA243C]'
                  : 'bg-[#FA243C] text-white'
              }`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: FULL-SQUARE LYRICS & CHORDS TELEPROMPTER */}
      {subView === 'lyrics' && (
        <div className="flex-1 min-h-0 flex flex-col px-2.5 pb-2">
          {song ? (
            <>
              <LyricsView
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
                onClose={() => setSubView('player')}
              />
              {/* Compact bottom-left transport pill (avoids bottom-right Flip 5 camera notch) */}
              <div className="flex items-center justify-between gap-2 px-1 pt-0.5 pr-12 shrink-0">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onPrev}
                    className="w-8 h-8 rounded-xl bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center"
                  >
                    <SkipBack className="w-3.5 h-3.5 fill-[#1D1D1F]" />
                  </button>
                  <button
                    type="button"
                    onClick={onTogglePlay}
                    className="px-3.5 h-8 rounded-xl bg-[#FA243C] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-white" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-white" />
                    )}
                    <span>{formatTime(currentTime)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    className="w-8 h-8 rounded-xl bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center"
                  >
                    <SkipForward className="w-3.5 h-3.5 fill-[#1D1D1F]" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onTogglePlaylist(song)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isCurrentInPlaylist
                      ? 'bg-[#FA243C]/15 text-[#FA243C]'
                      : 'bg-[#F5F5F7] text-[#86868B]'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isCurrentInPlaylist ? 'fill-[#FA243C]' : ''}`}
                  />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-[#86868B]">
              {t.noSongsFound}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: COMPACT QUICK SONG PICKER */}
      {subView === 'list' && (
        <div className="flex-1 min-h-0 flex flex-col px-3 pt-2 pb-4">
          {/* Filter Chips + Shuffle */}
          <div className="flex items-center justify-between gap-1.5 pb-2 shrink-0">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {(
                [
                  { id: 'all', label: t.filterAll, count: allSongs.length },
                  {
                    id: 'kaynar',
                    label: t.tabKaynar,
                    count: allSongs.filter((s) => kaynarAudioIds.has(s.id)).length,
                  },
                  {
                    id: 'playlist',
                    label: '♥',
                    count: allSongs.filter((s) => playlistIds.includes(s.id)).length,
                  },
                ] as const
              ).map((chip) => {
                const active = filter === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setFilter(chip.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold whitespace-nowrap flex items-center gap-1 transition ${
                      active
                        ? 'bg-[#FA243C] text-white'
                        : 'bg-[#F5F5F7] text-[#1D1D1F]'
                    }`}
                  >
                    <span>{chip.label}</span>
                    <span className="text-[10px] opacity-80">{chip.count}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                if (!isShuffle) onToggleShuffle();
                const pick =
                  filteredList[Math.floor(Math.random() * filteredList.length)];
                if (pick) {
                  onPlaySong(pick, filter === 'kaynar');
                  setSubView('player');
                }
              }}
              className="px-2.5 py-1 rounded-full bg-[#FA243C]/12 text-[#FA243C] text-[11px] font-extrabold flex items-center gap-1 shrink-0"
            >
              <Shuffle className="w-3 h-3" />
              <span>{t.shuffleBtn}</span>
            </button>
          </div>

          {/* Scrollable Compact Rows */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-black/[0.05] pr-1">
            {filteredList.map((item, idx) => {
              const isCurr = song?.id === item.id;
              const inPl = playlistIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="py-2 flex items-center justify-between gap-2"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySong(item, filter === 'kaynar');
                      setSubView('player');
                    }}
                    className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                  >
                    <span className="w-5 text-[11px] font-extrabold text-[#86868B] tabular-nums shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-bold truncate ${
                          isCurr ? 'text-[#FA243C]' : 'text-[#1D1D1F]'
                        }`}
                      >
                        {item.title}
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySong(item, filter === 'kaynar');
                        setSubView('lyrics');
                      }}
                      className="w-7 h-7 rounded-full bg-[#F5F5F7] text-[#515154] flex items-center justify-center"
                    >
                      <BookOpen className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onTogglePlaylist(item)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        inPl
                          ? 'bg-[#FA243C]/12 text-[#FA243C]'
                          : 'bg-[#F5F5F7] text-[#86868B]'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${inPl ? 'fill-[#FA243C]' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

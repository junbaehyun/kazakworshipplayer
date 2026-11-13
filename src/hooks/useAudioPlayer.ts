import { useCallback, useEffect, useRef, useState } from 'react';
import type { RepeatMode, Song } from '../types';
import { incrementSongPlay, resolveAudioSource } from '../lib/supabase';

interface UseAudioPlayerOptions {
  songs: Song[];
  onPlayCountUpdated: (songId: string, newCount: number) => void;
  onBeforePlay?: (song: Song) => boolean;
  onSongEnded?: (song: Song) => boolean | void;
}

function buildShuffledIds(songs: Song[], excludeId?: string): string[] {
  const pool = songs.length > 1 && excludeId
    ? songs.filter((s) => s.id !== excludeId).map((s) => s.id)
    : songs.map((s) => s.id);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

export function useAudioPlayer({
  songs,
  onPlayCountUpdated,
  onBeforePlay,
  onSongEnded,
}: UseAudioPlayerOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const playTrackedForIdRef = useRef<string | null>(null);
  const listenedSecondsRef = useRef<number>(0);
  const shuffleQueueRef = useRef<string[]>([]);
  const shuffleHistoryRef = useRef<string[]>([]);
  const skipHistoryPushRef = useRef<boolean>(false);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(() => {
    const saved = localStorage.getItem('kwp_repeat') as RepeatMode | null;
    return saved || 'all';
  });
  const [isShuffle, setIsShuffle] = useState<boolean>(() => {
    return localStorage.getItem('kwp_shuffle') === 'true';
  });

  // Ensure singleton <audio> element exists
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'auto';
      audioRef.current = audio;
    }
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const triggerPlayIncrement = useCallback(
    async (song: Song) => {
      playTrackedForIdRef.current = song.id;
      const updated = await incrementSongPlay(song.id);
      if (typeof updated === 'number') {
        onPlayCountUpdated(song.id, updated);
      }
    },
    [onPlayCountUpdated]
  );

  const playSong = useCallback(
    async (song: Song) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (currentSong?.id === song.id && audio.src) {
        if (audio.paused) {
          if (onBeforePlay && !onBeforePlay(song)) return;
          await audio.play().catch(() => {});
          setIsPlaying(true);
        } else {
          audio.pause();
          setIsPlaying(false);
        }
        return;
      }

      if (onBeforePlay && !onBeforePlay(song)) return;

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      if (skipHistoryPushRef.current) {
        skipHistoryPushRef.current = false;
      } else if (currentSong?.id && currentSong.id !== song.id) {
        const hist = shuffleHistoryRef.current;
        if (hist[hist.length - 1] !== currentSong.id) {
          hist.push(currentSong.id);
          if (hist.length > 100) hist.shift();
        }
      }
      shuffleQueueRef.current = shuffleQueueRef.current.filter((id) => id !== song.id);

      const { src, isObjectUrl } = await resolveAudioSource(song);
      if (isObjectUrl) objectUrlRef.current = src;

      playTrackedForIdRef.current = null;
      listenedSecondsRef.current = 0;

      audio.src = src;
      setCurrentSong(song);
      setCurrentTime(0);

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        console.warn('Audio play interrupted:', e);
        setIsPlaying(false);
      }

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: song.title,
          artist: song.is_unknown_author ? 'Белгісіз автор' : song.artist,
          album: 'Қазақша Мадақ Әндері',
        });
      }
    },
    [currentSong, onBeforePlay]
  );

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!currentSong && songs.length > 0) {
      await playSong(songs[0]);
      return;
    }
    if (audio.paused) {
      if (currentSong && onBeforePlay && !onBeforePlay(currentSong)) return;
      await audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [currentSong, onBeforePlay, playSong, songs]);

  const playNext = useCallback(
    (autoAdvance = false) => {
      if (songs.length === 0) return;
      if (autoAdvance && repeatMode === 'one' && currentSong && audioRef.current) {
        playTrackedForIdRef.current = null;
        listenedSecondsRef.current = 0;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
        return;
      }

      if (isShuffle) {
        const songMap = new Map(songs.map((s) => [s.id, s]));
        shuffleQueueRef.current = shuffleQueueRef.current.filter(
          (id) => songMap.has(id) && (songs.length <= 1 || id !== currentSong?.id)
        );
        if (shuffleQueueRef.current.length === 0) {
          if (autoAdvance && repeatMode === 'off') {
            setIsPlaying(false);
            return;
          }
          shuffleQueueRef.current = buildShuffledIds(songs, currentSong?.id);
        }
        const nextId = shuffleQueueRef.current.shift();
        const pick = nextId ? songMap.get(nextId) : songs[0];
        if (pick) void playSong(pick);
        return;
      }

      const idx = currentSong ? songs.findIndex((s) => s.id === currentSong.id) : -1;
      const isLast = idx === songs.length - 1;
      if (autoAdvance && repeatMode === 'off' && isLast) {
        setIsPlaying(false);
        return;
      }
      const nextIdx = (idx + 1) % songs.length;
      void playSong(songs[nextIdx]);
    },
    [currentSong, isShuffle, playSong, repeatMode, songs]
  );

  const playPrev = useCallback(() => {
    if (songs.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (isShuffle && shuffleHistoryRef.current.length > 0) {
      const songMap = new Map(songs.map((s) => [s.id, s]));
      while (shuffleHistoryRef.current.length > 0) {
        const prevId = shuffleHistoryRef.current.pop()!;
        const prevSong = songMap.get(prevId);
        if (prevSong && (songs.length <= 1 || prevSong.id !== currentSong?.id)) {
          if (currentSong?.id) {
            shuffleQueueRef.current = [
              currentSong.id,
              ...shuffleQueueRef.current.filter((id) => id !== currentSong.id),
            ];
          }
          skipHistoryPushRef.current = true;
          void playSong(prevSong);
          return;
        }
      }
    }
    const idx = currentSong ? songs.findIndex((s) => s.id === currentSong.id) : 0;
    const prevIdx = (idx - 1 + songs.length) % songs.length;
    void playSong(songs[prevIdx]);
  }, [currentSong, isShuffle, playSong, songs]);

  const seekTo = useCallback((seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      const order: RepeatMode[] = ['off', 'all', 'one'];
      const next = order[(order.indexOf(prev) + 1) % order.length];
      localStorage.setItem('kwp_repeat', next);
      return next;
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const next = !prev;
      localStorage.setItem('kwp_shuffle', String(next));
      return next;
    });
  }, []);

  // Wire audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let lastTick = Date.now();

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
      if (!audio.paused && currentSong) {
        const now = Date.now();
        const delta = (now - lastTick) / 1000;
        lastTick = now;
        if (delta > 0 && delta < 2) {
          listenedSecondsRef.current += delta;
        }
        const threshold = Math.min(10, Math.max(2, (audio.duration || 10) * 0.3));
        if (playTrackedForIdRef.current !== currentSong.id && listenedSecondsRef.current >= threshold) {
          void triggerPlayIncrement(currentSong);
        }
      } else {
        lastTick = Date.now();
      }
    };

    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (currentSong && onSongEnded?.(currentSong) === true) {
        setIsPlaying(false);
        return;
      }
      playNext(true);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [currentSong, onSongEnded, playNext, triggerPlayIncrement]);

  // Wire MediaSession Lock-Screen Controls
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.setActionHandler('play', () => void togglePlay());
    navigator.mediaSession.setActionHandler('pause', () => void togglePlay());
    navigator.mediaSession.setActionHandler('previoustrack', () => playPrev());
    navigator.mediaSession.setActionHandler('nexttrack', () => playNext(false));
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (typeof details.seekTime === 'number') seekTo(details.seekTime);
    });
  }, [playNext, playPrev, seekTo, togglePlay]);

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    repeatMode,
    isShuffle,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    seekTo,
    cycleRepeat,
    toggleShuffle,
  };
}

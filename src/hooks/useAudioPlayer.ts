import { useCallback, useEffect, useRef, useState } from 'react';
import type { RepeatMode, Song } from '../types';
import { incrementSongPlay, resolveAudioSource } from '../lib/supabase';

interface UseAudioPlayerOptions {
  songs: Song[];
  offlineIds?: string[];
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
  offlineIds = [],
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
  const offlineIdsRef = useRef<Set<string>>(new Set(offlineIds));
  offlineIdsRef.current = new Set(offlineIds);
  const consecutiveErrorsRef = useRef<number>(0);

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

  // Ensure singleton <audio> element exists and stays attached to document.body for mobile background playback
  useEffect(() => {
    if (!audioRef.current) {
      const audio = document.createElement('audio');
      audio.preload = 'auto';
      audio.setAttribute('playsinline', 'true');
      audio.style.display = 'none';
      document.body.appendChild(audio);
      audioRef.current = audio;
    }
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.remove();
        audioRef.current = null;
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

      playTrackedForIdRef.current = null;
      listenedSecondsRef.current = 0;

      if ('mediaSession' in navigator) {
        const svgArtwork = `data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FA243C"/><stop offset="100%" stop-color="#FF7A00"/></linearGradient></defs><rect width="512" height="512" rx="96" fill="url(#g)"/><text x="256" y="295" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="210" font-weight="800" fill="#FFFFFF">♫</text></svg>`
        )}`;
        navigator.mediaSession.metadata = new MediaMetadata({
          title: song.title,
          artist: song.is_unknown_author ? 'Белгісіз автор' : song.artist,
          album: 'Қазақша Мадақ Әндері',
          artwork: [{ src: svgArtwork, sizes: '512x512', type: 'image/svg+xml' }],
        });
      }

      const needsAsyncResolve =
        offlineIdsRef.current.has(song.id) ||
        song.id.startsWith('demo-') ||
        song.audio_url.startsWith('gdrive://');

      let src = song.audio_url;
      if (needsAsyncResolve) {
        try {
          const resolved = await resolveAudioSource(song);
          src = resolved.src;
          if (resolved.isObjectUrl) objectUrlRef.current = resolved.src;
        } catch (err) {
          console.warn('Failed to resolve offline/remote source, falling back to URL:', err);
          src = song.audio_url;
        }
      }

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

    const onLoadedMetadata = () => {
      const nextDuration = audio.duration || 0;
      setDuration(nextDuration);
      if ('mediaSession' in navigator && typeof navigator.mediaSession.setPositionState === 'function') {
        if (Number.isFinite(nextDuration) && nextDuration > 0) {
          try {
            navigator.mediaSession.setPositionState({
              duration: nextDuration,
              playbackRate: audio.playbackRate || 1,
              position: Math.min(audio.currentTime || 0, nextDuration),
            });
          } catch {
            // Ignore position state errors on unsupported browsers
          }
        }
      }
    };
    const onEnded = () => {
      if (currentSong && onSongEnded?.(currentSong) === true) {
        setIsPlaying(false);
        return;
      }
      playNext(true);
    };
    const onPlay = () => {
      setIsPlaying(true);
      consecutiveErrorsRef.current = 0;
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    };
    const onPause = () => {
      setIsPlaying(false);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    };
    const onError = () => {
      console.warn('Audio element error on track:', currentSong?.id);
      if (songs.length > 1 && consecutiveErrorsRef.current < Math.min(songs.length, 5)) {
        consecutiveErrorsRef.current += 1;
        playNext(true);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
    };
  }, [currentSong, onSongEnded, playNext, songs.length, triggerPlayIncrement]);

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

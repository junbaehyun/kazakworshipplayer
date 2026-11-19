import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  ArrowLeft,
  BookOpen,
  Check,
  Download,
  HardDrive,
  Loader2,
  Music,
  Play,
  Search,
  Settings,
  Share2,
  Shuffle,
  Trash2,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import { InstallPromptBanner } from './components/InstallPromptBanner';
import { MiniPlayer } from './components/MiniPlayer';
import { getSongGradient, SongRow } from './components/SongRow';

const AuthModal = lazy(() => import('./components/AuthModal').then((m) => ({ default: m.AuthModal })));
const BakhytKaynarView = lazy(() =>
  import('./components/BakhytKaynarView').then((m) => ({ default: m.BakhytKaynarView }))
);
const FlipCoverView = lazy(() =>
  import('./components/FlipCoverView').then((m) => ({ default: m.FlipCoverView }))
);
const FullPlayerSheet = lazy(() =>
  import('./components/FullPlayerSheet').then((m) => ({ default: m.FullPlayerSheet }))
);
const LyricsView = lazy(() => import('./components/LyricsView').then((m) => ({ default: m.LyricsView })));
const NoticeReportSheet = lazy(() =>
  import('./components/NoticeReportSheet').then((m) => ({ default: m.NoticeReportSheet }))
);
const SettingsAdminView = lazy(() =>
  import('./components/SettingsAdminView').then((m) => ({ default: m.SettingsAdminView }))
);
const UploadView = lazy(() => import('./components/UploadView').then((m) => ({ default: m.UploadView })));
import {
  BAKHYT_KAYNAR_AUDIO_MAP,
  bakhytKaynarSongs,
  type KaynarSong,
} from './data/bakhytKaynarSongs';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useWakeLock } from './hooks/useWakeLock';
import { translations } from './i18n/translations';
import {
  clearAllOfflineBlobs,
  ensureExtraSongsLoaded,
  getWeeklyChartInfo,
  listOfflineIds,
  removeOfflineBlob,
  resetWeeklyChartPlays,
} from './lib/localDb';
import { fetchAndCacheAudioBlob, fetchSongs, getAdminSession, isAdminSession, supabase } from './lib/supabase';
import type { Language, Song, TabId } from './types';

const LANGS: Language[] = ['kk', 'ko', 'en', 'ru'];
const PLAYLIST_KEY = 'kwp_playlist_ids_v1';
const LIKED_KEY = 'kwp_liked_ids_v1';
const DEV_KAYNAR_KEY = 'kwp_show_kaynar_tab';
const SHOW_KEY_FILTER_KEY = 'kwp_show_key_filter';

type ListenFilter = 'all' | 'kaynar' | 'ru' | 'playlist' | 'offline';
const GUITAR_KEYS = ['all', 'C', 'D', 'Dm', 'E', 'Em', 'F', 'G', 'A', 'Am', 'Bm', 'Bb'] as const;

const PAGE_SIZE = 80;

const KAYNAR_BY_ID = new Map<string, KaynarSong>(bakhytKaynarSongs.map((s) => [s.id, s]));
const KAYNAR_SONG_BY_AUDIO_ID = new Map<string, KaynarSong>();
for (const [kaynarId, audioSongId] of Object.entries(BAKHYT_KAYNAR_AUDIO_MAP)) {
  const kSong = KAYNAR_BY_ID.get(kaynarId);
  if (!kSong) continue;
  const existing = KAYNAR_SONG_BY_AUDIO_ID.get(audioSongId);
  if (!existing || (kSong.sections?.length ?? 0) > (existing.sections?.length ?? 0)) {
    KAYNAR_SONG_BY_AUDIO_ID.set(audioSongId, kSong);
  }
}
const KAYNAR_AUDIO_IDS = new Set<string>(Object.values(BAKHYT_KAYNAR_AUDIO_MAP));

export function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('kwp_lang') as Language | null;
    return saved && LANGS.includes(saved) ? saved : 'kk';
  });
  const [tab, setTab] = useState<TabId>('listen');
  const [search, setSearch] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlistIds, setPlaylistIds] = useState<string[]>(() => {
    try {
      const rawPl = localStorage.getItem(PLAYLIST_KEY);
      const rawLiked = localStorage.getItem(LIKED_KEY);
      const pl = rawPl ? (JSON.parse(rawPl) as unknown) : [];
      const lk = rawLiked ? (JSON.parse(rawLiked) as unknown) : [];
      const combined = [
        ...(Array.isArray(pl) ? pl.filter((x): x is string => typeof x === 'string') : []),
        ...(Array.isArray(lk) ? lk.filter((x): x is string => typeof x === 'string') : []),
      ];
      return Array.from(new Set(combined));
    } catch {
      return [];
    }
  });
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(LIKED_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
    } catch {
      return [];
    }
  });
  const [offlineIds, setOfflineIds] = useState<string[]>([]);
  const [offlineBytes, setOfflineBytes] = useState<number>(0);
  const [savingOfflineId, setSavingOfflineId] = useState<string | null>(null);
  const [batchOfflineProgress, setBatchOfflineProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const cancelBatchOfflineRef = useRef(false);
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [reportTargetSong, setReportTargetSong] = useState<Song | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [localUserEmail, setLocalUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('kwp_local_user_email');
  });
  const [guestSongDone, setGuestSongDone] = useState<boolean>(() => {
    return localStorage.getItem('kwp_guest_song_done') === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [listenFilter, setListenFilter] = useState<ListenFilter>('all');
  const [selectedKey, setSelectedKey] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [readerSongId, setReaderSongId] = useState<string | null>(null);
  const [copiedSetlist, setCopiedSetlist] = useState(false);
  const [preferredLyricsVersion, setPreferredLyricsVersion] = useState<'standard' | 'kaynar'>('standard');
  const [isCoverMode, setIsCoverMode] = useState<boolean>(false);
  const wakeLock = useWakeLock(true);
  const pendingSongRef = useRef<Song | null>(null);
  const pendingPromptOnVisibleRef = useRef(false);
  const [showKaynarTab, setShowKaynarTab] = useState<boolean>(() => {
    return localStorage.getItem(DEV_KAYNAR_KEY) === 'true';
  });
  const [showKeyFilter, setShowKeyFilter] = useState<boolean>(() => {
    return localStorage.getItem(SHOW_KEY_FILTER_KEY) === 'true';
  });
  const hasAutoLoadedRef = useRef(false);

  const isAdmin = useMemo(() => isAdminSession(session), [session]);
  const isAuthenticated = Boolean(session || localUserEmail);
  const isAuthenticatedRef = useRef(isAuthenticated);
  isAuthenticatedRef.current = isAuthenticated;

  const t = translations[lang];

  const handleSetLang = (next: Language) => {
    setLang(next);
    localStorage.setItem('kwp_lang', next);
  };

  const handleToggleKaynarTab = (next: boolean) => {
    setShowKaynarTab(next);
    localStorage.setItem(DEV_KAYNAR_KEY, String(next));
    if (!next && tab === 'kaynar') {
      setTab('listen');
    }
  };

  const handleToggleKeyFilter = (next: boolean) => {
    setShowKeyFilter(next);
    localStorage.setItem(SHOW_KEY_FILTER_KEY, String(next));
    if (!next) {
      setSelectedKey('all');
    }
  };

  const refreshOfflineStats = useCallback(async () => {
    const { ids, totalBytes } = await listOfflineIds();
    setOfflineIds(ids);
    setOfflineBytes(totalBytes);
  }, []);

  const refreshSongs = useCallback(async () => {
    const { songs: loaded } = await fetchSongs(isAdmin);
    setSongs(loaded);
  }, [isAdmin]);

  useEffect(() => {
    void getAdminSession().then(setSession);
    if (supabase) {
      const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
      });
      return () => sub.subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    void refreshSongs().then(() => {
      void ensureExtraSongsLoaded().then((extra) => {
        if (extra.length > 0) void refreshSongs();
      });
    });
    void refreshOfflineStats();
  }, [refreshSongs, refreshOfflineStats]);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const handlePlayCountUpdated = useCallback((songId: string, newCount: number) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, play_count: newCount } : s))
    );
  }, []);

  const handleTogglePlaylist = useCallback((song: Song) => {
    setPlaylistIds((prev) => {
      const next = prev.includes(song.id)
        ? prev.filter((id) => id !== song.id)
        : [song.id, ...prev];
      try {
        localStorage.setItem(PLAYLIST_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const handleToggleLike = useCallback((song: Song) => {
    setLikedIds((prev) => {
      const next = prev.includes(song.id)
        ? prev.filter((id) => id !== song.id)
        : [song.id, ...prev];
      try {
        localStorage.setItem(LIKED_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const offlineIdSet = useMemo(() => new Set(offlineIds), [offlineIds]);
  const playlistIdSet = useMemo(() => new Set(playlistIds), [playlistIds]);
  const likedIdSet = useMemo(() => new Set(likedIds), [likedIds]);

  const publishedSongs = useMemo(
    () => songs.filter((s) => s.status === 'published' && s.is_active),
    [songs]
  );

  const playlistSongs = useMemo(() => {
    const byId = new Map(publishedSongs.map((s) => [s.id, s]));
    return playlistIds.map((id) => byId.get(id)).filter((s): s is Song => Boolean(s));
  }, [publishedSongs, playlistIds]);

  const topChartSongs = useMemo(
    () => [...publishedSongs].sort((a, b) => b.play_count - a.play_count),
    [publishedSongs]
  );

  const searchTextById = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of topChartSongs) {
      const kSong = KAYNAR_SONG_BY_AUDIO_ID.get(s.id);
      const kaynarPart = kSong
        ? ` ${kSong.title.kk} ${kSong.title.ko ?? ''} ${kSong.title.koHymn ?? ''} ${kSong.title.reading ?? ''}`
        : '';
      const cleanLyrics = s.lyrics ? s.lyrics.replace(/\[[^\]]+\]/g, '') : '';
      map.set(s.id, `${s.title} ${s.artist} ${cleanLyrics}${kaynarPart}`.toLowerCase());
    }
    return map;
  }, [topChartSongs]);

  const filteredSongs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return topChartSongs;
    return topChartSongs.filter((s) => (searchTextById.get(s.id) ?? '').includes(q));
  }, [topChartSongs, searchTextById, search]);

  const kaynarPlayableCount = useMemo(
    () => topChartSongs.filter((s) => KAYNAR_AUDIO_IDS.has(s.id)).length,
    [topChartSongs]
  );

  const ruSongsCount = useMemo(
    () => topChartSongs.filter((s) => s.lang === 'ru' || s.id.startsWith('song-ru-')).length,
    [topChartSongs]
  );

  const listenSongs = useMemo(() => {
    let base: Song[];
    if (listenFilter === 'kaynar') {
      base = filteredSongs.filter((s) => KAYNAR_AUDIO_IDS.has(s.id));
    } else if (listenFilter === 'playlist') {
      const q = search.trim().toLowerCase();
      base = !q
        ? playlistSongs
        : playlistSongs.filter((s) => (searchTextById.get(s.id) ?? s.title.toLowerCase()).includes(q));
    } else if (listenFilter === 'ru') {
      base = filteredSongs.filter((s) => s.lang === 'ru' || s.id.startsWith('song-ru-'));
    } else if (listenFilter === 'offline') {
      base = filteredSongs.filter((s) => offlineIdSet.has(s.id));
    } else {
      base = filteredSongs;
    }

    if (selectedKey !== 'all') {
      return base.filter((s) => {
        const k = s.song_key ?? KAYNAR_SONG_BY_AUDIO_ID.get(s.id)?.songKey ?? '';
        return k.toLowerCase() === selectedKey.toLowerCase();
      });
    }
    return base;
  }, [filteredSongs, listenFilter, offlineIdSet, playlistSongs, search, searchTextById, selectedKey]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [listenFilter, selectedKey, search, tab]);

  const visibleListenSongs = useMemo(
    () => listenSongs.slice(0, visibleCount),
    [listenSongs, visibleCount]
  );

  const chartFilteredSongs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return topChartSongs;
    return topChartSongs.filter((s) => (searchTextById.get(s.id) ?? '').includes(q));
  }, [topChartSongs, searchTextById, search]);

  const visibleChartSongs = useMemo(
    () => chartFilteredSongs.slice(0, visibleCount),
    [chartFilteredSongs, visibleCount]
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const total = tab === 'chart' ? chartFilteredSongs.length : listenSongs.length;
    if (visibleCount >= total) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(total, prev + PAGE_SIZE));
        }
      },
      { rootMargin: '320px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [tab, chartFilteredSongs.length, listenSongs.length, visibleCount]);

  const playableListenSongs = useMemo(
    () => listenSongs.filter((s) => Boolean(s.audio_url && s.audio_url.trim())),
    [listenSongs]
  );

  const playableTopChartSongs = useMemo(
    () => topChartSongs.filter((s) => Boolean(s.audio_url && s.audio_url.trim())),
    [topChartSongs]
  );

  const libraryQueue = useMemo(
    () => (playableListenSongs.length > 0 ? playableListenSongs : playableTopChartSongs),
    [playableListenSongs, playableTopChartSongs]
  );

  const handleBeforePlay = useCallback(
    (song: Song) => {
      if (!isAuthenticatedRef.current && guestSongDone) {
        pendingSongRef.current = song;
        setIsAuthModalOpen(true);
        return false;
      }
      return true;
    },
    [guestSongDone]
  );

  const handleSongEnded = useCallback(() => {
    if (!isAuthenticatedRef.current) {
      setGuestSongDone(true);
      localStorage.setItem('kwp_guest_song_done', 'true');
      if (document.visibilityState === 'hidden') {
        pendingPromptOnVisibleRef.current = true;
        return false;
      }
      setIsAuthModalOpen(true);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        pendingPromptOnVisibleRef.current &&
        !isAuthenticatedRef.current
      ) {
        pendingPromptOnVisibleRef.current = false;
        setIsAuthModalOpen(true);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  const player = useAudioPlayer({
    songs: libraryQueue,
    offlineIds,
    onPlayCountUpdated: handlePlayCountUpdated,
    onBeforePlay: handleBeforePlay,
    onSongEnded: handleSongEnded,
  });

  const handleOpenSongLyrics = useCallback(
    (song: Song, version?: 'standard' | 'kaynar') => {
      setPreferredLyricsVersion(version ?? (listenFilter === 'kaynar' ? 'kaynar' : 'standard'));
      setReaderSongId(song.id);
    },
    [listenFilter]
  );

  const handleShareSetlistLyrics = useCallback(async () => {
    if (playlistSongs.length === 0) return;
    const text = playlistSongs
      .map((s, idx) => {
        const keyStr = s.song_key ? ` [Key: ${s.song_key}]` : '';
        const cleanBody = (s.lyrics || '').replace(/\[([A-GH][^\]]*)\]/g, '');
        return `${idx + 1}. ${s.title}${keyStr}\n${cleanBody}`;
      })
      .join('\n\n────────────────────\n\n');
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({
          title: t.myPlaylistTitle,
          text,
        });
        return;
      }
    } catch {
      // Fallback to clipboard if share cancelled or unsupported
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSetlist(true);
      window.setTimeout(() => setCopiedSetlist(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  }, [playlistSongs, t.myPlaylistTitle]);

  useEffect(() => {
    if (hasAutoLoadedRef.current || libraryQueue.length === 0 || player.currentSong) return;
    hasAutoLoadedRef.current = true;
    void player.playSong(libraryQueue[0]);
  }, [libraryQueue, player]);

  const handleToggleOffline = useCallback(
    async (song: Song) => {
      if (offlineIdSet.has(song.id)) {
        await removeOfflineBlob(song.id);
        await refreshOfflineStats();
        return;
      }

      setSavingOfflineId(song.id);
      try {
        await fetchAndCacheAudioBlob(song);
        await refreshOfflineStats();
      } catch (err) {
        console.error('Failed to save offline:', err);
      } finally {
        setSavingOfflineId(null);
      }
    },
    [offlineIdSet, refreshOfflineStats]
  );

  const handleRowPlay = useCallback(
    (song: Song) => {
      setPreferredLyricsVersion(listenFilter === 'kaynar' ? 'kaynar' : 'standard');
      void player.playSong(song);
    },
    [listenFilter, player.playSong]
  );

  const handleRowToggleOffline = useCallback(
    (song: Song) => {
      void handleToggleOffline(song);
    },
    [handleToggleOffline]
  );

  const handleRowOpenReport = useCallback((song: Song) => {
    setReportTargetSong(song);
    setNoticeOpen(true);
  }, []);

  const handleBatchSaveOffline = async (targetSongs: Song[]) => {
    if (batchOfflineProgress) {
      cancelBatchOfflineRef.current = true;
      return;
    }
    const missing = targetSongs.filter(
      (s) => Boolean(s.audio_url && s.audio_url.trim()) && !offlineIds.includes(s.id)
    );
    if (missing.length === 0) return;

    cancelBatchOfflineRef.current = false;
    setBatchOfflineProgress({ current: 0, total: missing.length });
    try {
      for (let i = 0; i < missing.length; i++) {
        if (cancelBatchOfflineRef.current) break;
        const item = missing[i];
        setBatchOfflineProgress({ current: i + 1, total: missing.length });
        setSavingOfflineId(item.id);
        try {
          await fetchAndCacheAudioBlob(item);
          await refreshOfflineStats();
        } catch (err) {
          console.warn('Batch offline skip track:', item.id, err);
        }
      }
    } finally {
      setSavingOfflineId(null);
      setBatchOfflineProgress(null);
      cancelBatchOfflineRef.current = false;
    }
  };

  const handleClearOffline = async () => {
    await clearAllOfflineBlobs();
    await refreshOfflineStats();
  };

  const handleResetWeeklyChart = () => {
    const reset = resetWeeklyChartPlays();
    setSongs(reset);
  };

  const songRankMap = useMemo(() => {
    const map = new Map<string, number>();
    topChartSongs.forEach((s, idx) => map.set(s.id, idx + 1));
    return map;
  }, [topChartSongs]);

  const offlineSongs = useMemo(
    () => filteredSongs.filter((s) => offlineIdSet.has(s.id)),
    [filteredSongs, offlineIdSet]
  );

  const weeklyResetDateLabel = useMemo(
    () => new Date(getWeeklyChartInfo().nextResetAt).toLocaleDateString(),
    []
  );

  const pageTitle =
    tab === 'listen'
      ? t.tabListen
      : tab === 'chart'
      ? t.tabChart
      : tab === 'kaynar'
      ? t.tabKaynar
      : tab === 'offline'
      ? t.tabOffline
      : tab === 'upload'
      ? t.tabUpload
      : t.settingsTitle;

  if (isCoverMode) {
    return (
      <div className="fixed inset-0 w-screen h-[100dvh] bg-white overflow-hidden">
        <Suspense fallback={null}>
          <FlipCoverView
            lang={lang}
            t={t}
            song={player.currentSong}
            kaynarSong={
              player.currentSong
                ? (KAYNAR_SONG_BY_AUDIO_ID.get(player.currentSong.id) ?? null)
                : null
            }
            defaultLyricsVersion={preferredLyricsVersion}
            isPlaying={player.isPlaying}
            currentTime={player.currentTime}
            duration={player.duration}
            repeatMode={player.repeatMode}
            isShuffle={player.isShuffle}
            allSongs={playableTopChartSongs}
            kaynarAudioIds={KAYNAR_AUDIO_IDS}
            playlistIds={playlistIds}
            wakeLockEnabled={wakeLock.enabled}
            wakeLockLocked={wakeLock.isLocked}
            onToggleWakeLock={wakeLock.toggleWakeLock}
            onExitCoverMode={() => setIsCoverMode(false)}
            onTogglePlay={() => void player.togglePlay()}
            onPrev={player.playPrev}
            onNext={() => player.playNext(false)}
            onSeek={player.seekTo}
            onCycleRepeat={player.cycleRepeat}
            onToggleShuffle={player.toggleShuffle}
            onPlaySong={(s, fromKaynar) => {
              setPreferredLyricsVersion(fromKaynar ? 'kaynar' : 'standard');
              void player.playSong(s);
            }}
            onTogglePlaylist={handleTogglePlaylist}
          />
          <AuthModal
            isOpen={isAuthModalOpen}
            t={t}
            onClose={() => setIsAuthModalOpen(false)}
            onAuthenticated={(nextSession, localEmail) => {
              isAuthenticatedRef.current = true;
              if (nextSession) {
                setSession(nextSession);
              } else if (localEmail) {
                localStorage.setItem('kwp_local_user_email', localEmail);
                setLocalUserEmail(localEmail);
              }
              setIsAuthModalOpen(false);
              const queued = pendingSongRef.current;
              pendingSongRef.current = null;
              if (queued) {
                void player.playSong(queued);
              } else {
                player.playNext(false);
              }
            }}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFEFF4] flex justify-center">
      {/* Mobile-Only Day-Theme App Shell (max-w-[430px]) */}
      <div className="w-full max-w-[430px] min-h-screen bg-white relative flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.08)]">
        {/* Sticky Frosted Header */}
        <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-xl px-5 pt-4 pb-2.5 border-b border-black/[0.05]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-[#FA243C] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                ♫
              </span>
              <span className="text-xs font-semibold tracking-tight text-[#86868B]">{t.brand}</span>
            </div>

            {/* 4-Language Segmented Control + Settings Icon */}
            <div className="flex items-center gap-1.5">
              <div className="inline-flex rounded-lg bg-[#F5F5F7] p-0.5 border border-black/[0.04]">
                {LANGS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => handleSetLang(l)}
                    className={`px-2 py-0.5 rounded-md text-xs transition ${
                      lang === l
                        ? 'bg-white text-[#1D1D1F] font-bold shadow-xs'
                        : 'text-[#86868B] font-medium'
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen((prev) => !prev)}
                aria-label={t.tabSettings}
                className={`w-7 h-7 rounded-lg flex items-center justify-center border transition ${
                  isSettingsOpen || tab === 'chart' || tab === 'offline' || tab === 'upload'
                    ? 'bg-[#FA243C] text-white border-[#FA243C]'
                    : 'bg-[#F5F5F7] text-[#1D1D1F] border-black/[0.04]'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {tab !== 'listen' && (
            <div className="flex items-baseline justify-between mt-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#1D1D1F]">{pageTitle}</h1>
            </div>
          )}
        </header>

        {/* Main Scrollable Area */}
        <main className="flex-1 px-5 pt-3 pb-40 space-y-4">
          {/* Search Bar */}
          {(tab === 'listen' || tab === 'chart' || tab === 'kaynar' || tab === 'offline') && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#86868B] absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-[#F5F5F7] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#FA243C]/25"
              />
            </div>
          )}

          {/* TAB 1: LISTEN NOW */}
          {tab === 'listen' && (
            <>
              <InstallPromptBanner t={t} />

              {/* Filter Chips (All | Бақыт қайнар | Русский | My Playlist | Offline) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {(
                  [
                    { id: 'all', label: t.filterAll, count: topChartSongs.length },
                    { id: 'kaynar', label: t.tabKaynar, count: kaynarPlayableCount },
                    { id: 'ru', label: 'Русский', count: ruSongsCount },
                    { id: 'playlist', label: t.myPlaylistTitle, count: playlistSongs.length },
                    { id: 'offline', label: t.tabOffline, count: offlineIds.length },
                  ] as const
                ).map((chip) => {
                  const active = listenFilter === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setListenFilter(chip.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition shrink-0 ${
                        active
                          ? 'bg-[#FA243C] text-white shadow-xs'
                          : 'bg-[#F5F5F7] text-[#1D1D1F] active:bg-black/10'
                      }`}
                    >
                      <span>{chip.label}</span>
                      <span
                        className={`text-[10px] font-extrabold tabular-nums ${
                          active ? 'text-white/85' : 'text-[#86868B]'
                        }`}
                      >
                        {chip.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Guitar Key Filter Bar */}
              {showKeyFilter && (
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
                  {GUITAR_KEYS.map((k) => {
                    const active = selectedKey === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setSelectedKey(k)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold whitespace-nowrap transition shrink-0 ${
                          active
                            ? 'bg-[#1D1D1F] text-white'
                            : 'bg-[#F5F5F7] text-[#515154] active:bg-black/10'
                        }`}
                      >
                        {k === 'all' ? 'Key: All' : k}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Play / Shuffle Action Bar */}
              {listenSongs.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={playableListenSongs.length === 0}
                    onClick={() => {
                      setPreferredLyricsVersion(listenFilter === 'kaynar' ? 'kaynar' : 'standard');
                      if (playableListenSongs[0]) void player.playSong(playableListenSongs[0]);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#FA243C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:opacity-85 transition disabled:opacity-40"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{t.playBtn}</span>
                  </button>
                  <button
                    type="button"
                    disabled={playableListenSongs.length === 0}
                    onClick={() => {
                      setPreferredLyricsVersion(listenFilter === 'kaynar' ? 'kaynar' : 'standard');
                      if (!player.isShuffle) player.toggleShuffle();
                      const pick =
                        playableListenSongs[
                          Math.floor(Math.random() * playableListenSongs.length)
                        ];
                      if (pick) void player.playSong(pick);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#F5F5F7] text-[#FA243C] text-xs font-bold flex items-center justify-center gap-1.5 active:bg-black/10 transition disabled:opacity-40"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>{t.shuffleBtn}</span>
                  </button>
                  {listenFilter === 'playlist' && playlistSongs.length > 0 && (
                    <button
                      type="button"
                      onClick={() => void handleShareSetlistLyrics()}
                      className="px-3 py-2.5 rounded-xl bg-[#F5F5F7] text-[#1D1D1F] text-xs font-bold flex items-center justify-center gap-1 shrink-0 active:bg-black/10 transition"
                    >
                      {copiedSetlist ? (
                        <Check className="w-3.5 h-3.5 text-[#34C759]" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5 text-[#FA243C]" />
                      )}
                      <span>
                        {copiedSetlist
                          ? t.addedAllToPlaylist
                          : lang === 'ko'
                          ? '가사 공유'
                          : 'Share'}
                      </span>
                    </button>
                  )}
                  {(listenFilter === 'playlist' || listenFilter === 'kaynar') && (() => {
                    const allOffline = listenSongs.every((s) => offlineIds.includes(s.id));
                    return (
                      <button
                        type="button"
                        onClick={() => void handleBatchSaveOffline(listenSongs)}
                        disabled={allOffline && !batchOfflineProgress}
                        title={allOffline ? t.savedOffline : t.saveOffline}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shrink-0 transition ${
                          batchOfflineProgress
                            ? 'bg-[#FA243C]/12 text-[#FA243C]'
                            : allOffline
                            ? 'bg-[#34C759]/15 text-[#34C759]'
                            : 'bg-[#F5F5F7] text-[#1D1D1F] active:bg-black/10'
                        }`}
                      >
                        {batchOfflineProgress ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>
                              {batchOfflineProgress.current}/{batchOfflineProgress.total}
                            </span>
                          </>
                        ) : allOffline ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{t.savedOffline}</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>{t.saveOffline}</span>
                          </>
                        )}
                      </button>
                    );
                  })()}
                </div>
              )}

              {/* Offline Filter Storage Summary Banner */}
              {listenFilter === 'offline' && (
                <div className="rounded-2xl bg-[#F5F5F7] p-3.5 border border-black/[0.04] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#34C759]/15 text-[#34C759] flex items-center justify-center shrink-0">
                      <HardDrive className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-extrabold text-[#1D1D1F] truncate">
                          {t.offlineReady}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                            isOnline
                              ? 'bg-[#34C759]/15 text-[#34C759]'
                              : 'bg-[#FF9500]/15 text-[#FF9500]'
                          }`}
                        >
                          {isOnline ? (
                            <Wifi className="w-2.5 h-2.5" />
                          ) : (
                            <WifiOff className="w-2.5 h-2.5" />
                          )}
                          <span>{isOnline ? 'Online' : 'Offline'}</span>
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-[#86868B]">
                        {offlineIds.length} MP3 · {(offlineBytes / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  {offlineIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => void handleClearOffline()}
                      className="px-2.5 py-1.5 rounded-xl bg-white text-[#FA243C] text-[11px] font-bold border border-black/[0.06] flex items-center gap-1 shrink-0 active:scale-95"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{t.storageClearBtn}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Filtered Songs List */}
              <section className="space-y-1">
                {listenSongs.length === 0 ? (
                  <p className="text-xs text-[#86868B] text-center py-8">
                    {listenFilter === 'playlist'
                      ? t.playlistEmpty
                      : listenFilter === 'offline'
                      ? t.offlineEmpty
                      : t.noSongsFound}
                  </p>
                ) : (
                  <>
                    <div className="divide-y divide-black/[0.06]">
                      {visibleListenSongs.map((s, idx) => (
                        <SongRow
                          key={s.id}
                          song={s}
                          rank={listenFilter === 'all' ? (songRankMap.get(s.id) ?? idx + 1) : idx + 1}
                          isCurrent={player.currentSong?.id === s.id}
                          isPlaying={player.isPlaying}
                          isOffline={offlineIdSet.has(s.id)}
                          isSavingOffline={savingOfflineId === s.id}
                          isInPlaylist={playlistIdSet.has(s.id)}
                          isKaynar={listenFilter === 'all' && KAYNAR_AUDIO_IDS.has(s.id)}
                          t={t}
                          onPlay={handleRowPlay}
                          onOpenLyrics={handleOpenSongLyrics}
                          onToggleOffline={handleRowToggleOffline}
                          onTogglePlaylist={handleTogglePlaylist}
                          isLiked={likedIdSet.has(s.id)}
                          onToggleLike={handleToggleLike}
                          onOpenReport={handleRowOpenReport}
                        />
                      ))}
                    </div>
                    {visibleCount < listenSongs.length && (
                      <div ref={loadMoreRef} className="pt-3 pb-2 flex justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            setVisibleCount((prev) => Math.min(listenSongs.length, prev + PAGE_SIZE))
                          }
                          className="px-4 py-2 rounded-full bg-[#F5F5F7] text-[#515154] text-xs font-bold active:bg-black/10 transition"
                        >
                          {visibleCount} / {listenSongs.length}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </section>
            </>
          )}

          {/* TAB 2: TOP CHART (Opened from Settings) */}
          {tab === 'chart' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTab('listen');
                    setIsSettingsOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FA243C] active:opacity-70"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.tabSettings}</span>
                </button>
                <span className="text-[11px] text-[#86868B]">
                  7d reset · {weeklyResetDateLabel}
                </span>
              </div>
              <div className="divide-y divide-black/[0.06]">
                {visibleChartSongs.map((s, idx) => (
                  <SongRow
                    key={s.id}
                    song={s}
                    rank={songRankMap.get(s.id) ?? idx + 1}
                    isCurrent={player.currentSong?.id === s.id}
                    isPlaying={player.isPlaying}
                    isOffline={offlineIdSet.has(s.id)}
                    isSavingOffline={savingOfflineId === s.id}
                    isInPlaylist={playlistIdSet.has(s.id)}
                    t={t}
                    onPlay={handleRowPlay}
                    onOpenLyrics={handleOpenSongLyrics}
                    onToggleOffline={handleRowToggleOffline}
                    onTogglePlaylist={handleTogglePlaylist}
                    isLiked={likedIdSet.has(s.id)}
                    onToggleLike={handleToggleLike}
                    onOpenReport={handleRowOpenReport}
                  />
                ))}
              </div>
              {visibleCount < chartFilteredSongs.length && (
                <div ref={loadMoreRef} className="pt-3 pb-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((prev) =>
                        Math.min(chartFilteredSongs.length, prev + PAGE_SIZE)
                      )
                    }
                    className="px-4 py-2 rounded-full bg-[#F5F5F7] text-[#515154] text-xs font-bold active:bg-black/10 transition"
                  >
                    {visibleCount} / {chartFilteredSongs.length}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2.5: БАҚЫТ ҚАЙНАР (13 SONGS + LYRIC DECK) */}
          {tab === 'kaynar' && (
            <Suspense fallback={null}>
              <BakhytKaynarView
                lang={lang}
                search={search}
                songs={publishedSongs}
                currentSong={player.currentSong}
                isPlaying={player.isPlaying}
                onPlaySong={(song) => {
                  setPreferredLyricsVersion('kaynar');
                  void player.playSong(song);
                }}
              />
            </Suspense>
          )}

          {/* TAB 3: OFFLINE & LIBRARY (Opened from Settings) */}
          {tab === 'offline' && (
            <div className="space-y-5">
              <button
                type="button"
                onClick={() => {
                  setTab('listen');
                  setIsSettingsOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FA243C] active:opacity-70"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.tabSettings}</span>
              </button>

              {/* Offline Storage Dashboard Card */}
              <div className="rounded-3xl bg-gradient-to-br from-[#F5F5F7] to-white p-4 border border-black/[0.06] shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-[#34C759]/15 text-[#34C759] flex items-center justify-center shrink-0">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-extrabold text-[#1D1D1F] truncate">
                          {t.storageCardTitle}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                            isOnline
                              ? 'bg-[#34C759]/15 text-[#34C759]'
                              : 'bg-[#FF9500]/15 text-[#FF9500]'
                          }`}
                        >
                          {isOnline ? (
                            <Wifi className="w-2.5 h-2.5" />
                          ) : (
                            <WifiOff className="w-2.5 h-2.5" />
                          )}
                          <span>{isOnline ? 'Online' : 'Offline'}</span>
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#86868B]">
                        {offlineSongs.length} MP3 · {(offlineBytes / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  {offlineIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => void handleClearOffline()}
                      className="px-3 py-1.5 rounded-xl bg-white text-[#FA243C] text-xs font-bold border border-black/[0.06] flex items-center gap-1 shrink-0 active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.storageClearBtn}</span>
                    </button>
                  )}
                </div>

                {batchOfflineProgress && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#FA243C]">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>
                          {t.saveOffline} ({batchOfflineProgress.current}/{batchOfflineProgress.total})
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          cancelBatchOfflineRef.current = true;
                        }}
                        className="text-[#86868B] underline"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-black/[0.06] overflow-hidden">
                      <div
                        className="h-full bg-[#FA243C] transition-all duration-300"
                        style={{
                          width: `${Math.round(
                            (batchOfflineProgress.current / batchOfflineProgress.total) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* My Playlist */}
              <section className="space-y-2">
                <div className="bg-[#F5F5F7] rounded-2xl p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#1D1D1F]">♥ {t.myPlaylistTitle}</span>
                    <span className="text-xs font-bold text-[#FA243C]">{playlistSongs.length}</span>
                  </div>
                  {playlistSongs.length > 0 && (() => {
                    const allPlOffline = playlistSongs.every((s) => offlineIds.includes(s.id));
                    return (
                      <button
                        type="button"
                        disabled={allPlOffline && !batchOfflineProgress}
                        onClick={() => void handleBatchSaveOffline(playlistSongs)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition ${
                          allPlOffline
                            ? 'bg-[#34C759]/15 text-[#34C759]'
                            : 'bg-white text-[#1D1D1F] border border-black/[0.06]'
                        }`}
                      >
                        {allPlOffline ? (
                          <>
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            <span>{t.savedOffline}</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3 h-3" />
                            <span>{t.saveOffline}</span>
                          </>
                        )}
                      </button>
                    );
                  })()}
                </div>
                {playlistSongs.length === 0 ? (
                  <p className="text-xs text-[#86868B] text-center py-4">{t.playlistEmpty}</p>
                ) : (
                  <div className="divide-y divide-black/[0.06]">
                    {playlistSongs.map((s) => (
                      <SongRow
                        key={`lib-pl-${s.id}`}
                        song={s}
                        isCurrent={player.currentSong?.id === s.id}
                        isPlaying={player.isPlaying}
                        isOffline={offlineIds.includes(s.id)}
                        isSavingOffline={savingOfflineId === s.id}
                        isInPlaylist={true}
                        t={t}
                        onPlay={(song) => void player.playSong(song)}
                        onOpenLyrics={(song) => handleOpenSongLyrics(song)}
                        onToggleOffline={(song) => void handleToggleOffline(song)}
                        onTogglePlaylist={handleTogglePlaylist}
                        isLiked={likedIds.includes(s.id)}
                        onToggleLike={handleToggleLike}
                        onOpenReport={(song) => {
                          setReportTargetSong(song);
                          setNoticeOpen(true);
                        }}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Offline Saved */}
              <section className="space-y-2">
                <div className="bg-[#F5F5F7] rounded-2xl p-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1D1D1F]">📥 {t.offlineReady}</span>
                  <span className="text-xs font-bold text-[#34C759]">{offlineSongs.length} MP3</span>
                </div>

                {offlineSongs.length === 0 ? (
                  <p className="text-xs text-[#86868B] text-center py-6">{t.offlineEmpty}</p>
                ) : (
                  <div className="divide-y divide-black/[0.06]">
                    {offlineSongs.map((s) => (
                      <SongRow
                        key={s.id}
                        song={s}
                        isCurrent={player.currentSong?.id === s.id}
                        isPlaying={player.isPlaying}
                        isOffline={true}
                        isSavingOffline={savingOfflineId === s.id}
                        isInPlaylist={playlistIds.includes(s.id)}
                        t={t}
                        onPlay={(song) => void player.playSong(song)}
                        onOpenLyrics={(song) => handleOpenSongLyrics(song)}
                        onToggleOffline={(song) => void handleToggleOffline(song)}
                        onTogglePlaylist={handleTogglePlaylist}
                        isLiked={likedIds.includes(s.id)}
                        onToggleLike={handleToggleLike}
                        onOpenReport={(song) => {
                          setReportTargetSong(song);
                          setNoticeOpen(true);
                        }}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* TAB 4: UPLOAD (Opened from Settings) */}
          {tab === 'upload' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setTab('listen');
                  setIsSettingsOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FA243C] active:opacity-70"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.tabSettings}</span>
              </button>
              <Suspense fallback={null}>
                <UploadView
                  t={t}
                  isAdmin={isAdmin}
                  onUploaded={(newSong) => {
                    setSongs((prev) => [newSong, ...prev]);
                    void refreshOfflineStats();
                  }}
                />
              </Suspense>
            </div>
          )}

        </main>

        {/* Floating Frosted Mini-Player */}
        <MiniPlayer
          song={player.currentSong}
          isPlaying={player.isPlaying}
          isOffline={player.currentSong ? offlineIds.includes(player.currentSong.id) : false}
          isShuffle={player.isShuffle}
          hasSongs={libraryQueue.length > 0}
          hasBottomNav={showKaynarTab}
          currentTime={player.currentTime}
          duration={player.duration}
          t={t}
          onExpand={() => setIsFullPlayerOpen(true)}
          onTogglePlay={() => void player.togglePlay()}
          onNext={() => player.playNext(false)}
          onPlayFirst={() => {
            if (libraryQueue[0]) void player.playSong(libraryQueue[0]);
          }}
          onShufflePlay={() => {
            if (!player.isShuffle) player.toggleShuffle();
            const pick = libraryQueue[Math.floor(Math.random() * libraryQueue.length)];
            if (pick) void player.playSong(pick);
          }}
          onToggleShuffle={player.toggleShuffle}
        />

        {/* Bottom Mobile Tab Bar (Shown only when Бақыт қайнар menu is enabled in Dev Settings) */}
        {showKaynarTab && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[56px] bg-white/95 backdrop-blur-xl border-t border-black/[0.06] z-30 grid grid-cols-2 px-1">
            {(
              [
                { id: 'listen', icon: Music, label: t.tabListen },
                { id: 'kaynar', icon: BookOpen, label: t.tabKaynar },
              ] as const
            ).map(({ id, icon: Icon, label }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`flex flex-col items-center justify-center gap-0.5 min-w-0 px-0.5 ${
                    active ? 'text-[#FA243C]' : 'text-[#86868B]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span
                    className={`text-[10px] leading-none truncate max-w-full ${
                      active ? 'font-bold' : 'font-medium'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Silent Full-Screen Lyrics & Chords Songbook Reader */}
        {readerSongId && (() => {
          const readerSong = publishedSongs.find((s) => s.id === readerSongId);
          if (!readerSong) return null;
          const activeList = listenSongs.some((s) => s.id === readerSong.id)
            ? listenSongs
            : topChartSongs;
          const rIdx = activeList.findIndex((s) => s.id === readerSong.id);
          const prevReaderSong =
            rIdx > 0 ? activeList[rIdx - 1] : activeList[activeList.length - 1];
          const nextReaderSong =
            rIdx >= 0 && rIdx < activeList.length - 1
              ? activeList[rIdx + 1]
              : activeList[0];
          const readerKaynar = KAYNAR_SONG_BY_AUDIO_ID.get(readerSong.id) ?? null;
          const readerAuthor = readerSong.is_unknown_author
            ? t.unknownAuthor
            : readerSong.artist;
          const readerHasAudio = Boolean(
            readerSong.audio_url && readerSong.audio_url.trim()
          );
          const isThisPlaying =
            player.currentSong?.id === readerSong.id && player.isPlaying;

          return (
            <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-gradient-to-b from-[#FFF5F6] via-white to-[#F5F5F7] flex flex-col px-3.5 pt-3 pb-4">
              <Suspense fallback={null}>
                <LyricsView
                  lyrics={readerSong.lyrics ?? ''}
                  songKey={readerSong.song_key ?? readerKaynar?.songKey ?? null}
                  capo={readerSong.capo ?? readerKaynar?.capo ?? null}
                  kaynarSong={readerKaynar}
                  lang={lang}
                  defaultVersion={preferredLyricsVersion}
                  standardLabel={t.lyricsStandard}
                  kaynarLabel={t.tabKaynar}
                  title={readerSong.title}
                  author={readerAuthor}
                  gradient={getSongGradient(readerSong.id)}
                  currentTime={
                    player.currentSong?.id === readerSong.id ? player.currentTime : 0
                  }
                  duration={
                    player.currentSong?.id === readerSong.id ? player.duration : 0
                  }
                  isPlaying={isThisPlaying}
                  lyricsLabel={t.lyricsBtn}
                  onSeek={(sec) => {
                    if (player.currentSong?.id === readerSong.id) {
                      player.seekTo(sec);
                    }
                  }}
                  onClose={() => setReaderSongId(null)}
                  hasAudio={readerHasAudio}
                  isSongAudioPlaying={isThisPlaying}
                  onToggleSongAudio={() => {
                    if (!readerHasAudio) return;
                    if (player.currentSong?.id === readerSong.id) {
                      void player.togglePlay();
                    } else {
                      void player.playSong(readerSong);
                    }
                  }}
                  isInPlaylist={playlistIdSet.has(readerSong.id)}
                  onTogglePlaylist={() => handleTogglePlaylist(readerSong)}
                  onPrevSong={
                    activeList.length > 1 && prevReaderSong
                      ? () => setReaderSongId(prevReaderSong.id)
                      : undefined
                  }
                  onNextSong={
                    activeList.length > 1 && nextReaderSong
                      ? () => setReaderSongId(nextReaderSong.id)
                      : undefined
                  }
                  songPositionLabel={
                    rIdx >= 0 ? `${rIdx + 1} / ${activeList.length}` : undefined
                  }
                />
              </Suspense>
            </div>
          );
        })()}

        {/* Slide-Up Full-Screen Now Playing Sheet */}
        {player.currentSong && isFullPlayerOpen && (
          <Suspense fallback={null}>
            <FullPlayerSheet
              isOpen={isFullPlayerOpen}
              song={player.currentSong}
              kaynarSong={KAYNAR_SONG_BY_AUDIO_ID.get(player.currentSong.id) ?? null}
              lang={lang}
              defaultLyricsVersion={preferredLyricsVersion}
              isPlaying={player.isPlaying}
              isOffline={offlineIdSet.has(player.currentSong.id)}
              isSavingOffline={savingOfflineId === player.currentSong.id}
              currentTime={player.currentTime}
              duration={player.duration}
              repeatMode={player.repeatMode}
              isShuffle={player.isShuffle}
              t={t}
              onClose={() => setIsFullPlayerOpen(false)}
              onTogglePlay={() => void player.togglePlay()}
              onPrev={player.playPrev}
              onNext={() => player.playNext(false)}
              onSeek={player.seekTo}
              onCycleRepeat={player.cycleRepeat}
              onToggleShuffle={player.toggleShuffle}
              onToggleOffline={handleRowToggleOffline}
              onOpenReport={handleRowOpenReport}
            />
          </Suspense>
        )}

        {/* Settings Drawer */}
        {isSettingsOpen && (
          <div
            className="fixed inset-0 z-40 flex justify-center bg-black/30 backdrop-blur-xs"
            onClick={() => setIsSettingsOpen(false)}
          >
            <div className="w-full max-w-[430px] h-full flex justify-end pointer-events-none">
              <aside
                className="w-[88%] max-w-[360px] h-full bg-white shadow-2xl border-l border-black/[0.06] flex flex-col pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-5 py-4 border-b border-black/[0.06] flex items-center justify-between shrink-0">
                  <h2 className="text-lg font-extrabold tracking-tight text-[#1D1D1F]">
                    {t.settingsTitle}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    aria-label="Close"
                    className="w-8 h-8 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center active:opacity-70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
                  <Suspense fallback={null}>
                    <SettingsAdminView
                      t={t}
                      session={session}
                      isAdmin={isAdmin}
                      localUserEmail={localUserEmail}
                      offlineCount={offlineIds.length}
                      offlineBytes={offlineBytes}
                      songs={songs}
                      showKaynarTab={showKaynarTab}
                      onToggleKaynarTab={handleToggleKaynarTab}
                      showKeyFilter={showKeyFilter}
                      onToggleKeyFilter={handleToggleKeyFilter}
                      onClearOffline={handleClearOffline}
                      onSessionChange={setSession}
                      onLocalSignOut={() => {
                        localStorage.removeItem('kwp_local_user_email');
                        setLocalUserEmail(null);
                      }}
                      onRefreshSongs={refreshSongs}
                      onOpenNotice={() => {
                        setReportTargetSong(null);
                        setNoticeOpen(true);
                      }}
                      onNavigateTab={(nextTab) => {
                        setTab(nextTab);
                        setIsSettingsOpen(false);
                      }}
                      onOpenFlipMode={() => {
                        setIsSettingsOpen(false);
                        setIsCoverMode(true);
                      }}
                      onResetWeeklyChart={handleResetWeeklyChart}
                    />
                  </Suspense>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* Copyright / Message Sheet */}
        {noticeOpen && (
          <Suspense fallback={null}>
            <NoticeReportSheet
              isOpen={noticeOpen}
              targetSong={reportTargetSong}
              t={t}
              onClose={() => setNoticeOpen(false)}
            />
          </Suspense>
        )}

        {/* Login Gate Modal (shown after listening 1 song) */}
        {isAuthModalOpen && (
          <Suspense fallback={null}>
            <AuthModal
              isOpen={isAuthModalOpen}
              t={t}
              onClose={() => setIsAuthModalOpen(false)}
              onAuthenticated={(nextSession, localEmail) => {
                isAuthenticatedRef.current = true;
                if (nextSession) {
                  setSession(nextSession);
                } else if (localEmail) {
                  localStorage.setItem('kwp_local_user_email', localEmail);
                  setLocalUserEmail(localEmail);
                }
                setIsAuthModalOpen(false);
                const queued = pendingSongRef.current;
                pendingSongRef.current = null;
                if (queued) {
                  void player.playSong(queued);
                } else {
                  player.playNext(false);
                }
              }}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default App;

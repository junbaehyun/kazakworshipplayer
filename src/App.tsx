import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  ArrowLeft,
  BookOpen,
  Check,
  Download,
  HardDrive,
  ListCheck,
  ListPlus,
  Loader2,
  Music,
  Play,
  Search,
  Settings,
  Shuffle,
  Smartphone,
  Trash2,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { BakhytKaynarView } from './components/BakhytKaynarView';
import { FlipCoverView } from './components/FlipCoverView';
import { FullPlayerSheet } from './components/FullPlayerSheet';
import { InstallPromptBanner } from './components/InstallPromptBanner';
import { MiniPlayer } from './components/MiniPlayer';
import { NoticeReportSheet } from './components/NoticeReportSheet';
import { SettingsAdminView } from './components/SettingsAdminView';
import { SongRow } from './components/SongRow';
import { UploadView } from './components/UploadView';
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
const DEV_KAYNAR_KEY = 'kwp_dev_show_kaynar';

type ListenFilter = 'all' | 'kaynar' | 'playlist' | 'offline';

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

function isFlipCoverViewport(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w <= 0 || h <= 0) return false;
  const ratio = w / h;
  return (h <= 560 && w <= 760) || (w <= 760 && h <= 780 && ratio >= 0.78 && ratio <= 1.35);
}

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
  const [preferredLyricsVersion, setPreferredLyricsVersion] = useState<'standard' | 'kaynar'>('standard');
  const [openLyricsSignal, setOpenLyricsSignal] = useState(0);
  const [isCoverMode, setIsCoverMode] = useState<boolean>(() => isFlipCoverViewport());
  const manualCoverExitRef = useRef(false);
  const wakeLock = useWakeLock(true);
  const pendingSongRef = useRef<Song | null>(null);
  const pendingPromptOnVisibleRef = useRef(false);
  const [showKaynarTab, setShowKaynarTab] = useState<boolean>(() => {
    return localStorage.getItem(DEV_KAYNAR_KEY) !== 'false';
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
    void refreshSongs();
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

  useEffect(() => {
    const onResize = () => {
      const isCompactSquare = isFlipCoverViewport();
      if (isCompactSquare && !manualCoverExitRef.current) {
        setIsCoverMode(true);
      } else if (!isCompactSquare) {
        manualCoverExitRef.current = false;
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
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

  const handleAddAllToPlaylist = useCallback((songsToAdd: Song[]) => {
    setPlaylistIds((prev) => {
      const existing = new Set(prev);
      const additions = songsToAdd.map((s) => s.id).filter((id) => !existing.has(id));
      if (additions.length === 0) return prev;
      const next = [...prev, ...additions];
      try {
        localStorage.setItem(PLAYLIST_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

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

  const filteredSongs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return topChartSongs;
    return topChartSongs.filter((s) => {
      const kSong = KAYNAR_SONG_BY_AUDIO_ID.get(s.id);
      const kaynarTitleMatch =
        kSong &&
        (kSong.title.kk.toLowerCase().includes(q) ||
          (kSong.title.ko && kSong.title.ko.toLowerCase().includes(q)) ||
          (kSong.title.koHymn && kSong.title.koHymn.toLowerCase().includes(q)) ||
          (kSong.title.reading && kSong.title.reading.toLowerCase().includes(q)));
      return (
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        (s.lyrics && s.lyrics.replace(/\[[^\]]+\]/g, '').toLowerCase().includes(q)) ||
        Boolean(kaynarTitleMatch)
      );
    });
  }, [topChartSongs, search]);

  const kaynarPlayableCount = useMemo(
    () => topChartSongs.filter((s) => KAYNAR_AUDIO_IDS.has(s.id)).length,
    [topChartSongs]
  );

  const listenSongs = useMemo(() => {
    if (listenFilter === 'kaynar') {
      return filteredSongs.filter((s) => KAYNAR_AUDIO_IDS.has(s.id));
    }
    if (listenFilter === 'playlist') {
      const q = search.trim().toLowerCase();
      if (!q) return playlistSongs;
      return playlistSongs.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q) ||
          (s.lyrics && s.lyrics.toLowerCase().includes(q))
      );
    }
    if (listenFilter === 'offline') {
      return filteredSongs.filter((s) => offlineIds.includes(s.id));
    }
    return filteredSongs;
  }, [filteredSongs, listenFilter, offlineIds, playlistSongs, search]);

  const libraryQueue = useMemo(
    () => (listenSongs.length > 0 ? listenSongs : topChartSongs),
    [listenSongs, topChartSongs]
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
      if (player.currentSong?.id !== song.id) {
        void player.playSong(song);
      }
      setOpenLyricsSignal((n) => n + 1);
      setIsFullPlayerOpen(true);
    },
    [listenFilter, player]
  );

  useEffect(() => {
    if (hasAutoLoadedRef.current || libraryQueue.length === 0 || player.currentSong) return;
    hasAutoLoadedRef.current = true;
    void player.playSong(libraryQueue[0]);
  }, [libraryQueue, player]);

  const handleToggleOffline = async (song: Song) => {
    if (offlineIds.includes(song.id)) {
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
  };

  const handleBatchSaveOffline = async (targetSongs: Song[]) => {
    if (batchOfflineProgress) {
      cancelBatchOfflineRef.current = true;
      return;
    }
    const missing = targetSongs.filter((s) => !offlineIds.includes(s.id));
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
    () => filteredSongs.filter((s) => offlineIds.includes(s.id)),
    [filteredSongs, offlineIds]
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
          allSongs={topChartSongs}
          kaynarAudioIds={KAYNAR_AUDIO_IDS}
          playlistIds={playlistIds}
          wakeLockEnabled={wakeLock.enabled}
          wakeLockLocked={wakeLock.isLocked}
          onToggleWakeLock={wakeLock.toggleWakeLock}
          onExitCoverMode={() => {
            manualCoverExitRef.current = true;
            setIsCoverMode(false);
          }}
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
                onClick={() => {
                  manualCoverExitRef.current = false;
                  setIsCoverMode(true);
                }}
                title="Galaxy Z Flip Cover Screen Mode"
                aria-label="Galaxy Z Flip Cover Screen Mode"
                className="px-2 h-7 rounded-lg bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.04] flex items-center gap-1 text-[11px] font-bold active:bg-black/10 transition"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#FA243C]" />
                <span>Flip</span>
              </button>
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

              {/* Filter Chips (All | Бақыт қайнар | My Playlist | Offline) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {(
                  [
                    { id: 'all', label: t.filterAll, count: topChartSongs.length },
                    { id: 'kaynar', label: t.tabKaynar, count: kaynarPlayableCount },
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

              {/* Play / Shuffle / Add All Action Bar */}
              {listenSongs.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreferredLyricsVersion(listenFilter === 'kaynar' ? 'kaynar' : 'standard');
                      if (listenSongs[0]) void player.playSong(listenSongs[0]);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#FA243C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:opacity-85 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{t.playBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreferredLyricsVersion(listenFilter === 'kaynar' ? 'kaynar' : 'standard');
                      if (!player.isShuffle) player.toggleShuffle();
                      const pick = listenSongs[Math.floor(Math.random() * listenSongs.length)];
                      if (pick) void player.playSong(pick);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#F5F5F7] text-[#FA243C] text-xs font-bold flex items-center justify-center gap-1.5 active:bg-black/10 transition"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>{t.shuffleBtn}</span>
                  </button>
                  {listenFilter !== 'playlist' && listenFilter !== 'offline' && (() => {
                    const allInPlaylist = listenSongs.every((s) => playlistIds.includes(s.id));
                    return (
                      <button
                        type="button"
                        onClick={() => handleAddAllToPlaylist(listenSongs)}
                        disabled={allInPlaylist}
                        title={allInPlaylist ? t.addedAllToPlaylist : t.addAllToPlaylist}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shrink-0 transition ${
                          allInPlaylist
                            ? 'bg-[#34C759]/15 text-[#34C759]'
                            : 'bg-[#F5F5F7] text-[#1D1D1F] active:bg-black/10'
                        }`}
                      >
                        {allInPlaylist ? (
                          <ListCheck className="w-3.5 h-3.5" />
                        ) : (
                          <ListPlus className="w-3.5 h-3.5" />
                        )}
                        <span>{allInPlaylist ? t.addedAllToPlaylist : t.addAllToPlaylist}</span>
                      </button>
                    );
                  })()}
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
                  <div className="divide-y divide-black/[0.06]">
                    {listenSongs.map((s, idx) => (
                      <SongRow
                        key={s.id}
                        song={s}
                        rank={listenFilter === 'all' ? (songRankMap.get(s.id) ?? idx + 1) : idx + 1}
                        isCurrent={player.currentSong?.id === s.id}
                        isPlaying={player.isPlaying}
                        isOffline={offlineIds.includes(s.id)}
                        isSavingOffline={savingOfflineId === s.id}
                        isInPlaylist={playlistIds.includes(s.id)}
                        isKaynar={listenFilter === 'all' && KAYNAR_AUDIO_IDS.has(s.id)}
                        t={t}
                        onPlay={(song) => {
                          setPreferredLyricsVersion(listenFilter === 'kaynar' ? 'kaynar' : 'standard');
                          void player.playSong(song);
                        }}
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
                  7d reset · {new Date(getWeeklyChartInfo().nextResetAt).toLocaleDateString()}
                </span>
              </div>
              <div className="divide-y divide-black/[0.06]">
                {topChartSongs
                  .filter((s) =>
                    search.trim()
                      ? s.title.toLowerCase().includes(search.toLowerCase())
                      : true
                  )
                  .map((s, idx) => (
                    <SongRow
                      key={s.id}
                      song={s}
                      rank={songRankMap.get(s.id) ?? idx + 1}
                      isCurrent={player.currentSong?.id === s.id}
                      isPlaying={player.isPlaying}
                      isOffline={offlineIds.includes(s.id)}
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
            </div>
          )}

          {/* TAB 2.5: БАҚЫТ ҚАЙНАР (13 SONGS + LYRIC DECK) */}
          {tab === 'kaynar' && (
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
              <UploadView
                t={t}
                isAdmin={isAdmin}
                onUploaded={(newSong) => {
                  setSongs((prev) => [newSong, ...prev]);
                  void refreshOfflineStats();
                }}
              />
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

        {/* Slide-Up Full-Screen Now Playing Sheet */}
        {player.currentSong && (
          <FullPlayerSheet
            isOpen={isFullPlayerOpen}
            song={player.currentSong}
            kaynarSong={KAYNAR_SONG_BY_AUDIO_ID.get(player.currentSong.id) ?? null}
            lang={lang}
            defaultLyricsVersion={preferredLyricsVersion}
            openLyricsSignal={openLyricsSignal}
            isPlaying={player.isPlaying}
            isOffline={offlineIds.includes(player.currentSong.id)}
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
            onToggleOffline={(song) => void handleToggleOffline(song)}
            onOpenReport={(song) => {
              setReportTargetSong(song);
              setNoticeOpen(true);
            }}
          />
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
                    onResetWeeklyChart={handleResetWeeklyChart}
                  />
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* Copyright / Message Sheet */}
        <NoticeReportSheet
          isOpen={noticeOpen}
          targetSong={reportTargetSong}
          t={t}
          onClose={() => setNoticeOpen(false)}
        />

        {/* Login Gate Modal (shown after listening 1 song) */}
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
      </div>
    </div>
  );
}

export default App;

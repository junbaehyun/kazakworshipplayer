import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  BookOpen,
  CloudUpload,
  Download,
  Info,
  Music,
  Play,
  Search,
  Settings,
  Shuffle,
  Trophy,
} from 'lucide-react';
import { BakhytKaynarView } from './components/BakhytKaynarView';
import { FullPlayerSheet } from './components/FullPlayerSheet';
import { InstallPromptBanner } from './components/InstallPromptBanner';
import { MiniPlayer } from './components/MiniPlayer';
import { NoticeReportSheet } from './components/NoticeReportSheet';
import { SettingsAdminView } from './components/SettingsAdminView';
import { SongRow } from './components/SongRow';
import { UploadView } from './components/UploadView';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { translations } from './i18n/translations';
import {
  clearAllOfflineBlobs,
  listOfflineIds,
  removeOfflineBlob,
} from './lib/localDb';
import { fetchAndCacheAudioBlob, fetchSongs, getAdminSession, supabase } from './lib/supabase';
import type { Language, Song, TabId } from './types';

const LANGS: Language[] = ['kk', 'ko', 'en', 'ru'];
const PLAYLIST_KEY = 'kwp_playlist_ids_v1';

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
      const raw = localStorage.getItem(PLAYLIST_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
    } catch {
      return [];
    }
  });
  const [offlineIds, setOfflineIds] = useState<string[]>([]);
  const [offlineBytes, setOfflineBytes] = useState<number>(0);
  const [savingOfflineId, setSavingOfflineId] = useState<string | null>(null);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [reportTargetSong, setReportTargetSong] = useState<Song | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const hasAutoLoadedRef = useRef(false);

  const t = translations[lang];

  const handleSetLang = (next: Language) => {
    setLang(next);
    localStorage.setItem('kwp_lang', next);
  };

  const refreshOfflineStats = useCallback(async () => {
    const { ids, totalBytes } = await listOfflineIds();
    setOfflineIds(ids);
    setOfflineBytes(totalBytes);
  }, []);

  const refreshSongs = useCallback(async () => {
    const { songs: loaded } = await fetchSongs(Boolean(session));
    setSongs(loaded);
  }, [session]);

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

  const publishedSongs = useMemo(
    () => songs.filter((s) => s.status === 'published' && s.is_active),
    [songs]
  );

  const playlistSongs = useMemo(() => {
    const byId = new Map(publishedSongs.map((s) => [s.id, s]));
    return playlistIds.map((id) => byId.get(id)).filter((s): s is Song => Boolean(s));
  }, [publishedSongs, playlistIds]);

  const offlineOnlySongs = useMemo(
    () => publishedSongs.filter((s) => offlineIds.includes(s.id)),
    [publishedSongs, offlineIds]
  );

  const libraryQueue = useMemo(() => {
    if (playlistSongs.length > 0) return playlistSongs;
    if (offlineOnlySongs.length > 0) return offlineOnlySongs;
    return publishedSongs;
  }, [playlistSongs, offlineOnlySongs, publishedSongs]);

  const player = useAudioPlayer({
    songs: libraryQueue,
    onPlayCountUpdated: handlePlayCountUpdated,
  });

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

  const handleClearOffline = async () => {
    await clearAllOfflineBlobs();
    await refreshOfflineStats();
  };

  const filteredSongs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return publishedSongs;
    return publishedSongs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        (s.lyrics && s.lyrics.toLowerCase().includes(q))
    );
  }, [publishedSongs, search]);

  const topChartSongs = useMemo(
    () => [...publishedSongs].sort((a, b) => b.play_count - a.play_count),
    [publishedSongs]
  );

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

            {/* 4-Language Segmented Control: KK | KO | EN | RU */}
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
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1D1D1F]">{pageTitle}</h1>
            <button
              type="button"
              onClick={() => {
                setReportTargetSong(null);
                setNoticeOpen(true);
              }}
              className="text-xs font-semibold text-[#FA243C] flex items-center gap-1 active:opacity-70"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{t.noticeBtn}</span>
            </button>
          </div>
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
              {libraryQueue.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => void player.playSong(libraryQueue[0])}
                    className="py-2.5 rounded-xl bg-[#F5F5F7] active:bg-black/10 text-[#FA243C] font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-[#FA243C]" />
                    <span>{t.playBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!player.isShuffle) player.toggleShuffle();
                      const pick = libraryQueue[Math.floor(Math.random() * libraryQueue.length)];
                      if (pick) void player.playSong(pick);
                    }}
                    className="py-2.5 rounded-xl bg-[#F5F5F7] active:bg-black/10 text-[#FA243C] font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>{t.shuffleBtn}</span>
                  </button>
                </div>
              )}

              {/* My Playlist Section */}
              {!search.trim() && playlistSongs.length > 0 && (
                <section className="space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-sm font-extrabold tracking-tight text-[#1D1D1F]">
                      {t.myPlaylistTitle}
                    </h2>
                    <span className="text-xs font-bold text-[#FA243C]">
                      {playlistSongs.length}
                    </span>
                  </div>
                  <div className="divide-y divide-black/[0.06]">
                    {playlistSongs.map((s) => (
                      <SongRow
                        key={`pl-${s.id}`}
                        song={s}
                        isCurrent={player.currentSong?.id === s.id}
                        isPlaying={player.isPlaying}
                        isOffline={offlineIds.includes(s.id)}
                        isSavingOffline={savingOfflineId === s.id}
                        isInPlaylist={true}
                        t={t}
                        onPlay={(song) => void player.playSong(song)}
                        onToggleOffline={(song) => void handleToggleOffline(song)}
                        onTogglePlaylist={handleTogglePlaylist}
                        onOpenReport={(song) => {
                          setReportTargetSong(song);
                          setNoticeOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* All Songs List */}
              <section className="space-y-1">
                <h2 className="text-sm font-extrabold tracking-tight text-[#1D1D1F] mb-1">
                  {t.allSongsTitle}
                </h2>
                {filteredSongs.length === 0 ? (
                  <p className="text-xs text-[#86868B] text-center py-8">{t.noSongsFound}</p>
                ) : (
                  <div className="divide-y divide-black/[0.06]">
                    {filteredSongs.map((s) => (
                      <SongRow
                        key={s.id}
                        song={s}
                        isCurrent={player.currentSong?.id === s.id}
                        isPlaying={player.isPlaying}
                        isOffline={offlineIds.includes(s.id)}
                        isSavingOffline={savingOfflineId === s.id}
                        isInPlaylist={playlistIds.includes(s.id)}
                        t={t}
                        onPlay={(song) => void player.playSong(song)}
                        onToggleOffline={(song) => void handleToggleOffline(song)}
                        onTogglePlaylist={handleTogglePlaylist}
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

          {/* TAB 2: TOP CHART */}
          {tab === 'chart' && (
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
                    rank={idx + 1}
                    isCurrent={player.currentSong?.id === s.id}
                    isPlaying={player.isPlaying}
                    isOffline={offlineIds.includes(s.id)}
                    isSavingOffline={savingOfflineId === s.id}
                    isInPlaylist={playlistIds.includes(s.id)}
                    t={t}
                    onPlay={(song) => void player.playSong(song)}
                    onToggleOffline={(song) => void handleToggleOffline(song)}
                    onTogglePlaylist={handleTogglePlaylist}
                    onOpenReport={(song) => {
                      setReportTargetSong(song);
                      setNoticeOpen(true);
                    }}
                  />
                ))}
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
              onPlaySong={(song) => void player.playSong(song)}
            />
          )}

          {/* TAB 3: OFFLINE & LIBRARY */}
          {tab === 'offline' && (
            <div className="space-y-5">
              {/* My Playlist */}
              <section className="space-y-2">
                <div className="bg-[#F5F5F7] rounded-2xl p-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1D1D1F]">🎵 {t.myPlaylistTitle}</span>
                  <span className="text-xs font-bold text-[#FA243C]">{playlistSongs.length}</span>
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
                        onToggleOffline={(song) => void handleToggleOffline(song)}
                        onTogglePlaylist={handleTogglePlaylist}
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
                        onToggleOffline={(song) => void handleToggleOffline(song)}
                        onTogglePlaylist={handleTogglePlaylist}
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

          {/* TAB 4: UPLOAD */}
          {tab === 'upload' && (
            <UploadView
              t={t}
              isAdmin={Boolean(session)}
              onUploaded={(newSong) => {
                setSongs((prev) => [newSong, ...prev]);
                void refreshOfflineStats();
              }}
            />
          )}

          {/* TAB 5: SETTINGS & ADMIN */}
          {tab === 'settings' && (
            <SettingsAdminView
              t={t}
              session={session}
              offlineCount={offlineIds.length}
              offlineBytes={offlineBytes}
              songs={songs}
              onClearOffline={handleClearOffline}
              onSessionChange={setSession}
              onRefreshSongs={refreshSongs}
              onOpenNotice={() => {
                setReportTargetSong(null);
                setNoticeOpen(true);
              }}
            />
          )}
        </main>

        {/* Floating Frosted Mini-Player */}
        {player.currentSong && (
          <MiniPlayer
            song={player.currentSong}
            isPlaying={player.isPlaying}
            isOffline={offlineIds.includes(player.currentSong.id)}
            currentTime={player.currentTime}
            duration={player.duration}
            t={t}
            onExpand={() => setIsFullPlayerOpen(true)}
            onTogglePlay={() => void player.togglePlay()}
            onNext={() => player.playNext(false)}
          />
        )}

        {/* Bottom Mobile Tab Bar */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[56px] bg-white/95 backdrop-blur-xl border-t border-black/[0.06] z-30 grid grid-cols-6 px-0.5">
          {(
            [
              { id: 'listen', icon: Music, label: t.tabListen },
              { id: 'chart', icon: Trophy, label: t.tabChart },
              { id: 'kaynar', icon: BookOpen, label: t.tabKaynar },
              { id: 'offline', icon: Download, label: t.tabOffline },
              { id: 'upload', icon: CloudUpload, label: t.tabUpload },
              { id: 'settings', icon: Settings, label: t.tabSettings },
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

        {/* Slide-Up Full-Screen Now Playing Sheet */}
        {player.currentSong && (
          <FullPlayerSheet
            isOpen={isFullPlayerOpen}
            song={player.currentSong}
            isPlaying={player.isPlaying}
            isOffline={offlineIds.includes(player.currentSong.id)}
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

        {/* Copyright / Message Sheet */}
        <NoticeReportSheet
          isOpen={noticeOpen}
          targetSong={reportTargetSong}
          t={t}
          onClose={() => setNoticeOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;

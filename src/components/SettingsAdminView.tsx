import { useEffect, useState, type FormEvent } from 'react';
import { Check, ChevronRight, CloudUpload, Download, HardDrive, LogOut, Mail, RotateCcw, ShieldCheck, Trash2, Trophy } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import type { TranslationStrings } from '../i18n/translations';
import {
  adminApproveSong,
  adminDeleteSong,
  adminFetchReports,
  adminResolveReport,
  signInAdmin,
  signOutAdmin,
} from '../lib/supabase';
import { getWeeklyChartInfo } from '../lib/localDb';
import type { Song, SongReport } from '../types';

interface SettingsAdminViewProps {
  t: TranslationStrings;
  session: Session | null;
  offlineCount: number;
  offlineBytes: number;
  songs: Song[];
  onClearOffline: () => Promise<void>;
  onSessionChange: (session: Session | null) => void;
  onRefreshSongs: () => Promise<void>;
  onOpenNotice: () => void;
  onNavigateTab: (tab: 'chart' | 'offline' | 'upload') => void;
  onResetWeeklyChart: () => void;
}

export function SettingsAdminView({
  t,
  session,
  offlineCount,
  offlineBytes,
  songs,
  onClearOffline,
  onSessionChange,
  onRefreshSongs,
  onOpenNotice,
  onNavigateTab,
  onResetWeeklyChart,
}: SettingsAdminViewProps) {
  const [email, setEmail] = useState('junbaehyun.kz@gmail.com');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [reports, setReports] = useState<SongReport[]>([]);

  useEffect(() => {
    if (session) {
      void adminFetchReports().then(setReports);
    }
  }, [session]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(null);
    const { session: newSession, error } = await signInAdmin(email.trim(), password);
    setIsLoggingIn(false);
    if (error) {
      setAuthError(error);
    } else {
      onSessionChange(newSession);
      setPassword('');
    }
  };

  const handleLogout = async () => {
    await signOutAdmin();
    onSessionChange(null);
    setReports([]);
  };

  const pendingSongs = songs.filter((s) => s.status === 'pending');
  const sizeMb = (offlineBytes / (1024 * 1024)).toFixed(1);
  const { nextResetAt } = getWeeklyChartInfo();
  const nextResetLabel = new Date(nextResetAt).toLocaleDateString();

  return (
    <div className="space-y-4">
      {/* Navigation Shortcuts (Chart, Offline Library, Upload) */}
      <div className="bg-[#F5F5F7] rounded-2xl divide-y divide-black/[0.06] overflow-hidden">
        <button
          type="button"
          onClick={() => onNavigateTab('chart')}
          className="w-full px-4 py-3 flex items-center justify-between text-left active:bg-black/5 transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-[#FA243C]/12 text-[#FA243C] flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1D1D1F]">{t.tabChart}</p>
              <p className="text-[11px] text-[#86868B] truncate">7d reset · {nextResetLabel}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#86868B] shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('offline')}
          className="w-full px-4 py-3 flex items-center justify-between text-left active:bg-black/5 transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-[#34C759]/12 text-[#34C759] flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1D1D1F]">{t.tabOffline}</p>
              <p className="text-[11px] text-[#86868B]">{offlineCount} MP3 · {sizeMb} MB</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#86868B] shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('upload')}
          className="w-full px-4 py-3 flex items-center justify-between text-left active:bg-black/5 transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-[#007AFF]/12 text-[#007AFF] flex items-center justify-center shrink-0">
              <CloudUpload className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1D1D1F]">{t.tabUpload}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#86868B] shrink-0" />
        </button>
      </div>

      {/* Weekly Chart Reset Control */}
      <div className="bg-[#F5F5F7] rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#1D1D1F]">{t.tabChart} (7d)</p>
          <p className="text-[11px] text-[#86868B]">Next auto-refresh: {nextResetLabel}</p>
        </div>
        <button
          type="button"
          onClick={onResetWeeklyChart}
          className="px-3 py-1.5 rounded-xl bg-white border border-black/[0.06] text-xs font-semibold text-[#FA243C] flex items-center gap-1.5 shrink-0 active:bg-black/5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Copyright & Contact Card */}
      <div className="bg-[#FFF8F6] border border-[#FA243C]/15 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#FA243C]">{t.bannerTitle}</h3>
          <button
            type="button"
            onClick={onOpenNotice}
            className="text-xs font-bold text-[#FA243C] underline"
          >
            {t.reportSubmitBtn}
          </button>
        </div>
        <p className="text-xs text-[#515154] leading-relaxed">{t.noticeModalBody}</p>
        <p className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5 pt-1">
          <Mail className="w-3.5 h-3.5 text-[#FA243C]" />
          <span>{t.contactEmailLabel}</span>
          <a href="mailto:junbaehyun.kz@gmail.com" className="text-[#FA243C] underline">
            junbaehyun.kz@gmail.com
          </a>
        </p>
      </div>

      {/* Offline Storage Card */}
      <div className="bg-[#F5F5F7] rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#34C759]" />
            <span className="text-xs font-bold text-[#1D1D1F]">{t.storageCardTitle}</span>
          </div>
          <span className="text-xs font-mono text-[#86868B]">
            {offlineCount} MP3 · {sizeMb} MB
          </span>
        </div>

        {offlineCount > 0 && (
          <button
            type="button"
            onClick={() => void onClearOffline()}
            className="w-full py-2 rounded-xl bg-white border border-black/[0.06] text-xs font-semibold text-[#FA243C] active:bg-black/5"
          >
            {t.storageClearBtn}
          </button>
        )}
      </div>

      {/* Admin Login / Admin Panel */}
      <div className="bg-[#F5F5F7] rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#1D1D1F] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#FA243C]" />
            <span>{t.adminSectionTitle}</span>
          </h3>
          {session && (
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="text-xs font-semibold text-[#FA243C] flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.adminLogoutBtn}</span>
            </button>
          )}
        </div>

        {!session ? (
          <form onSubmit={handleLogin} className="space-y-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.adminEmailPlaceholder}
              className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs border border-black/[0.06] focus:outline-none"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.adminPasswordPlaceholder}
              className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs border border-black/[0.06] focus:outline-none"
            />
            {authError && <p className="text-xs text-[#FA243C] font-medium">{authError}</p>}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-xl bg-[#1D1D1F] text-white text-xs font-bold active:opacity-85 transition"
            >
              {isLoggingIn ? '...' : t.adminLoginBtn}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-[#34C759] font-semibold">
              ✓ {t.adminLoggedInAs} {session.user.email}
            </p>

            {/* Pending Songs (if any) */}
            {pendingSongs.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#1D1D1F]">{t.adminPendingTitle}</h4>
                {pendingSongs.map((s) => (
                  <div key={s.id} className="bg-white rounded-xl p-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold truncate">{s.title}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={async () => {
                          await adminApproveSong(s.id);
                          await onRefreshSongs();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#34C759] text-white text-xs font-bold"
                      >
                        {t.adminApproveBtn}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await adminDeleteSong(s.id);
                          await onRefreshSongs();
                        }}
                        className="p-1.5 rounded-lg bg-[#FA243C]/10 text-[#FA243C]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* All Published Songs Quick Delete */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#1D1D1F]">{t.allSongsTitle} ({songs.length})</h4>
              <div className="max-h-40 overflow-y-auto space-y-1.5">
                {songs.map((s) => (
                  <div key={s.id} className="bg-white rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium truncate">{s.title}</span>
                    <button
                      type="button"
                      onClick={async () => {
                        await adminDeleteSong(s.id);
                        await onRefreshSongs();
                      }}
                      className="text-xs text-[#FA243C] font-semibold flex items-center gap-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.adminDeleteBtn}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reports & Messages Inbox */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#1D1D1F]">
                {t.adminInboxTitle} ({reports.length})
              </h4>
              {reports.length === 0 ? (
                <p className="text-xs text-[#86868B]">—</p>
              ) : (
                <div className="space-y-2">
                  {reports.map((rep) => (
                    <div key={rep.id} className="bg-white rounded-xl p-3 space-y-1.5 border border-black/[0.04]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#FA243C] truncate">{rep.song_title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[#86868B]">
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#1D1D1F]">{rep.message}</p>
                      <div className="flex items-center justify-between text-xs text-[#86868B]">
                        <span>{rep.reporter_contact}</span>
                        {rep.status !== 'resolved' && (
                          <button
                            type="button"
                            onClick={async () => {
                              await adminResolveReport(rep.id);
                              setReports(await adminFetchReports());
                            }}
                            className="text-[#34C759] font-bold flex items-center gap-0.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t.adminResolveBtn}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

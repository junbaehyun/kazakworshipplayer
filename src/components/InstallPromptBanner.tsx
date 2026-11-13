import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import type { TranslationStrings } from '../i18n/translations';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'kwp_install_dismissed_v1';

function isRunningStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    nav.standalone === true
  );
}

function isIosSafari(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return isIos && isSafari;
}

export function InstallPromptBanner({ t }: { t: TranslationStrings }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (dismissed || isRunningStandalone()) return;

    if (isIosSafari()) {
      setShowIosGuide(true);
      return;
    }

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setDismissed(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, [dismissed]);

  if (dismissed || isRunningStandalone() || (!deferredPrompt && !showIosGuide)) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Ignore storage errors
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setDismissed(true);
    }
  };

  return (
    <div className="bg-[#F5F5F7] border border-black/[0.06] rounded-2xl p-3 flex items-center justify-between gap-2.5">
      <div className="flex items-center gap-2.5 min-w-0">
        <img
          src="/icon-192.png"
          alt={t.brand}
          className="w-10 h-10 rounded-xl shrink-0 shadow-sm"
        />
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#1D1D1F] truncate">{t.installTitle}</p>
          <p className="text-[11px] text-[#515154] leading-snug">
            {showIosGuide ? t.installIosHint : t.installSub}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {deferredPrompt ? (
          <button
            type="button"
            onClick={() => void handleInstall()}
            className="px-3 py-1.5 rounded-full bg-[#FA243C] text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.installBtn}</span>
          </button>
        ) : (
          <span className="p-1.5 rounded-full bg-[#FA243C]/10 text-[#FA243C]">
            <Share className="w-3.5 h-3.5" />
          </span>
        )}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          className="p-1 text-[#86868B] hover:text-[#1D1D1F]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

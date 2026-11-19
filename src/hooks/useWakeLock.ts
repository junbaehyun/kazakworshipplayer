import { useCallback, useEffect, useRef, useState } from 'react';

interface WakeLockSentinelLike {
  released: boolean;
  release: () => Promise<void>;
  addEventListener: (type: 'release', listener: () => void) => void;
}

export function useWakeLock(defaultEnabled = true) {
  const [enabled, setEnabled] = useState<boolean>(defaultEnabled);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const sentinelRef = useRef<WakeLockSentinelLike | null>(null);
  const enabledRef = useRef<boolean>(enabled);
  enabledRef.current = enabled;

  const isSupported =
    typeof navigator !== 'undefined' &&
    'wakeLock' in navigator &&
    typeof (navigator as Navigator & { wakeLock?: { request?: unknown } }).wakeLock?.request ===
      'function';

  const requestWakeLock = useCallback(async () => {
    if (!isSupported || !enabledRef.current) return;
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
    if (sentinelRef.current && !sentinelRef.current.released) {
      setIsLocked(true);
      return;
    }
    try {
      const nav = navigator as Navigator & {
        wakeLock: { request: (type: 'screen') => Promise<WakeLockSentinelLike> };
      };
      const sentinel = await nav.wakeLock.request('screen');
      sentinelRef.current = sentinel;
      setIsLocked(true);
      sentinel.addEventListener('release', () => {
        if (sentinelRef.current === sentinel) {
          sentinelRef.current = null;
          setIsLocked(false);
        }
      });
    } catch {
      setIsLocked(false);
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    const current = sentinelRef.current;
    sentinelRef.current = null;
    setIsLocked(false);
    if (current && !current.released) {
      try {
        await current.release();
      } catch {
        // Ignore release errors
      }
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      void requestWakeLock();
    } else {
      void releaseWakeLock();
    }
  }, [enabled, releaseWakeLock, requestWakeLock]);

  useEffect(() => {
    if (!isSupported) return;
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabledRef.current) {
        void requestWakeLock();
      }
    };
    const onUserInteraction = () => {
      if (enabledRef.current && (!sentinelRef.current || sentinelRef.current.released)) {
        void requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pointerdown', onUserInteraction, { passive: true });
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pointerdown', onUserInteraction);
    };
  }, [isSupported, requestWakeLock]);

  useEffect(() => {
    return () => {
      void releaseWakeLock();
    };
  }, [releaseWakeLock]);

  const toggleWakeLock = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  return {
    isSupported,
    enabled,
    isLocked,
    setEnabled,
    toggleWakeLock,
  };
}

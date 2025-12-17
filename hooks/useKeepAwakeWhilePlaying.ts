import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

/**
 * Keeps the screen awake while `isPlaying` is true.
 * - Native (iOS/Android): uses `expo-keep-awake`.
 * - Web: uses the Screen Wake Lock API when available.
 */
export function useKeepAwakeWhilePlaying(isPlaying: boolean) {
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    let canceled = false;

    async function acquireWakeLockWeb() {
      try {
        // @ts-expect-error: Wake Lock API may not be typed in TS lib
        if (navigator?.wakeLock?.request) {
          const lock = await navigator.wakeLock.request('screen');
          if (!canceled) {
            wakeLockRef.current = lock;
            // Re-acquire if the lock is released (e.g., visibility changes)
            lock.addEventListener?.('release', () => {
              if (!document.hidden && isPlaying) {
                acquireWakeLockWeb();
              }
            });
          }
        }
      } catch {
        // Silently ignore if wake lock cannot be acquired
      }
    }

    async function releaseWakeLockWeb() {
      try {
        if (wakeLockRef.current) {
          await wakeLockRef.current.release?.();
          wakeLockRef.current = null;
        }
      } catch {
        wakeLockRef.current = null;
      }
    }

    if (isPlaying) {
      if (Platform.OS === 'web') {
        acquireWakeLockWeb();
      } else {
        activateKeepAwake('metronome');
      }
    } else {
      if (Platform.OS === 'web') {
        releaseWakeLockWeb();
      } else {
        deactivateKeepAwake('metronome');
      }
    }

    return () => {
      canceled = true;
      if (Platform.OS === 'web') {
        releaseWakeLockWeb();
      } else {
        deactivateKeepAwake('metronome');
      }
    };
  }, [isPlaying]);

  // Re-acquire on visibility change for web if playing
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const onVisibilityChange = () => {
      if (!document.hidden && isPlaying) {
        // Attempt to re-acquire when tab becomes visible
        // @ts-expect-error: Wake Lock API may not be typed
        navigator?.wakeLock
          ?.request?.('screen')
          .then((lock: any) => {
            wakeLockRef.current = lock;
          })
          .catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [isPlaying]);
}

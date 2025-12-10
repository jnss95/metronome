import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = '@metronome_settings';
const DEBOUNCE_MS = 500;

export interface PersistedSettings {
  bpm: number;
  timeSignature: {
    beats: number;
    noteValue: number;
  };
  subdivision: 'none' | 'eighth' | 'triplet' | 'sixteenth';
  volume: number;
}

const DEFAULT_SETTINGS: PersistedSettings = {
  bpm: 120,
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: 'none',
  volume: 0.7,
};

export function useSettingsPersistence() {
  const [settings, setSettings] = useState<PersistedSettings | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as PersistedSettings;
          // Validate and merge with defaults to handle missing fields
          setSettings({
            ...DEFAULT_SETTINGS,
            ...parsed,
            timeSignature: {
              ...DEFAULT_SETTINGS.timeSignature,
              ...parsed.timeSignature,
            },
          });
        } else {
          setSettings(DEFAULT_SETTINGS);
        }
      } catch (error) {
        console.warn('Failed to load settings:', error);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  // Save settings to storage (debounced)
  const saveSettings = useCallback((newSettings: PersistedSettings) => {
    // Clear any pending save
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the save to avoid excessive writes
    debounceTimerRef.current = setTimeout(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      } catch (error) {
        console.warn('Failed to save settings:', error);
      }
    }, DEBOUNCE_MS);
  }, []);

  // Update a single setting
  const updateSettings = useCallback(
    (updates: Partial<PersistedSettings>) => {
      setSettings(prev => {
        if (!prev) return prev;
        const newSettings = { ...prev, ...updates };
        saveSettings(newSettings);
        return newSettings;
      });
    },
    [saveSettings]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    settings: settings ?? DEFAULT_SETTINGS,
    isLoaded,
    updateSettings,
    defaultSettings: DEFAULT_SETTINGS,
  };
}

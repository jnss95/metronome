import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAudioEngine } from './useAudioEngine';

export type TimeSignature = {
  beats: number;
  noteValue: number;
};

export type SubdivisionType = 'none' | 'eighth' | 'triplet' | 'sixteenth';

export interface MetronomeState {
  bpm: number;
  timeSignature: TimeSignature;
  subdivision: SubdivisionType;
  isPlaying: boolean;
  currentBeat: number; // 0-indexed
  currentSubdivision: number; // 0-indexed within the beat
  volume: number;
}

export interface MetronomeSettings {
  bpm: number;
  timeSignature: TimeSignature;
  subdivision: SubdivisionType;
  volume: number;
}

// Subdivision multipliers
const SUBDIVISION_COUNTS: Record<SubdivisionType, number> = {
  none: 1,
  eighth: 2,
  triplet: 3,
  sixteenth: 4,
};

// Common time signature presets
export const TIME_SIGNATURE_PRESETS: TimeSignature[] = [
  { beats: 2, noteValue: 4 },
  { beats: 3, noteValue: 4 },
  { beats: 4, noteValue: 4 },
  { beats: 5, noteValue: 4 },
  { beats: 6, noteValue: 8 },
  { beats: 7, noteValue: 8 },
];

const MIN_BPM = 20;
const MAX_BPM = 300;

interface UseMetronomeOptions {
  initialBpm?: number;
  initialTimeSignature?: TimeSignature;
  initialSubdivision?: SubdivisionType;
  initialVolume?: number;
  onSettingsChange?: (settings: MetronomeSettings) => void;
}

export function useMetronome(options: UseMetronomeOptions = {}) {
  const {
    initialBpm = 120,
    initialTimeSignature = { beats: 4, noteValue: 4 },
    initialSubdivision = 'none',
    initialVolume = 0.7,
    onSettingsChange,
  } = options;

  // State
  const [bpm, setBpmState] = useState(initialBpm);
  const [timeSignature, setTimeSignatureState] =
    useState<TimeSignature>(initialTimeSignature);
  const [subdivision, setSubdivisionState] =
    useState<SubdivisionType>(initialSubdivision);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentSubdivision, setCurrentSubdivision] = useState(0);
  const [volume, setVolumeState] = useState(initialVolume);

  // Ref for onSettingsChange to avoid stale closures
  const onSettingsChangeRef = useRef(onSettingsChange);
  useEffect(() => {
    onSettingsChangeRef.current = onSettingsChange;
  }, [onSettingsChange]);

  // Wrapped setters that also trigger persistence
  const setTimeSignature = useCallback((ts: TimeSignature) => {
    setTimeSignatureState(ts);
  }, []);

  const setSubdivision = useCallback((sub: SubdivisionType) => {
    setSubdivisionState(sub);
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
  }, []);

  // Notify parent when settings change
  useEffect(() => {
    onSettingsChangeRef.current?.({
      bpm,
      timeSignature,
      subdivision,
      volume,
    });
  }, [bpm, timeSignature, subdivision, volume]);

  // Audio engine
  const audioEngine = useAudioEngine({ volume });

  // Refs for timing
  const nextNoteTimeRef = useRef(0);
  const schedulerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);

  // Keep refs in sync with state
  const bpmRef = useRef(bpm);
  const timeSignatureRef = useRef(timeSignature);
  const subdivisionRef = useRef(subdivision);
  const currentBeatRef = useRef(0);
  const currentSubdivisionRef = useRef(0);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    timeSignatureRef.current = timeSignature;
  }, [timeSignature]);

  useEffect(() => {
    subdivisionRef.current = subdivision;
  }, [subdivision]);

  // Calculate interval between subdivisions in seconds
  const getSubdivisionInterval = useCallback(() => {
    const subdivisionCount = SUBDIVISION_COUNTS[subdivisionRef.current];
    const beatInterval = 60 / bpmRef.current;
    return beatInterval / subdivisionCount;
  }, []);

  // Schedule upcoming notes
  const scheduler = useCallback(() => {
    if (!isPlayingRef.current) return;

    const currentTime = audioEngine.getCurrentTime();
    const scheduleAheadTime = 0.1; // Schedule 100ms ahead
    const subdivisionCount = SUBDIVISION_COUNTS[subdivisionRef.current];

    while (nextNoteTimeRef.current < currentTime + scheduleAheadTime) {
      // Determine sound type
      let soundType: 'downbeat' | 'beat' | 'subdivision';
      if (currentBeatRef.current === 0 && currentSubdivisionRef.current === 0) {
        soundType = 'downbeat';
      } else if (currentSubdivisionRef.current === 0) {
        soundType = 'beat';
      } else {
        soundType = 'subdivision';
      }

      // Schedule the sound
      audioEngine.scheduleClick(soundType, nextNoteTimeRef.current);

      // Add haptic feedback on mobile for main beats
      if (Platform.OS !== 'web' && currentSubdivisionRef.current === 0) {
        // Use different haptic intensities for different beat types
        if (currentBeatRef.current === 0) {
          // Downbeat - stronger haptic
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else {
          // Regular beat - lighter haptic
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }

      // Update visual state
      const beatToSet = currentBeatRef.current;
      const subToSet = currentSubdivisionRef.current;
      setCurrentBeat(beatToSet);
      setCurrentSubdivision(subToSet);

      // Advance to next subdivision
      currentSubdivisionRef.current++;
      if (currentSubdivisionRef.current >= subdivisionCount) {
        currentSubdivisionRef.current = 0;
        currentBeatRef.current++;
        if (currentBeatRef.current >= timeSignatureRef.current.beats) {
          currentBeatRef.current = 0;
        }
      }

      // Calculate next note time
      nextNoteTimeRef.current += getSubdivisionInterval();
    }

    // Schedule next check
    schedulerTimerRef.current = setTimeout(scheduler, 25);
  }, [audioEngine, getSubdivisionInterval]);

  // Start playback
  const start = useCallback(() => {
    if (isPlayingRef.current) return;

    // Resume audio context (needed for browser autoplay policy)
    audioEngine.resume();

    isPlayingRef.current = true;
    setIsPlaying(true);

    // Reset position
    currentBeatRef.current = 0;
    currentSubdivisionRef.current = 0;
    setCurrentBeat(0);
    setCurrentSubdivision(0);

    // Start scheduling
    nextNoteTimeRef.current = audioEngine.getCurrentTime() + 0.05;
    scheduler();
  }, [audioEngine, scheduler]);

  // Stop playback
  const stop = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);

    if (schedulerTimerRef.current) {
      clearTimeout(schedulerTimerRef.current);
      schedulerTimerRef.current = null;
    }

    // Reset position
    setCurrentBeat(0);
    setCurrentSubdivision(0);
  }, []);

  // Toggle playback
  const toggle = useCallback(() => {
    if (isPlayingRef.current) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);

  // Set BPM with clamping
  const setBpm = useCallback((newBpm: number) => {
    const clampedBpm = Math.max(MIN_BPM, Math.min(MAX_BPM, Math.round(newBpm)));
    setBpmState(clampedBpm);
  }, []);

  // Increment/decrement BPM
  const incrementBpm = useCallback(
    (amount: number = 1) => {
      setBpm(bpm + amount);
    },
    [bpm, setBpm]
  );

  // Tap tempo
  const tapTimesRef = useRef<number[]>([]);
  const lastTapRef = useRef(0);

  const tapTempo = useCallback(() => {
    const now = Date.now();
    const tapTimeout = 2000; // Reset if more than 2 seconds between taps

    if (now - lastTapRef.current > tapTimeout) {
      tapTimesRef.current = [];
    }

    tapTimesRef.current.push(now);
    lastTapRef.current = now;

    // Keep only last 4 taps
    if (tapTimesRef.current.length > 4) {
      tapTimesRef.current.shift();
    }

    // Calculate average BPM from taps
    if (tapTimesRef.current.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < tapTimesRef.current.length; i++) {
        intervals.push(tapTimesRef.current[i] - tapTimesRef.current[i - 1]);
      }
      const avgInterval =
        intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      setBpm(calculatedBpm);
    }
  }, [setBpm]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (schedulerTimerRef.current) {
        clearTimeout(schedulerTimerRef.current);
      }
    };
  }, []);

  // Get subdivision count for current setting
  const subdivisionCount = SUBDIVISION_COUNTS[subdivision];

  return {
    // State
    bpm,
    timeSignature,
    subdivision,
    isPlaying,
    currentBeat,
    currentSubdivision,
    volume,
    subdivisionCount,

    // Actions
    setBpm,
    incrementBpm,
    setTimeSignature,
    setSubdivision,
    setVolume,
    start,
    stop,
    toggle,
    tapTempo,

    // Constants
    minBpm: MIN_BPM,
    maxBpm: MAX_BPM,
  };
}

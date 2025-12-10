import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

type SoundType = 'downbeat' | 'beat' | 'subdivision';

interface AudioEngineOptions {
  volume?: number;
}

/**
 * Detect iOS Safari to apply silent mode workaround
 */
function isIOSSafari(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined')
    return false;
  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isWebkit = /WebKit/.test(ua);
  const isNotChrome = !/CriOS/.test(ua);
  return isIOS && isWebkit && isNotChrome;
}

/**
 * Create a silent HTML audio element to unlock audio on iOS Safari
 * This workaround allows audio to play even when the ringer switch is on silent
 */
function createSilentAudioUnlocker(): HTMLAudioElement | null {
  if (typeof document === 'undefined') return null;

  // Create a short silent audio as base64 data URI (tiny MP3)
  const silentAudio = document.createElement('audio');
  // Minimal silent MP3 (base64 encoded)
  silentAudio.src =
    'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV////////////////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQAAAAAAAAAAQGwTRxelgAAAAAAAAAAAAAAAAD/4xjEAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAADSAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
  silentAudio.setAttribute('playsinline', 'true');
  silentAudio.setAttribute('webkit-playsinline', 'true');
  silentAudio.loop = true;
  silentAudio.volume = 0.01; // Nearly silent but not zero

  return silentAudio;
}

/**
 * Cross-platform audio engine for metronome clicks.
 * - Web: Uses Web Audio API to synthesize percussive click sounds
 * - Mobile: Uses expo-av to play pre-generated click sounds
 *
 * Provides distinct tones for:
 * - Downbeat (accented first beat)
 * - Main beats (regular beats 2, 3, 4, etc.)
 * - Subdivisions (divisions between main beats)
 *
 * Includes iOS Safari silent mode workaround.
 */
export function useAudioEngine(options: AudioEngineOptions = {}) {
  const { volume = 0.7 } = options;
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const silentAudioRef = useRef<HTMLAudioElement | null>(null);
  const isUnlockedRef = useRef(false);
  const soundObjectsRef = useRef<{ [key in SoundType]?: Audio.Sound }>({});

  // Initialize audio context (Web only)
  const initAudioContext = useCallback(() => {
    if (Platform.OS !== 'web') return null;

    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = volume;

      // iOS Safari silent mode workaround:
      // Playing an HTML audio element alongside WebAudio makes audio
      // play through the "media" channel instead of "ringer" channel
      if (isIOSSafari() && !silentAudioRef.current) {
        silentAudioRef.current = createSilentAudioUnlocker();
      }
    }

    // Resume if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    // Start the silent audio on iOS Safari (must be triggered by user interaction)
    if (isIOSSafari() && silentAudioRef.current && !isUnlockedRef.current) {
      silentAudioRef.current
        .play()
        .then(() => {
          isUnlockedRef.current = true;
        })
        .catch(() => {
          // Will retry on next user interaction
        });
    }

    return audioContextRef.current;
  }, [volume]);

  // Initialize mobile audio (iOS/Android)
  const initMobileAudio = useCallback(async () => {
    if (Platform.OS === 'web') return;

    try {
      // Configure audio mode for playback
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Create sound objects for each type (using synthesized buffers)
      const types: SoundType[] = ['downbeat', 'beat', 'subdivision'];

      for (const type of types) {
        if (!soundObjectsRef.current[type]) {
          const { sound } = await Audio.Sound.createAsync(
            // We'll use a data URI with synthesized audio
            { uri: generateClickDataURI(type) },
            { volume, shouldPlay: false }
          );
          soundObjectsRef.current[type] = sound;
        }
      }
    } catch (error) {
      console.error('Failed to initialize mobile audio:', error);
    }
  }, [volume]);

  // Update volume for both web and mobile
  useEffect(() => {
    if (Platform.OS === 'web') {
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = volume;
      }
    } else {
      // Update volume for all mobile sound objects
      Object.values(soundObjectsRef.current).forEach(async sound => {
        if (sound) {
          try {
            await sound.setVolumeAsync(volume);
          } catch (error) {
            console.error('Failed to set volume:', error);
          }
        }
      });
    }
  }, [volume]);

  // Initialize mobile audio on mount
  useEffect(() => {
    if (Platform.OS !== 'web') {
      initMobileAudio();
    }
  }, [initMobileAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (silentAudioRef.current) {
        silentAudioRef.current.pause();
        silentAudioRef.current = null;
      }
      isUnlockedRef.current = false;
      // Unload mobile sounds
      Object.values(soundObjectsRef.current).forEach(async sound => {
        if (sound) {
          try {
            await sound.unloadAsync();
          } catch (error) {
            console.error('Failed to unload sound:', error);
          }
        }
      });
      soundObjectsRef.current = {};
    };
  }, []);

  /**
   * Synthesize a percussive click sound (Web only)
   * Uses a combination of oscillators and noise for a crisp click
   */
  const playClickWeb = useCallback(
    (type: SoundType, time?: number) => {
      const ctx = initAudioContext();
      if (!ctx || !gainNodeRef.current) return;

      const now = time ?? ctx.currentTime;

      // Sound parameters based on type
      const params = {
        downbeat: { frequency: 1000, duration: 0.05, gain: 1.0 },
        beat: { frequency: 800, duration: 0.04, gain: 0.7 },
        subdivision: { frequency: 600, duration: 0.03, gain: 0.4 },
      }[type];

      // Create oscillator for the click tone
      const oscillator = ctx.createOscillator();
      const clickGain = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = params.frequency;

      // Envelope for percussive sound
      clickGain.gain.setValueAtTime(0, now);
      clickGain.gain.linearRampToValueAtTime(params.gain, now + 0.001);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + params.duration);

      // Connect nodes
      oscillator.connect(clickGain);
      clickGain.connect(gainNodeRef.current);

      // Play
      oscillator.start(now);
      oscillator.stop(now + params.duration + 0.01);

      // Add a bit of noise for attack (makes it more percussive)
      const noiseBuffer = ctx.createBuffer(
        1,
        ctx.sampleRate * 0.02,
        ctx.sampleRate
      );
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const noiseSource = ctx.createBufferSource();
      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();

      noiseSource.buffer = noiseBuffer;
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = params.frequency * 2;

      noiseGain.gain.setValueAtTime(params.gain * 0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(gainNodeRef.current);

      noiseSource.start(now);
      noiseSource.stop(now + 0.02);
    },
    [initAudioContext]
  );

  /**
   * Play click sound on mobile (iOS/Android)
   */
  const playClickMobile = useCallback(async (type: SoundType) => {
    const sound = soundObjectsRef.current[type];
    if (!sound) return;

    try {
      // Replay from beginning
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play mobile click:', error);
    }
  }, []);

  /**
   * Play click sound (platform-agnostic)
   */
  const playClick = useCallback(
    (type: SoundType, time?: number) => {
      if (Platform.OS === 'web') {
        playClickWeb(type, time);
      } else {
        // On mobile, ignore time parameter (scheduling not supported with expo-av)
        playClickMobile(type);
      }
    },
    [playClickWeb, playClickMobile]
  );

  /**
   * Schedule a click at a specific time (Web only - for precise timing)
   */
  const scheduleClick = useCallback(
    (type: SoundType, time: number) => {
      if (Platform.OS === 'web') {
        playClickWeb(type, time);
      } else {
        // On mobile, just play immediately (scheduling not supported)
        playClickMobile(type);
      }
    },
    [playClickWeb, playClickMobile]
  );

  /**
   * Get the current audio context time (for scheduling)
   */
  const getCurrentTime = useCallback(() => {
    if (Platform.OS === 'web') {
      const ctx = initAudioContext();
      return ctx?.currentTime ?? 0;
    }
    // On mobile, return performance.now() in seconds
    return performance.now() / 1000;
  }, [initAudioContext]);

  /**
   * Resume audio context (call on user interaction)
   */
  const resume = useCallback(() => {
    if (Platform.OS === 'web') {
      initAudioContext();
    } else {
      initMobileAudio();
    }
  }, [initAudioContext, initMobileAudio]);

  return {
    playClick,
    scheduleClick,
    getCurrentTime,
    resume,
  };
}

/**
 * Generate a data URI for a synthesized click sound (for mobile)
 * Creates a simple WAV file with a sine wave click
 */
function generateClickDataURI(type: SoundType): string {
  const params = {
    downbeat: { frequency: 1000, duration: 0.05, gain: 1.0 },
    beat: { frequency: 800, duration: 0.04, gain: 0.7 },
    subdivision: { frequency: 600, duration: 0.03, gain: 0.4 },
  }[type];

  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * params.duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Generate sine wave with envelope
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.max(0, 1 - t / params.duration);
    const sample =
      Math.sin(2 * Math.PI * params.frequency * t) * envelope * params.gain;
    view.setInt16(44 + i * 2, sample * 32767, true);
  }

  // Convert to base64
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return `data:audio/wav;base64,${base64}`;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

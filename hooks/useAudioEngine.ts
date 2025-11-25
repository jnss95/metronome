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
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
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
  silentAudio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV////////////////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQAAAAAAAAAAQGwTRxelgAAAAAAAAAAAAAAAAD/4xjEAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAADSAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
  silentAudio.setAttribute('playsinline', 'true');
  silentAudio.setAttribute('webkit-playsinline', 'true');
  silentAudio.loop = true;
  silentAudio.volume = 0.01; // Nearly silent but not zero
  
  return silentAudio;
}

/**
 * Web Audio API based audio engine for metronome clicks.
 * Synthesizes percussive click sounds with distinct tones for:
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

  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (Platform.OS !== 'web') return null;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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
      silentAudioRef.current.play().then(() => {
        isUnlockedRef.current = true;
      }).catch(() => {
        // Will retry on next user interaction
      });
    }

    return audioContextRef.current;
  }, [volume]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

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
    };
  }, []);

  /**
   * Synthesize a percussive click sound
   * Uses a combination of oscillators and noise for a crisp click
   */
  const playClick = useCallback(
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
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
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
   * Schedule a click at a specific time (for precise timing)
   */
  const scheduleClick = useCallback(
    (type: SoundType, time: number) => {
      playClick(type, time);
    },
    [playClick]
  );

  /**
   * Get the current audio context time (for scheduling)
   */
  const getCurrentTime = useCallback(() => {
    const ctx = initAudioContext();
    return ctx?.currentTime ?? 0;
  }, [initAudioContext]);

  /**
   * Resume audio context (call on user interaction)
   */
  const resume = useCallback(() => {
    initAudioContext();
  }, [initAudioContext]);

  return {
    playClick,
    scheduleClick,
    getCurrentTime,
    resume,
  };
}

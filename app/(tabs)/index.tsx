import {
  BeatVisualizer,
  BpmControls,
  SubdivisionSelector,
  TimeSignatureSelector,
  VolumeControl,
} from '@/components';
import { useMetronome } from '@/hooks';
import { useCallback, useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const metronome = useMetronome();

  // Keyboard shortcuts (Web only)
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Spacebar to toggle play/pause
      if (event.code === 'Space' && event.target === document.body) {
        event.preventDefault();
        metronome.toggle();
      }
    },
    [metronome]
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Beat Visualization */}
        <BeatVisualizer
          beats={metronome.timeSignature.beats}
          subdivisionCount={metronome.subdivisionCount}
          currentBeat={metronome.currentBeat}
          currentSubdivision={metronome.currentSubdivision}
          isPlaying={metronome.isPlaying}
        />

        {/* BPM Controls (includes Play button) */}
        <BpmControls
          bpm={metronome.bpm}
          minBpm={metronome.minBpm}
          maxBpm={metronome.maxBpm}
          onBpmChange={metronome.setBpm}
          onIncrement={metronome.incrementBpm}
          onTapTempo={metronome.tapTempo}
          isPlaying={metronome.isPlaying}
          onPlayToggle={metronome.toggle}
        />

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <TimeSignatureSelector
            timeSignature={metronome.timeSignature}
            onTimeSignatureChange={metronome.setTimeSignature}
          />

          <SubdivisionSelector
            subdivision={metronome.subdivision}
            onSubdivisionChange={metronome.setSubdivision}
          />

          <VolumeControl
            volume={metronome.volume}
            onVolumeChange={metronome.setVolume}
          />
        </View>
      </ScrollView>
    </View>
  );
}

// Material Design 3 colors
const colors = {
  background: '#1C1B1F',
  surface: '#1C1B1F',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    gap: 24,
  },
  settingsSection: {
    width: '100%',
    maxWidth: 500,
    gap: 32,
    marginTop: 16,
  },
});

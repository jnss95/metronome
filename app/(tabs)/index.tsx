import {
  BeatVisualizer,
  BpmControls,
  SettingButton,
  SettingModal,
  SUBDIVISION_LABELS,
  SubdivisionSelector,
  TimeSignatureSelector,
  VolumeControl,
} from '@/components';
import { useMetronome } from '@/hooks';
import { useCallback, useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const metronome = useMetronome();
  const [timeSignatureModalVisible, setTimeSignatureModalVisible] = useState(false);
  const [subdivisionModalVisible, setSubdivisionModalVisible] = useState(false);

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

  const timeSignatureDisplay = `${metronome.timeSignature.beats}/${metronome.timeSignature.noteValue}`;
  const subdivisionDisplay = SUBDIVISION_LABELS[metronome.subdivision];

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

        {/* Settings Buttons */}
        <View style={styles.settingsRow}>
          <SettingButton
            label="Time"
            value={timeSignatureDisplay}
            onPress={() => setTimeSignatureModalVisible(true)}
          />
          <SettingButton
            label="Subdivision"
            value={subdivisionDisplay}
            onPress={() => setSubdivisionModalVisible(true)}
          />
        </View>

        {/* Volume Control */}
        <View style={styles.volumeSection}>
          <VolumeControl
            volume={metronome.volume}
            onVolumeChange={metronome.setVolume}
          />
        </View>
      </ScrollView>

      {/* Time Signature Modal */}
      <SettingModal
        visible={timeSignatureModalVisible}
        onClose={() => setTimeSignatureModalVisible(false)}
        title="Time Signature"
      >
        <TimeSignatureSelector
          timeSignature={metronome.timeSignature}
          onTimeSignatureChange={metronome.setTimeSignature}
          onClose={() => setTimeSignatureModalVisible(false)}
        />
      </SettingModal>

      {/* Subdivision Modal */}
      <SettingModal
        visible={subdivisionModalVisible}
        onClose={() => setSubdivisionModalVisible(false)}
        title="Subdivision"
      >
        <SubdivisionSelector
          subdivision={metronome.subdivision}
          onSubdivisionChange={metronome.setSubdivision}
          onClose={() => setSubdivisionModalVisible(false)}
        />
      </SettingModal>
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
  settingsRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    maxWidth: 400,
  },
  volumeSection: {
    width: '100%',
    maxWidth: 400,
    marginTop: 8,
  },
});

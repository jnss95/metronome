import {
  BeatVisualizer,
  BpmControls,
  MUTE_EVERY_LABELS,
  MuteEverySelector,
  PlayControls,
  SettingButton,
  SettingModal,
  SUBDIVISION_LABELS,
  SubdivisionSelector,
  TimeSignatureSelector,
  VolumeControl,
} from '@/components';
import { useMetronome, useSettingsPersistence } from '@/hooks';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

// Inner component that only renders after settings are loaded
function MetronomeContent({
  settings,
  updateSettings,
}: {
  settings: ReturnType<typeof useSettingsPersistence>['settings'];
  updateSettings: ReturnType<typeof useSettingsPersistence>['updateSettings'];
}) {
  const metronome = useMetronome({
    initialBpm: settings.bpm,
    initialTimeSignature: settings.timeSignature,
    initialSubdivision: settings.subdivision,
    initialVolume: settings.volume,
    initialMuteEvery: settings.muteEvery,
    onSettingsChange: updateSettings,
  });

  const [timeSignatureModalVisible, setTimeSignatureModalVisible] =
    useState(false);
  const [subdivisionModalVisible, setSubdivisionModalVisible] = useState(false);
  const [muteModalVisible, setMuteModalVisible] = useState(false);

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
  const muteEveryDisplay = MUTE_EVERY_LABELS[metronome.muteEvery];

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

        {/* Controls Container */}
        <View style={styles.controlsContainer}>
          {/* BPM Controls */}
          <BpmControls
            bpm={metronome.bpm}
            minBpm={metronome.minBpm}
            maxBpm={metronome.maxBpm}
            onBpmChange={metronome.setBpm}
            onIncrement={metronome.incrementBpm}
            onTapTempo={metronome.tapTempo}
            isPlaying={metronome.isPlaying}
            onPlayToggle={metronome.toggle}
            showActions={false}
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
            <SettingButton
              label="Mute every"
              value={muteEveryDisplay}
              onPress={() => setMuteModalVisible(true)}
            />
          </View>

          {/* Tap / Play */}
          <PlayControls
            onTapTempo={metronome.tapTempo}
            isPlaying={metronome.isPlaying}
            onPlayToggle={metronome.toggle}
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

      {/* Mute every Modal */}
      <SettingModal
        visible={muteModalVisible}
        onClose={() => setMuteModalVisible(false)}
        title="Mute every"
      >
        <MuteEverySelector
          muteEvery={metronome.muteEvery}
          onMuteEveryChange={metronome.setMuteEvery}
          onClose={() => setMuteModalVisible(false)}
        />
      </SettingModal>
    </View>
  );
}

export default function HomeScreen() {
  const { settings, isLoaded, updateSettings } = useSettingsPersistence();

  // Show loading indicator while settings are being loaded
  if (!isLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Only render metronome after settings are loaded to ensure correct initial values
  return (
    <MetronomeContent settings={settings} updateSettings={updateSettings} />
  );
}

// Material Design 3 colors
const colors = {
  background: '#1C1B1F',
  surface: '#1C1B1F',
  primary: '#D0BCFF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  controlsContainer: {
    width: 380,
    gap: 24,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  volumeSection: {
    width: '100%',
    maxWidth: 400,
    marginTop: 8,
  },
});

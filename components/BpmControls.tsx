import React, { useState } from 'react';
import {
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

interface BpmControlsProps {
  bpm: number;
  minBpm: number;
  maxBpm: number;
  onBpmChange: (bpm: number) => void;
  onIncrement: (amount: number) => void;
  onTapTempo: () => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

/**
 * BPM controls component with:
 * - Large BPM display with manual input
 * - +/- buttons on left and right of BPM display
 * - Slider for quick adjustment
 * - Tap tempo button
 * - Play/Pause button
 */
export function BpmControls({
  bpm,
  minBpm,
  maxBpm,
  onBpmChange,
  onIncrement,
  onTapTempo,
  isPlaying,
  onPlayToggle,
}: BpmControlsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(bpm.toString());

  const handleInputSubmit = () => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) {
      onBpmChange(parsed);
    }
    setIsEditing(false);
    setInputValue(bpm.toString());
  };

  const handleInputBlur = () => {
    handleInputSubmit();
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onBpmChange(parseInt(event.target.value, 10));
  };

  return (
    <View style={styles.container}>
      {/* BPM Display with +/- buttons on sides */}
      <View style={styles.bpmRow}>
        {/* Left side buttons */}
        <View style={styles.sideButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonSmall,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => onIncrement(-5)}
          >
            <Text style={styles.buttonText}>-5</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => onIncrement(-1)}
          >
            <Text style={styles.buttonText}>−</Text>
          </Pressable>
        </View>

        {/* BPM Display */}
        <View style={styles.bpmDisplay}>
          {isEditing ? (
            <TextInput
              style={styles.bpmInput}
              value={inputValue}
              onChangeText={setInputValue}
              onBlur={handleInputBlur}
              onSubmitEditing={handleInputSubmit}
              keyboardType="numeric"
              autoFocus
              selectTextOnFocus
              maxLength={3}
            />
          ) : (
            <Pressable
              onPress={() => {
                setInputValue(bpm.toString());
                setIsEditing(true);
              }}
            >
              <Text style={styles.bpmText}>{bpm}</Text>
            </Pressable>
          )}
          <Text style={styles.bpmLabel}>BPM</Text>
        </View>

        {/* Right side buttons */}
        <View style={styles.sideButtons}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => onIncrement(1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonSmall,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => onIncrement(5)}
          >
            <Text style={styles.buttonText}>+5</Text>
          </Pressable>
        </View>
      </View>

      {/* Slider (Web only for now) */}
      {Platform.OS === 'web' && (
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>{minBpm}</Text>
          <input
            type="range"
            min={minBpm}
            max={maxBpm}
            value={bpm}
            onChange={handleSliderChange}
            style={sliderStyles}
          />
          <Text style={styles.sliderLabel}>{maxBpm}</Text>
        </View>
      )}

      {/* Tap Tempo */}
      <Pressable
        style={({ pressed }) => [styles.tapButton, pressed && styles.tapButtonPressed]}
        onPress={onTapTempo}
      >
        <Text style={styles.tapButtonText}>TAP TEMPO</Text>
      </Pressable>

      {/* Play/Pause Button */}
      <Pressable
        style={({ pressed }) => [
          styles.playButton,
          isPlaying && styles.playButtonPlaying,
          pressed && styles.playButtonPressed,
        ]}
        onPress={onPlayToggle}
      >
        <View style={styles.playIconContainer}>
          {isPlaying ? (
            <View style={styles.pauseIcon}>
              <View style={styles.pauseBar} />
              <View style={styles.pauseBar} />
            </View>
          ) : (
            <View style={styles.playIcon} />
          )}
        </View>
        <Text style={[styles.playLabel, isPlaying && styles.playLabelPlaying]}>
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </Text>
      </Pressable>
    </View>
  );
}

// Material Design 3 colors
const colors = {
  surface: '#1C1B1F',
  surfaceVariant: '#49454F',
  onSurface: '#E6E1E5',
  onSurfaceVariant: '#CAC4D0',
  primary: '#D0BCFF',
  primaryContainer: '#4F378B',
  onPrimary: '#381E72',
  outline: '#938F99',
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
    paddingVertical: 16,
  },
  bpmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sideButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  bpmDisplay: {
    alignItems: 'center',
    minWidth: 140,
  },
  bpmText: {
    fontSize: 72,
    fontWeight: '300',
    color: colors.onSurface,
    fontVariant: ['tabular-nums'],
  },
  bpmInput: {
    fontSize: 72,
    fontWeight: '300',
    color: colors.primary,
    textAlign: 'center',
    minWidth: 150,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    outlineStyle: 'none',
  } as any, // outlineStyle is web-only
  bpmLabel: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
    letterSpacing: 2,
    marginTop: -8,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSmall: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  buttonPressed: {
    backgroundColor: colors.primaryContainer,
    transform: [{ scale: 0.95 }],
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.onSurface,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 16,
  },
  sliderLabel: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    width: 30,
    textAlign: 'center',
  },
  tapButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    backgroundColor: colors.surfaceVariant,
  },
  tapButtonPressed: {
    backgroundColor: colors.primaryContainer,
    transform: [{ scale: 0.98 }],
  },
  tapButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    letterSpacing: 1.5,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 48,
    borderRadius: 28,
    backgroundColor: colors.primaryContainer,
    minWidth: 200,
  },
  playButtonPlaying: {
    backgroundColor: '#633B48',
  },
  playButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  playIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: '#EADDFF',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 4,
  },
  pauseIcon: {
    flexDirection: 'row',
    gap: 6,
  },
  pauseBar: {
    width: 8,
    height: 24,
    backgroundColor: '#FFD8E4',
    borderRadius: 2,
  },
  playLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EADDFF',
    letterSpacing: 2,
  },
  playLabelPlaying: {
    color: '#FFD8E4',
  },
});

// Web-specific slider styles
const sliderStyles: React.CSSProperties = {
  flex: 1,
  height: 4,
  appearance: 'none',
  background: colors.surfaceVariant,
  borderRadius: 2,
  cursor: 'pointer',
  accentColor: colors.primary,
};

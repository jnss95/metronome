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
}

/**
 * BPM controls component with:
 * - Large BPM display with manual input
 * - +/- 1 and +/- 5 buttons
 * - Slider for quick adjustment
 * - Tap tempo button
 */
export function BpmControls({
  bpm,
  minBpm,
  maxBpm,
  onBpmChange,
  onIncrement,
  onTapTempo,
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
          <Pressable onPress={() => {
            setInputValue(bpm.toString());
            setIsEditing(true);
          }}>
            <Text style={styles.bpmText}>{bpm}</Text>
          </Pressable>
        )}
        <Text style={styles.bpmLabel}>BPM</Text>
      </View>

      {/* +/- Buttons */}
      <View style={styles.buttonsRow}>
        <Pressable
          style={({ pressed }) => [styles.button, styles.buttonSmall, pressed && styles.buttonPressed]}
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
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => onIncrement(1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, styles.buttonSmall, pressed && styles.buttonPressed]}
          onPress={() => onIncrement(5)}
        >
          <Text style={styles.buttonText}>+5</Text>
        </Pressable>
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
  bpmDisplay: {
    alignItems: 'center',
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
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSmall: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  buttonPressed: {
    backgroundColor: colors.primaryContainer,
    transform: [{ scale: 0.95 }],
  },
  buttonText: {
    fontSize: 24,
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
    backgroundColor: colors.primaryContainer,
    marginTop: 8,
  },
  tapButtonPressed: {
    backgroundColor: colors.primary,
    transform: [{ scale: 0.98 }],
  },
  tapButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 1.5,
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

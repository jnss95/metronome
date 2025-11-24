import { TIME_SIGNATURE_PRESETS, TimeSignature } from '@/hooks';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface TimeSignatureSelectorProps {
  timeSignature: TimeSignature;
  onTimeSignatureChange: (ts: TimeSignature) => void;
  onClose?: () => void;
}

/**
 * Time signature selector content for modal.
 * Presets: 2/4, 3/4, 4/4, 5/4, 6/8, 7/8
 */
export function TimeSignatureSelector({
  timeSignature,
  onTimeSignatureChange,
  onClose,
}: TimeSignatureSelectorProps) {
  const formatTimeSignature = (ts: TimeSignature) => `${ts.beats}/${ts.noteValue}`;

  const isSelected = (ts: TimeSignature) =>
    ts.beats === timeSignature.beats && ts.noteValue === timeSignature.noteValue;

  const handleSelect = (ts: TimeSignature) => {
    onTimeSignatureChange(ts);
    onClose?.();
  };

  return (
    <View style={styles.container}>
      {TIME_SIGNATURE_PRESETS.map((ts) => (
        <Pressable
          key={formatTimeSignature(ts)}
          style={({ pressed }) => [
            styles.optionButton,
            isSelected(ts) && styles.optionButtonSelected,
            pressed && styles.optionButtonPressed,
          ]}
          onPress={() => handleSelect(ts)}
        >
          <Text
            style={[
              styles.optionText,
              isSelected(ts) && styles.optionTextSelected,
            ]}
          >
            {formatTimeSignature(ts)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// Material Design 3 colors
const colors = {
  surfaceVariant: '#49454F',
  onSurface: '#E6E1E5',
  onSurfaceVariant: '#CAC4D0',
  primary: '#D0BCFF',
  primaryContainer: '#4F378B',
  onPrimaryContainer: '#EADDFF',
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: colors.primaryContainer,
  },
  optionButtonPressed: {
    opacity: 0.8,
  },
  optionText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  optionTextSelected: {
    color: colors.onPrimaryContainer,
  },
});

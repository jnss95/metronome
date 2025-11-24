import { TIME_SIGNATURE_PRESETS, TimeSignature } from '@/hooks';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface TimeSignatureSelectorProps {
  timeSignature: TimeSignature;
  onTimeSignatureChange: (ts: TimeSignature) => void;
}

/**
 * Time signature selector with presets.
 * Presets: 2/4, 3/4, 4/4, 5/4, 6/8, 7/8
 */
export function TimeSignatureSelector({
  timeSignature,
  onTimeSignatureChange,
}: TimeSignatureSelectorProps) {
  const formatTimeSignature = (ts: TimeSignature) => `${ts.beats}/${ts.noteValue}`;

  const isSelected = (ts: TimeSignature) =>
    ts.beats === timeSignature.beats && ts.noteValue === timeSignature.noteValue;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Time Signature</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.presetsRow}
      >
        {TIME_SIGNATURE_PRESETS.map((ts) => (
          <Pressable
            key={formatTimeSignature(ts)}
            style={({ pressed }) => [
              styles.presetButton,
              isSelected(ts) && styles.presetButtonSelected,
              pressed && styles.presetButtonPressed,
            ]}
            onPress={() => onTimeSignatureChange(ts)}
          >
            <Text
              style={[
                styles.presetButtonText,
                isSelected(ts) && styles.presetButtonTextSelected,
              ]}
            >
              {formatTimeSignature(ts)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
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
  onPrimaryContainer: '#EADDFF',
  outline: '#938F99',
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    userSelect: 'none',
  } as any,
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  presetButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  presetButtonSelected: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primary,
  },
  presetButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  presetButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  presetButtonTextSelected: {
    color: colors.onPrimaryContainer,
  },
});

import { TIME_SIGNATURE_PRESETS, TimeSignature } from '@/hooks';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface TimeSignatureSelectorProps {
  timeSignature: TimeSignature;
  onTimeSignatureChange: (ts: TimeSignature) => void;
}

/**
 * Time signature selector with presets and custom option.
 * Presets: 2/4, 3/4, 4/4, 5/4, 6/8, 7/8
 * Custom: 1-16 beats per measure
 */
export function TimeSignatureSelector({
  timeSignature,
  onTimeSignatureChange,
}: TimeSignatureSelectorProps) {
  const isCustom = !TIME_SIGNATURE_PRESETS.some(
    (ts) => ts.beats === timeSignature.beats && ts.noteValue === timeSignature.noteValue
  );

  const formatTimeSignature = (ts: TimeSignature) => `${ts.beats}/${ts.noteValue}`;

  const isSelected = (ts: TimeSignature) =>
    ts.beats === timeSignature.beats && ts.noteValue === timeSignature.noteValue;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Time Signature</Text>
      
      {/* Presets */}
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

      {/* Custom beats selector */}
      <View style={styles.customSection}>
        <Text style={styles.customLabel}>Custom beats (1-16):</Text>
        <View style={styles.customBeatsRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((beats) => {
            const customTs = { beats, noteValue: 4 };
            const selected = isCustom && timeSignature.beats === beats;
            
            return (
              <Pressable
                key={beats}
                style={({ pressed }) => [
                  styles.customBeatButton,
                  selected && styles.customBeatButtonSelected,
                  pressed && styles.customBeatButtonPressed,
                ]}
                onPress={() => onTimeSignatureChange(customTs)}
              >
                <Text
                  style={[
                    styles.customBeatButtonText,
                    selected && styles.customBeatButtonTextSelected,
                  ]}
                >
                  {beats}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
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
  },
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
  customSection: {
    marginTop: 8,
  },
  customLabel: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  customBeatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  customBeatButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customBeatButtonSelected: {
    backgroundColor: colors.primaryContainer,
  },
  customBeatButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  customBeatButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
  },
  customBeatButtonTextSelected: {
    color: colors.onPrimaryContainer,
  },
});

import { MuteEveryOption, SubdivisionType } from '@/hooks';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SubdivisionSelectorProps {
  subdivision: SubdivisionType;
  onSubdivisionChange: (subdivision: SubdivisionType) => void;
  muteEvery: MuteEveryOption;
  onMuteEveryChange: (muteEvery: MuteEveryOption) => void;
  onClose?: () => void;
}

const SUBDIVISION_OPTIONS: {
  value: SubdivisionType;
  label: string;
  description: string;
}[] = [
  { value: 'none', label: '♩', description: 'Quarter notes' },
  { value: 'eighth', label: '♫', description: 'Eighth notes' },
  { value: 'triplet', label: '♫³', description: 'Triplets' },
  { value: 'sixteenth', label: '♬', description: 'Sixteenth notes' },
];

// Short labels for the button display
export const SUBDIVISION_LABELS: Record<SubdivisionType, string> = {
  none: '♩',
  eighth: '♫',
  triplet: '♫³',
  sixteenth: '♬',
};

const MUTE_EVERY_OPTIONS: {
  value: MuteEveryOption;
  label: string;
  description: string;
}[] = [
  { value: 0, label: 'Off', description: 'Play every bar' },
  { value: 2, label: '2nd', description: 'Mute bars 2, 4, 6…' },
  { value: 3, label: '3rd', description: 'Mute bars 3, 6, 9…' },
  { value: 4, label: '4th', description: 'Mute bars 4, 8, 12…' },
];

export const MUTE_EVERY_LABELS: Record<MuteEveryOption, string> = {
  0: 'Disabled',
  2: 'Every 2nd',
  3: 'Every 3rd',
  4: 'Every 4th',
};

/**
 * Subdivision selector content for modal.
 * Options: None, Eighth notes, Triplets, Sixteenths
 */
export function SubdivisionSelector({
  subdivision,
  onSubdivisionChange,
  muteEvery,
  onMuteEveryChange,
  onClose,
}: SubdivisionSelectorProps) {
  const handleSelect = (value: SubdivisionType) => {
    onSubdivisionChange(value);
    onClose?.();
  };

  const handleMuteSelect = (value: MuteEveryOption) => {
    onMuteEveryChange(value);
    onClose?.();
  };

  return (
    <View style={styles.container}>
      {SUBDIVISION_OPTIONS.map(option => {
        const isSelected = subdivision === option.value;

        return (
          <Pressable
            key={option.value}
            style={({ pressed }) => [
              styles.optionButton,
              isSelected && styles.optionButtonSelected,
              pressed && styles.optionButtonPressed,
            ]}
            onPress={() => handleSelect(option.value)}
          >
            <Text
              style={[
                styles.optionSymbol,
                isSelected && styles.optionSymbolSelected,
              ]}
            >
              {option.label}
            </Text>
            <Text
              style={[
                styles.optionLabel,
                isSelected && styles.optionLabelSelected,
              ]}
            >
              {option.description}
            </Text>
          </Pressable>
        );
      })}

      <Text style={styles.sectionTitle}>Mute every</Text>

      {MUTE_EVERY_OPTIONS.map(option => {
        const isSelected = muteEvery === option.value;

        return (
          <Pressable
            key={option.value}
            style={({ pressed }) => [
              styles.optionButton,
              isSelected && styles.optionButtonSelected,
              pressed && styles.optionButtonPressed,
            ]}
            onPress={() => handleMuteSelect(option.value)}
          >
            <Text
              style={[
                styles.optionSymbol,
                isSelected && styles.optionSymbolSelected,
              ]}
            >
              {option.label}
            </Text>
            <Text
              style={[
                styles.optionLabel,
                isSelected && styles.optionLabelSelected,
              ]}
            >
              {option.description}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Material Design 3 colors
const colors = {
  surfaceVariant: '#49454F',
  onSurfaceVariant: '#CAC4D0',
  primaryContainer: '#4F378B',
  onPrimaryContainer: '#EADDFF',
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceVariant,
  },
  optionButtonSelected: {
    backgroundColor: colors.primaryContainer,
  },
  optionButtonPressed: {
    opacity: 0.8,
  },
  optionSymbol: {
    fontSize: 28,
    color: colors.onSurfaceVariant,
    width: 40,
    textAlign: 'center',
  },
  optionSymbolSelected: {
    color: colors.onPrimaryContainer,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
  },
  optionLabelSelected: {
    color: colors.onPrimaryContainer,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    marginTop: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

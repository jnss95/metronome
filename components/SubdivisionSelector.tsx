import { SubdivisionType } from '@/hooks';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SubdivisionSelectorProps {
  subdivision: SubdivisionType;
  onSubdivisionChange: (subdivision: SubdivisionType) => void;
}

const SUBDIVISION_OPTIONS: { value: SubdivisionType; label: string; description: string }[] = [
  { value: 'none', label: '♩', description: 'Quarter' },
  { value: 'eighth', label: '♫', description: '8th' },
  { value: 'triplet', label: '♫³', description: 'Triplet' },
  { value: 'sixteenth', label: '♬', description: '16th' },
];

/**
 * Subdivision selector component.
 * Options: None, Eighth notes, Triplets, Sixteenths
 */
export function SubdivisionSelector({
  subdivision,
  onSubdivisionChange,
}: SubdivisionSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Subdivision</Text>
      <View style={styles.optionsRow}>
        {SUBDIVISION_OPTIONS.map((option) => {
          const isSelected = subdivision === option.value;
          
          return (
            <Pressable
              key={option.value}
              style={({ pressed }) => [
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => onSubdivisionChange(option.value)}
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
  secondary: '#CCC2DC',
  secondaryContainer: '#4A4458',
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
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: colors.secondaryContainer,
    borderColor: colors.secondary,
  },
  optionButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  optionSymbol: {
    fontSize: 24,
    color: colors.onSurfaceVariant,
  },
  optionSymbolSelected: {
    color: colors.secondary,
  },
  optionLabel: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    letterSpacing: 0.3,
  },
  optionLabelSelected: {
    color: colors.secondary,
  },
});

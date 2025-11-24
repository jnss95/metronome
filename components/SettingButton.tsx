import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SettingButtonProps {
  label: string;
  value: string;
  onPress: () => void;
}

/**
 * Shared button component for settings that open a modal.
 * Shows a label and current value, uniform size for all instances.
 */
export function SettingButton({ label, value, onPress }: SettingButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </Pressable>
  );
}

// Material Design 3 colors
const colors = {
  surfaceVariant: '#49454F',
  onSurface: '#E6E1E5',
  onSurfaceVariant: '#CAC4D0',
  primaryContainer: '#4F378B',
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minWidth: 140,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    userSelect: 'none',
  } as any,
  buttonPressed: {
    backgroundColor: colors.primaryContainer,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.onSurface,
  },
});

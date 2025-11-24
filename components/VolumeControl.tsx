import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

/**
 * Volume control component (Web only per PLAN.md)
 * Shows a slider to adjust master volume
 */
export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  // Only show on web
  if (Platform.OS !== 'web') {
    return null;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(parseFloat(event.target.value));
  };

  const volumePercent = Math.round(volume * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Volume</Text>
      <View style={styles.sliderRow}>
        <Text style={styles.volumeIcon}>🔈</Text>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleChange}
          style={sliderStyles}
        />
        <Text style={styles.volumeIcon}>🔊</Text>
        <Text style={styles.volumeValue}>{volumePercent}%</Text>
      </View>
    </View>
  );
}

// Material Design 3 colors
const colors = {
  surfaceVariant: '#49454F',
  onSurfaceVariant: '#CAC4D0',
  primary: '#D0BCFF',
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volumeIcon: {
    fontSize: 16,
  },
  volumeValue: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    width: 40,
    textAlign: 'right',
  },
});

const sliderStyles: React.CSSProperties = {
  flex: 1,
  height: 4,
  appearance: 'none',
  background: colors.surfaceVariant,
  borderRadius: 2,
  cursor: 'pointer',
  accentColor: colors.primary,
};

import React from 'react';
import { StyleSheet, View } from 'react-native';

interface BeatVisualizerProps {
  beats: number;
  subdivisionCount: number;
  currentBeat: number;
  currentSubdivision: number;
  isPlaying: boolean;
}

/**
 * Beat visualization component showing horizontal bars
 * that light up on the current beat/subdivision.
 *
 * Layout: Stacked bars showing subdivision structure
 * Animates from top to bottom (first subdivision at top)
 * (e.g., 4/4 + triplets = 4 stacks of 3 bars)
 */
export function BeatVisualizer({
  beats,
  subdivisionCount,
  currentBeat,
  currentSubdivision,
  isPlaying,
}: BeatVisualizerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.beatsRow}>
        {Array.from({ length: beats }).map((_, beatIndex) => {
          const isDownbeatColumn = beatIndex === 0;

          return (
            <View key={beatIndex} style={styles.beatColumn}>
              {/* Subdivision bars stacked vertically (top to bottom) */}
              <View style={styles.subdivisionStack}>
                {Array.from({ length: subdivisionCount }).map((_, subIndex) => {
                  const isActive =
                    isPlaying &&
                    beatIndex === currentBeat &&
                    subIndex === currentSubdivision;
                  const isMainBeat = subIndex === 0;
                  const isDownbeat = isDownbeatColumn && isMainBeat;

                  return (
                    <View
                      key={subIndex}
                      style={[
                        styles.bar,
                        isDownbeat && styles.barDownbeat,
                        isMainBeat && !isDownbeat && styles.barMainBeat,
                        !isMainBeat && styles.barSubdivision,
                        isActive && styles.barActive,
                        isActive && isDownbeat && styles.barActiveDownbeat,
                        isActive &&
                          isMainBeat &&
                          !isDownbeat &&
                          styles.barActiveMainBeat,
                        isActive && !isMainBeat && styles.barActiveSubdivision,
                      ]}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// Material Design 3 inspired colors
const colors = {
  // Surface colors
  surface: '#1C1B1F',
  surfaceVariant: '#49454F',
  
  // Primary colors
  primary: '#D0BCFF',
  primaryContainer: '#4F378B',
  
  // Secondary colors
  secondary: '#CCC2DC',
  secondaryContainer: '#4A4458',
  
  // Tertiary colors
  tertiary: '#EFB8C8',
  tertiaryContainer: '#633B48',
  
  // Inactive/muted
  inactive: '#49454F',
  inactiveSubdivision: '#2D2A33',
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  beatsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 8,
  },
  beatColumn: {
    alignItems: 'center',
  },
  subdivisionStack: {
    flexDirection: 'column',
    gap: 6,
  },
  bar: {
    width: 56,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.inactive,
  },
  barDownbeat: {
    backgroundColor: colors.primaryContainer,
  },
  barMainBeat: {
    backgroundColor: colors.secondaryContainer,
  },
  barSubdivision: {
    backgroundColor: colors.inactiveSubdivision,
  },
  barActive: {
    transform: [{ scale: 1.05 }],
  },
  barActiveDownbeat: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  barActiveMainBeat: {
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  barActiveSubdivision: {
    backgroundColor: colors.tertiary,
    shadowColor: colors.tertiary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
});

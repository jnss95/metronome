import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface PlayButtonProps {
  isPlaying: boolean;
  onPress: () => void;
}

/**
 * Play/Pause button with Material Design 3 styling
 */
export function PlayButton({ isPlaying, onPress }: PlayButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isPlaying && styles.buttonPlaying,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {isPlaying ? (
          // Pause icon
          <View style={styles.pauseIcon}>
            <View style={styles.pauseBar} />
            <View style={styles.pauseBar} />
          </View>
        ) : (
          // Play icon
          <View style={styles.playIcon} />
        )}
      </View>
      <Text style={[styles.label, isPlaying && styles.labelPlaying]}>
        {isPlaying ? 'PAUSE' : 'PLAY'}
      </Text>
    </Pressable>
  );
}

// Material Design 3 colors
const colors = {
  primary: '#D0BCFF',
  onPrimary: '#381E72',
  primaryContainer: '#4F378B',
  onPrimaryContainer: '#EADDFF',
  tertiary: '#EFB8C8',
  tertiaryContainer: '#633B48',
  onTertiaryContainer: '#FFD8E4',
  surface: '#1C1B1F',
};

const styles = StyleSheet.create({
  button: {
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
  buttonPlaying: {
    backgroundColor: colors.tertiaryContainer,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  iconContainer: {
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
    borderLeftColor: colors.onPrimaryContainer,
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
    backgroundColor: colors.onTertiaryContainer,
    borderRadius: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.onPrimaryContainer,
    letterSpacing: 2,
  },
  labelPlaying: {
    color: colors.onTertiaryContainer,
  },
});

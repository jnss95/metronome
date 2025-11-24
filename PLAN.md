# Metronome App - Project Plan

## Overview
Cross-platform metronome app built with Expo/React Native, targeting iOS, Android, and Web (GitHub Pages).

## Deployment
- **Phase 1**: GitHub Pages (default URL: `username.github.io/metronom`)
- **Future**: iOS App Store, Google Play Store

## Design
| Platform | Style |
|----------|-------|
| Android & Web | Material Design 3 |
| iOS | Liquid Glass (iOS 26) |

- System-dependent dark/light mode
- Platform-appropriate colors for beat visualization

## Features

### Audio Engine
- Synthesized percussive click sounds (generated on-the-fly)
- Three distinct sounds:
  - **Downbeat**: Accented first beat of measure
  - **Main beats**: Regular beats (2, 3, 4, etc.)
  - **Subdivisions**: Divisions between main beats

### Time Signature
- Presets: 2/4, 3/4, 4/4, 5/4, 6/8, 7/8
- Custom: Beats per measure selector (1-16)

### Subdivisions
- None (main beats only)
- Eighth notes (2 per beat)
- Triplets (3 per beat)
- Sixteenths (4 per beat)

### BPM Controls
- Range: 20-300 BPM
- Tap tempo button (3-4 tap average)
- +/- 1 BPM buttons
- Slider for quick adjustment
- Manual number input

### Visualization
- Horizontal bar layout
- Animated light-up on current beat/subdivision
- Stacked bars showing subdivision structure (e.g., 4/4 + triplets = 4 stacks of 3 bars)

### Platform-Specific
| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Volume control | ❌ | ❌ | ✅ Master slider |
| Play/Pause style | Liquid Glass | Material 3 | Material 3 |
| Spacebar toggle | N/A | N/A | ✅ |

### Other
- Offline support (PWA for web)
- Settings persistence between sessions

## Tech Stack
- **Framework**: Expo / React Native
- **Audio**: Web Audio API (expo-av or custom synth)
- **Styling**: Platform-adaptive components
- **State**: Local storage persistence
- **Deployment**: GitHub Actions → GitHub Pages

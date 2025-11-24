# AI Agent Instructions

## Pre-completion Checklist

Before marking any task as complete, **always** run the following command:

```bash
npm run lint
```

This ensures code quality and consistency across the codebase. Fix any linting errors before considering the task finished.

## Git Commit & Push

After the lint command succeeds (and any issues are fixed), every finished task must be committed and pushed to the remote repository:

1. Stage changes: `git add -A`
2. Commit (use a clear, Conventional Commit style if adopted): `git commit -m "feat: <short description>"`
3. Sync with main (rebasing preferred): `git pull --rebase origin main` (resolve any conflicts, then re-run `npm run lint`).
4. Push your branch: `git push origin <branch-name>`
5. Open or update the PR for review.

If `package.json` or lockfiles changed, ensure dependencies are installed and no lint errors remain before committing. Never push with unresolved lint errors.


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

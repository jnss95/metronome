# Copilot Instructions for Metronome App

## Project Overview

Cross-platform metronome app built with **Expo SDK 54** and **React Native 0.81**, targeting iOS, Android, and Web (GitHub Pages). Uses file-based routing via `expo-router`.

## Architecture

- **Routing**: `app/` directory uses Expo Router file-based routing with typed routes (`experiments.typedRoutes: true`)
- **Entry Point**: `app/_layout.tsx` (Stack) → `app/(tabs)/_layout.tsx` (Tabs) → screens
- **Path Aliases**: Use `@/*` to reference project root (configured in `tsconfig.json`)
- **New Architecture**: Enabled (`newArchEnabled: true` in app.json)

## Key Commands

```bash
npm start          # Start Expo dev server
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser
npm run lint       # ESLint (expo lint) - RUN BEFORE EVERY COMMIT
npm run build:web  # Production web build (outputs to dist/)
```

## Platform-Specific Design (from PLAN.md)

| Platform      | Design System         |
| ------------- | --------------------- |
| iOS           | Liquid Glass (iOS 26) |
| Android & Web | Material Design 3     |

Use `Platform.OS` checks for platform-specific styling. System dark/light mode is automatic (`userInterfaceStyle: automatic`).

## Code Conventions

- **TypeScript**: Strict mode enabled
- **Styling**: Use `StyleSheet.create()` for styles (see `app/(tabs)/index.tsx`)
- **Linting**: ESLint with `eslint-config-expo/flat` - ignores `dist/`
- **Components**: Functional components with hooks

## Pre-Commit Checklist

1. Run `npm run lint` and fix any errors
2. Use Conventional Commits: `git commit -m "feat: description"`
3. Rebase on main: `git pull --rebase origin main`
4. Push and open/update PR

## Deployment

- **Web**: Auto-deploys to GitHub Pages on push to `main` (see `.github/workflows/deploy.yml`)
- **Build output**: `dist/` directory with `PUBLIC_URL=/metronome`

## Dependencies to Know

- `expo-router` - File-based routing
- `react-native-reanimated` - Animations (for beat visualization)
- `expo-haptics` - Haptic feedback on mobile
- `expo-av` or Web Audio API - Audio synthesis (planned)

# Metronome 🎵

A cross-platform metronome app built with Expo and React Native, targeting iOS, Android, and Web.

**[Try it live on GitHub Pages →](https://jnss95.github.io/metronome)**

## Features

- **Precise Audio Engine** – Cross-platform audio with Web Audio API (web) and expo-av (mobile)
- **Haptic Feedback** – Tactile feedback on Android/iOS for beats (heavy for downbeat, light for regular beats)
- **Time Signatures** – Support for 2/4, 3/4, 4/4, 5/4, 6/8, and 7/8
- **Subdivisions** – None, eighth notes, triplets, or sixteenth notes
- **Flexible BPM Control** – Tap tempo, ±1 buttons, slider, and manual input (20–300 BPM)
- **Beat Visualization** – Animated horizontal bars that light up on the current beat
- **Platform-Adaptive Design** – Material Design 3 on Android/Web, Liquid Glass on iOS 26
- **Dark/Light Mode** – Automatic system theme detection
- **Offline Support** – Works without an internet connection
- **Settings Persistence** – Your preferences are saved between sessions
- **Android Optimized** – Edge-to-edge display, adaptive icons, and Material Design 3

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jnss95/metronome.git
cd metronome

# Install dependencies
npm install
```

### Development

```bash
# Start Expo dev server
npm start

# Run on specific platform
npm run ios       # iOS Simulator
npm run android   # Android Emulator
npm run web       # Web browser
```

### Production Build

```bash
# Build for web (outputs to dist/)
npm run build:web
```

## Tech Stack

- **Framework**: [Expo SDK 54](https://expo.dev) / React Native 0.81
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (file-based)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Haptics**: [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- **Audio**: Web Audio API (web) / [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/) (mobile)
- **Storage**: [Async Storage](https://react-native-async-storage.github.io/async-storage/)
- **Deployment**: GitHub Actions → GitHub Pages

## Android Compatibility

Full Android support with:
- ✅ Cross-platform audio engine (expo-av)
- ✅ Haptic feedback for beats
- ✅ Material Design 3 styling
- ✅ Edge-to-edge display
- ✅ Adaptive icons
- ✅ Settings persistence
- ✅ Offline functionality

See [ANDROID.md](./ANDROID.md) for detailed Android compatibility guide.

## Project Structure

```
app/
├── _layout.tsx          # Root layout (Stack)
├── (tabs)/
│   ├── _layout.tsx      # Tab navigation
│   └── index.tsx        # Main metronome screen
components/
├── BeatVisualizer.tsx   # Beat visualization bars
├── BpmControls.tsx      # BPM adjustment controls
├── TimeSignatureSelector.tsx
├── SubdivisionSelector.tsx
└── ...
hooks/
├── useAudioEngine.ts    # Audio synthesis & scheduling
├── useMetronome.ts      # Core metronome logic
└── useSettingsPersistence.ts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Run linting before committing (`npm run lint`)
4. Commit with conventional commits (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feat/amazing-feature`)
6. Open a Pull Request

## License

This project is private.

---

Built with ❤️ using [Expo](https://expo.dev)

## Deployment (GitHub Pages)

This project can be deployed as a static web build to GitHub Pages under the path `/metronom`.

### 1. Build locally

```bash
npm run build:web
```

The static site is generated in `dist/`.

### 2. Automatic deployment via CI

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the web export and publishes it to the `gh-pages` branch on pushes to `main`.

### 3. Enable Pages

In your repository settings, set GitHub Pages to use the `gh-pages` branch and the root directory. The site will be available at `https://<username>.github.io/metronom`.

### 4. Asset paths

The environment variable `PUBLIC_URL=/metronom` ensures all assets resolve correctly when served from the subpath. The workflow also creates a `.nojekyll` file to prevent GitHub Pages from ignoring asset directories that start with an underscore.

### 5. Manual deploy (optional)

You can manually publish after building using any static hosting provider by serving the `dist/` directory.


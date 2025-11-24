# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

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


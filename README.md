# 3 Pages Store - React Native Coding Challenge

## Overview
Minimal 3-screen app using Expo Router, Redux Toolkit, React Query, and MMKV.

- Login with DummyJSON
- Auto-lock after 10s idle or background; unlock via Biometrics or PIN `0000`
- Products list and a Specific Category list
- Query cache persisted with MMKV for offline/instant relaunch

## Setup
- Requirements: Node LTS, Expo CLI
- Install deps:
```bash
npm install
```
- Start dev server:
```bash
npm run start
```
- Open:
  - iOS: press `i`
  - Android: press `a`
  - Web: press `w`

## Credentials
- Demo user (default in login screen):
  - Username: `emilys`
  - Password: `emilyspass`

## Superadmin
- Superadmin usernames: `superadmin`, `admin`, `emilys`
- As superadmin, Delete button shows on Products (uses simulated DELETE)

## Chosen Category
- Specific Category screen navigates from the Categories tab.
- Example: open `smartphones` (or any category from the list).

## Technology
- React Native + Expo Router
- Redux Toolkit for auth state
- React Query for data fetching and caching
- MMKV for persisted cache & token
- NetInfo for offline banner

## Features Mapping
- Auth
  - `POST /auth/login` stores token (MMKV)
  - `GET /auth/me` validates/restores on launch
- Lock & Biometrics/PIN
  - Idle 10s + background lock via `useBiometricLock()`
  - Overlay `BiometricLockOverlay` supports biometrics + PIN `0000`
- Data
  - Products: `GET /products?limit=20`
  - Categories: `GET /products/categories`
  - Category products: `GET /products/category/{name}`
  - Superadmin delete: `DELETE /products/{id}` (optimistic UI)
- Offline
  - React Query cache persisted to MMKV and rehydrated
  - `OfflineBanner` shows when disconnected

## Trade-offs
- Public DummyJSON can be flaky; added retry=1 and optimistic delete
- Minimal UI; focused on clean architecture and required features
- For web, removed credentialed requests to avoid CORS with wildcard origins

## If I Had More Time
- Better error UI (toasts/retry actions)
- Tests (unit/integration) for hooks and reducers
- More polished UI and accessibility

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

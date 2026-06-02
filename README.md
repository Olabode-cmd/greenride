# GreenRide

A React Native mobile app for booking eco-friendly rides — electric vehicles, scooters, and human-powered bikes. Every trip earns EcoPoints and tracks carbon savings.

---

## Test Credentials

Authentication is powered by [dummyjson.com](https://dummyjson.com/docs/auth). Use any of the following accounts:

| Username   | Password       |
| ---------- | -------------- |
| `emilys`   | `emilyspass`   |
| `michaelw` | `michaelwpass` |
| `sophiab`  | `sophiabpass`  |

> **Note:** The "Create an account" button on the welcome screen is intentionally non-functional. DummyJSON is a mock API — it does not support user registration. All accounts are pre-seeded by the API provider.

---

## Key Screens

**Welcome** — Onboarding entry point with Log in and Create account CTAs. Redirects authenticated users directly to Home.

**Login** — Username/password form with toast error feedback. On success, navigates to the Home tab and persists the session via `expo-secure-store`.

**Home** — Lists available rides with live search (300ms debounce) and a filter sheet (vehicle type, propulsion, price, ETA, CO₂). When a ride is in progress, the list is replaced by an ongoing ride banner. Ride selection activates the Book Ride button.

**Ride Confirmation** — Full trip preview before payment: map with destination pin and user location, vehicle details, eco-impact panel (CO₂ saved, EcoPoints to earn), total fare. Tapping "Confirm & Pay" triggers a simulated payment flow and saves the ride as ongoing.

**Ongoing** — Active ride tracker. Shows trip details, payment reference, and an End Ride button. Empty state with a CTA when no ride is active. Tab icon shows a dot badge when a ride is in progress.

**Profile** — DiceBear avatar and account info fetched from DummyJSON `/auth/me`. Lifetime stats: total rides, CO₂ saved, EcoPoints. Dark/light mode toggle. Logout (soft — preserves persisted data).

---

## Stack Decisions

| Concern     | Choice                        | Why                                                                  |
| ----------- | ----------------------------- | -------------------------------------------------------------------- |
| Navigation  | Expo Router                   | File-system routing — zero manual navigator config                   |
| State       | Zustand                       | Minimal boilerplate, no provider wrapping, easy async actions        |
| Styling     | NativeWind v4                 | Tailwind utility classes in React Native with full dark mode support |
| HTTP        | Axios                         | Interceptor support for silent token refresh and 401 handling        |
| Persistence | expo-secure-store             | Works in both Expo Go and standalone builds without native linking   |
| Maps        | react-native-maps             | First-party Expo integration, works on Android and iOS               |
| Payment     | react-native-paystack-webview | Simulated in demo build; real WebView checkout ready for production  |
| Tests       | Jest + jest-expo + RNTL       | Standard Expo-compatible testing stack                               |

---

## Setup

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Install & run

```bash
git clone <repository-url>
cd greenride

npm install --legacy-peer-deps

npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).

### Run on a specific platform

```bash
# Android emulator
npx expo start --android

# iOS simulator (macOS only)
npx expo start --ios
```

### Run tests

```bash
npm test
```

---

## Assumptions

- Authentication uses DummyJSON's test API. Sessions expire after 30 minutes but are silently refreshed using the stored refresh token.
- Ride data is entirely mock — six pre-defined Lagos routes with realistic NGN pricing.
- Payment is simulated with a 1.5s delay. The Paystack test public key is included (safe to commit — cannot process real transactions). A full WebView checkout flow is implemented and ready to enable once a backend initialises the transaction.
- Location permission is requested on the Ride Confirmation screen solely to show the user's position on the map. No location data is transmitted.
- EcoPoints, ride stats, and theme preference are persisted locally on-device via `expo-secure-store`. They are not tied to the DummyJSON user account and will survive app restarts.

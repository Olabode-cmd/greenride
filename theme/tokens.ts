/*
 * Design tokens mirroring tailwind.config.js values.
 * Used in places where NativeWind classes cannot reach
 * (e.g. react-native-maps styles, StatusBar colour).
 */

export const colors = {
  bg: "#0A0A0A",
  surface: "#121212",
  surfaceRaised: "#1A1A1A",
  border: "#2A2A2A",
  accent: "#1DB954",
  accentMuted: "#1DB95420",
  primary: "#FFFFFF",
  secondary: "#A3A3A3",
  disabled: "#535353",
  danger: "#FF4C4C",

  light: {
    bg: "#FFFFFF",
    surface: "#F5F5F5",
    surfaceRaised: "#EBEBEB",
    border: "#E0E0E0",
    primary: "#111111",
    secondary: "#555555",
    disabled: "#AAAAAA",
  },
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
} as const;

export const radius = {
  button: 12,
  card: 16,
  pill: 999,
} as const;

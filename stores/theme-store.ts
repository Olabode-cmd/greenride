/*
 * Wraps NativeWind's colorScheme observable so the rest of the app
 * has a single place to read and change the active theme.
 * Persists the user's preference to SecureStore so it survives restarts.
 */
import * as SecureStore from "expo-secure-store";
import { colorScheme } from "nativewind";
import { create } from "zustand";

type ThemeMode = "light" | "dark";
const STORAGE_KEY = "greenride_theme_mode";

interface ThemeStoreState {
  mode: ThemeMode;
  hydrate: () => Promise<void>;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  mode: "light",

  hydrate: async () => {
    try {
      const saved = await SecureStore.getItemAsync(STORAGE_KEY);
      const mode: ThemeMode = saved === "dark" ? "dark" : "light";
      colorScheme.set(mode);
      set({ mode });
    } catch {
      // leave default light
    }
  },

  setMode: (mode) => {
    colorScheme.set(mode);
    set({ mode });
    SecureStore.setItemAsync(STORAGE_KEY, mode);
  },

  toggle: () => {
    const next: ThemeMode = get().mode === "light" ? "dark" : "light";
    colorScheme.set(next);
    set({ mode: next });
    SecureStore.setItemAsync(STORAGE_KEY, next);
  },
}));

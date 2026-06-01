import { colorScheme } from "nativewind";
import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface ThemeStoreState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

/*
 * Wraps NativeWind's colorScheme so the rest of the app has a single
 * place to read and change the active theme. Calling setMode also
 * updates NativeWind's dark: class resolution immediately.
 */
export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  mode: "light",
  setMode: (mode) => {
    colorScheme.set(mode);
    set({ mode });
  },
  toggle: () => {
    const next = get().mode === "light" ? "dark" : "light";
    colorScheme.set(next);
    set({ mode: next });
  },
}));

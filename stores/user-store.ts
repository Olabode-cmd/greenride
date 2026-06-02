/*
 * User stats store. Persists lifetime metrics to SecureStore so they
 * survive app restarts. hydrate() must be called at startup alongside
 * token hydration.
 */
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { UserStoreState } from "../types";
import { calculateEcoPoints } from "../utils/eco-utils";

const STORAGE_KEY = "greenride_user_stats";

interface PersistedStats {
  totalRides: number;
  totalCo2Saved: number;
  ecoPoints: number;
}

async function saveStats(stats: PersistedStats) {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(stats));
}

export const useUserStore = create<
  UserStoreState & { hydrate: () => Promise<void> }
>((set, get) => ({
  totalRides: 0,
  totalCo2Saved: 0,
  ecoPoints: 0,

  hydrate: async () => {
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY);
      if (raw) {
        const stats: PersistedStats = JSON.parse(raw);
        set(stats);
      }
    } catch {
      // leave defaults if parse fails
    }
  },

  recordBooking: (ride) => {
    const state = get();
    const next: PersistedStats = {
      totalRides: state.totalRides + 1,
      totalCo2Saved:
        Math.round((state.totalCo2Saved + ride.co2SavedKg) * 100) / 100,
      ecoPoints: state.ecoPoints + calculateEcoPoints(ride.co2SavedKg),
    };
    set(next);
    saveStats(next);
  },

  reset: () => {
    const zero = { totalRides: 0, totalCo2Saved: 0, ecoPoints: 0 };
    set(zero);
    saveStats(zero);
  },
}));

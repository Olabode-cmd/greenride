/*
 * Persists the active ride using expo-secure-store so it survives
 * app restarts. Works in both Expo Go and standalone builds.
 * Holds at most one ongoing ride at a time.
 */
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { OngoingRide, OngoingRideStoreState, Ride } from "../types";

const STORAGE_KEY = "greenride_ongoing_ride";

export const useOngoingRideStore = create<OngoingRideStoreState>((set) => ({
  ongoingRide: null,
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY);
      const ongoingRide: OngoingRide | null = raw ? JSON.parse(raw) : null;
      set({ ongoingRide, isHydrated: true });
    } catch {
      set({ ongoingRide: null, isHydrated: true });
    }
  },

  setOngoing: async (ride: Ride, reference: string) => {
    const ongoingRide: OngoingRide = {
      ride,
      paymentReference: reference,
      startedAt: new Date().toISOString(),
      status: "ongoing",
    };
    set({ ongoingRide });
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(ongoingRide));
  },

  endRide: async () => {
    set({ ongoingRide: null });
    await SecureStore.deleteItemAsync(STORAGE_KEY);
  },
}));

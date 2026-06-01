import { create } from "zustand";
import { getRides } from "../services/ride-service";
import { RideStoreState } from "../types";

export const useRideStore = create<RideStoreState>((set) => ({
  rides: [],
  isLoading: false,
  error: null,
  selectedRide: null,

  fetchRides: async () => {
    set({ isLoading: true, error: null });
    try {
      const rides = await getRides();
      set({ rides, isLoading: false });
    } catch {
      set({
        error: "Failed to load rides. Please try again.",
        isLoading: false,
      });
    }
  },

  selectRide: (ride) => set({ selectedRide: ride }),

  clearSelection: () => set({ selectedRide: null }),
}));

import { create } from "zustand";
import { calculateEcoPoints } from "../utils/eco-utils";
import { UserStoreState } from "../types";

export const useUserStore = create<UserStoreState>((set) => ({
  totalRides: 0,
  totalCo2Saved: 0,
  ecoPoints: 0,

  /*
   * Called after a booking is confirmed. Increments all three
   * lifetime metrics atomically so the profile screen stays
   * consistent without a re-fetch.
   */
  recordBooking: (ride) =>
    set((state) => ({
      totalRides: state.totalRides + 1,
      totalCo2Saved:
        Math.round((state.totalCo2Saved + ride.co2SavedKg) * 100) / 100,
      ecoPoints: state.ecoPoints + calculateEcoPoints(ride.co2SavedKg),
    })),

  reset: () => set({ totalRides: 0, totalCo2Saved: 0, ecoPoints: 0 }),
}));

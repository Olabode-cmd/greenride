import { create } from "zustand";
import { fetchProfile, UserProfileData } from "../services/profile-service";

interface ProfileStoreState {
  profile: UserProfileData | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileStoreState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await fetchProfile();
      set({ profile, isLoading: false });
    } catch {
      set({ error: "Could not load profile.", isLoading: false });
    }
  },
}));

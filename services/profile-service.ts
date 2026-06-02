import { AuthUser } from "../types";
import { apiClient } from "./api-client";

export interface UserProfileData {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  /*
   * dummyjson avatar URLs are placeholder images. We replace them with
   * DiceBear Avataaars which generates consistent, deterministic avatars
   * from a seed string — username works well as a stable seed.
   */
  avatarUrl: string;
}

function buildAvatarUrl(username: string): string {
  return `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(username)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

export async function fetchProfile(): Promise<UserProfileData> {
  const { data } = await apiClient.get<AuthUser>("/auth/me");
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    avatarUrl: buildAvatarUrl(data.username),
  };
}

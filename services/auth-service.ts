import { AuthUser } from "../types";
import { apiClient } from "./api-client";
import { tokenStore } from "./token-store";

export async function login(
  username: string,
  password: string,
): Promise<AuthUser> {
  const { data } = await apiClient.post<AuthUser>("/auth/login", {
    username,
    password,
    expiresInMins: 30,
  });

  tokenStore.setTokens(data.accessToken, data.refreshToken);
  return data;
}

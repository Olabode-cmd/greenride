import { AuthTokens, AuthUser } from "../types";
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

  await tokenStore.setTokens(data.accessToken, data.refreshToken);
  return data;
}

/*
 * Exchanges the stored refresh token for a new access/refresh pair.
 * Updates the token store on success. Clears tokens and throws on
 * failure so the auth guard can redirect to login only as a last resort.
 */
export async function refreshTokens(): Promise<void> {
  const refresh = tokenStore.getRefreshToken();

  if (!refresh) {
    throw new Error("No refresh token available.");
  }

  try {
    const { data } = await apiClient.post<AuthTokens>("/auth/refresh", {
      refreshToken: refresh,
      expiresInMins: 30,
    });

    await tokenStore.setTokens(data.accessToken, data.refreshToken);
  } catch (err) {
    await tokenStore.clear();
    throw err;
  }
}

export async function logout(): Promise<void> {
  await tokenStore.clear();
}

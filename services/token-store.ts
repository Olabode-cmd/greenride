/*
 * Persistent token store backed by expo-secure-store.
 * An in-memory cache mirrors the stored values so the axios
 * request interceptor can read synchronously without awaiting.
 *
 * All writes go to both the cache and secure storage together.
 * On cold start, call `hydrate()` once before mounting the navigator
 * so the cache is warm before any request fires.
 */
import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "greenride_access_token";
const REFRESH_KEY = "greenride_refresh_token";

let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;

export const tokenStore = {
  /*
   * Synchronous reads hit the in-memory cache.
   * Safe to call from axios interceptors.
   */
  getAccessToken: (): string | null => cachedAccessToken,
  getRefreshToken: (): string | null => cachedRefreshToken,

  /*
   * Persists both tokens to secure storage and updates the cache
   * atomically from the caller's perspective.
   */
  setTokens: async (access: string, refresh: string): Promise<void> => {
    cachedAccessToken = access;
    cachedRefreshToken = refresh;
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_KEY, access),
      SecureStore.setItemAsync(REFRESH_KEY, refresh),
    ]);
  },

  /*
   * Reads persisted tokens from secure storage into the in-memory
   * cache. Must be awaited once at app startup before the navigator
   * mounts — after that, synchronous getters are reliable.
   */
  hydrate: async (): Promise<void> => {
    const [access, refresh] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_KEY),
      SecureStore.getItemAsync(REFRESH_KEY),
    ]);
    cachedAccessToken = access;
    cachedRefreshToken = refresh;
  },

  /*
   * Clears tokens from both the cache and secure storage.
   * Called on logout or when a refresh attempt fails definitively.
   */
  clear: async (): Promise<void> => {
    cachedAccessToken = null;
    cachedRefreshToken = null;
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_KEY),
      SecureStore.deleteItemAsync(REFRESH_KEY),
    ]);
  },

  /*
   * Clears only the in-memory cache without touching SecureStore.
   * Used for soft logout — the user is redirected to login but all
   * persisted data (stats, ongoing ride, theme) is preserved so it
   * rehydrates correctly on next login.
   */
  clearCache: (): void => {
    cachedAccessToken = null;
    cachedRefreshToken = null;
  },
};

/*
 * In-memory token store. Holds the accessToken and refreshToken
 * for the current session. Kept outside React state so the axios
 * interceptor can read it synchronously without hooks.
 */

let accessToken: string | null = null;
let refreshToken: string | null = null;

export const tokenStore = {
  getAccessToken: () => accessToken,
  getRefreshToken: () => refreshToken,
  setTokens: (access: string, refresh: string) => {
    accessToken = access;
    refreshToken = refresh;
  },
  clear: () => {
    accessToken = null;
    refreshToken = null;
  },
};

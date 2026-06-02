import axios, { AxiosRequestConfig } from "axios";
import { tokenStore } from "./token-store";

export const apiClient = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

/*
 * Attach the current access token to every outgoing request.
 * Reads synchronously from the in-memory cache — safe because
 * tokenStore.hydrate() is awaited before the navigator mounts.
 */
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/*
 * On a 401 response, attempt a silent token refresh then replay
 * the original request with the new access token.
 *
 * refreshTokens is imported lazily to avoid a circular module
 * dependency (auth-service → api-client → auth-service).
 *
 * The _retry flag ensures we only attempt one refresh per request
 * cycle — if the replay also returns 401, we reject and let the
 * auth guard handle the redirect.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshTokens } = await import("./auth-service");
        await refreshTokens();

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${tokenStore.getAccessToken()}`;
        }

        return apiClient(originalRequest);
      } catch {
        /*
         * Refresh failed — tokens have been cleared by refreshTokens().
         * Reject so the caller surfaces the error; the protected layout
         * will detect the missing token on next render and redirect.
         */
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

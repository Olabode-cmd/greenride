import axios, { AxiosRequestConfig } from "axios";
import { tokenStore } from "./token-store";

export const apiClient = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/*
 * On a 401 response, exchange the stored refreshToken for a new
 * accessToken using the dummyjson /auth/refresh endpoint, then
 * replay the original request with the new token.
 * The _retry flag prevents infinite loops on repeated 401s.
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
        const refreshToken = tokenStore.getRefreshToken();
        const { data } = await axios.post(
          "https://dummyjson.com/auth/refresh",
          { refreshToken, expiresInMins: 30 },
          { headers: { "Content-Type": "application/json" } },
        );

        tokenStore.setTokens(data.accessToken, data.refreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return apiClient(originalRequest);
      } catch {
        tokenStore.clear();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
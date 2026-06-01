/*
 * Central axios instance. All service files import from here.
 * Base URL, headers, and interceptors are configured once.
 * A 400ms artificial delay is applied in development to force
 * real loading state handling.
 */
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 8000,
});

if (process.env.NODE_ENV === "development") {
  apiClient.interceptors.response.use(
    (response) =>
      new Promise((resolve) => setTimeout(() => resolve(response), 400)),
    (error) => new Promise((_, reject) => setTimeout(() => reject(error), 400)),
  );
}

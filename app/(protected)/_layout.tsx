/*
 * Auth guard for all protected routes.
 *
 * Resolution order on mount:
 *   1. If an access token is already in the cache (hydrated at startup),
 *      render children immediately — no flash of redirect.
 *   2. If no access token but a refresh token exists, attempt a silent
 *      refresh. On success render children; only redirect on failure.
 *   3. If neither token is present, redirect to login.
 *
 * This prevents the user from being logged out due to an expired
 * access token as long as a valid refresh token is stored.
 */
import { refreshTokens } from "@/services/auth-service";
import { tokenStore } from "@/services/token-store";
import { Redirect, Slot } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type AuthState = "loading" | "authenticated" | "unauthenticated";

export default function ProtectedLayout() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    /*
     * Optimistic check — if the cache already has an access token
     * (set during login or hydrated at startup) skip the loading
     * state entirely and go straight to authenticated.
     */
    return tokenStore.getAccessToken() !== null ? "authenticated" : "loading";
  });

  useEffect(() => {
    if (authState !== "loading") return;

    async function resolveAuth() {
      const hasRefresh = tokenStore.getRefreshToken() !== null;

      if (!hasRefresh) {
        setAuthState("unauthenticated");
        return;
      }

      try {
        await refreshTokens();
        setAuthState("authenticated");
      } catch {
        setAuthState("unauthenticated");
      }
    }

    resolveAuth();
  }, [authState]);

  if (authState === "loading") {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator color="#1DB954" />
      </View>
    );
  }

  if (authState === "unauthenticated") {
    return <Redirect href="/auth/login" />;
  }

  return <Slot />;
}

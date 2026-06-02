import { refreshTokens } from "@/services/auth-service";
import { tokenStore } from "@/services/token-store";
import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type AuthState = "loading" | "authenticated" | "unauthenticated";

export default function ProtectedLayout() {
  const [authState, setAuthState] = useState<AuthState>(() => {
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

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="ride-confirmation" />
    </Stack>
  );
}

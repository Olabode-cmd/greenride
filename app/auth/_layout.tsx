import { tokenStore } from "@/services/token-store";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  if (tokenStore.getAccessToken() !== null) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}

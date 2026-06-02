import { PAYSTACK_CONFIG } from "@/services/paystack-config";
import { tokenStore } from "@/services/token-store";
import { useOngoingRideStore } from "@/stores/ongoing-ride-store";
import { useThemeStore } from "@/stores/theme-store";
import { useUserStore } from "@/stores/user-store";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaystackProvider } from "react-native-paystack-webview";
import Toast from "react-native-toast-message";
import "../global.css";

const DMSans_400Regular = require("@expo-google-fonts/dm-sans/400Regular/DMSans_400Regular.ttf");
const DMSans_500Medium = require("@expo-google-fonts/dm-sans/500Medium/DMSans_500Medium.ttf");
const DMSans_700Bold = require("@expo-google-fonts/dm-sans/700Bold/DMSans_700Bold.ttf");

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  const [hydrated, setHydrated] = useState(false);
  const hydrateOngoing = useOngoingRideStore((s) => s.hydrate);
  const hydrateUser = useUserStore((s) => s.hydrate);
  const hydrateTheme = useThemeStore((s) => s.hydrate);

  useEffect(() => {
    Promise.all([
      tokenStore.hydrate(),
      hydrateOngoing(),
      hydrateUser(),
      hydrateTheme(),
    ]).finally(() => setHydrated(true));
  }, [hydrateOngoing, hydrateUser, hydrateTheme]);

  /*
   * Hide the splash screen once fonts and all stores are hydrated.
   * useEffect is legitimate here — it calls into an external native API.
   */
  useEffect(() => {
    if ((loaded || error) && hydrated) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, hydrated]);

  if ((!loaded && !error) || !hydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaystackProvider publicKey={PAYSTACK_CONFIG.PUBLIC_KEY} currency="NGN">
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </PaystackProvider>
    </GestureHandlerRootView>
  );
}

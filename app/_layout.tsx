import { tokenStore } from "@/services/token-store";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { colorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import "../global.css";

const DMSans_400Regular = require("@expo-google-fonts/dm-sans/400Regular/DMSans_400Regular.ttf");
const DMSans_500Medium = require("@expo-google-fonts/dm-sans/500Medium/DMSans_500Medium.ttf");
const DMSans_700Bold = require("@expo-google-fonts/dm-sans/700Bold/DMSans_700Bold.ttf");

SplashScreen.preventAutoHideAsync();

colorScheme.set("light");

export default function RootLayout() {
  const [loaded, error] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    tokenStore.hydrate().finally(() => setHydrated(true));
  }, []);

  /*
   * Hide the splash screen as soon as both fonts and the token store
   * are ready. useEffect is legitimate here — it calls into an
   * external native API (SplashScreen) in response to state changes.
   * The onLayout approach is unreliable on Android.
   */
  useEffect(() => {
    if ((loaded || error) && hydrated) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, hydrated]);

  if ((!loaded && !error) || !hydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </GestureHandlerRootView>
  );
}

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { colorScheme } from "nativewind";
import { useCallback } from "react";
import { View } from "react-native";
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

  /*
   * Hide splash screen once fonts are ready (or on error).
   * onLayout fires after the first render, by which point
   * useFonts has resolved — no useEffect needed.
   */
  const onRootLayout = useCallback(() => {
    if (loaded || error) {
      if (error) console.warn("Font load error:", error);
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onRootLayout}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </View>
  );
}

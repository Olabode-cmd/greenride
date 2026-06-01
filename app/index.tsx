import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { StyledText } from "@/components/styled-text";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/*
 * Two large translucent orbs positioned absolutely to break up the
 * flat background. They use the accent colour at low opacity so they
 * work in both light and dark mode without hardcoded hex values.
 */
function BackgroundOrbs() {
  return (
    <>
      <View
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: 160,
          backgroundColor: "#1DB95418",
          top: -60,
          right: -80,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 240,
          height: 240,
          borderRadius: 120,
          backgroundColor: "#1DB95410",
          bottom: 80,
          left: -60,
        }}
      />
    </>
  );
}

export default function OnboardingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <BackgroundOrbs />
      <View className="flex-1 px-6 justify-center gap-8">
        <View className="items-center gap-4">
          <Logo size="sm" />
          <StyledText variant="title" className="text-primary text-center">
            Save the environment{"\n"}Book rides with us.
          </StyledText>
        </View>

        <View className="gap-3">
          <Button
            label="Log in to your account"
            variant="primary"
            rounded
            haptic
            onPress={() => router.push("/auth/login")}
          />
          <Button
            label="Create an account"
            variant="secondary"
            rounded
            haptic
            onPress={() => router.push("/auth/register")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

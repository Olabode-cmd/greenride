import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { StyledText } from "@/components/styled-text";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 px-6 justify-center gap-12">
        {/* Logo + headline centred in the upper portion */}
        <View className="items-center gap-6">
          <Logo size="lg" />
          <StyledText variant="title" className="text-primary text-center">
            Eco rides.{"\n"}Real rewards.
          </StyledText>
        </View>

        {/* CTAs stacked at the bottom of the centred block */}
        <View className="gap-3">
          <Button
            label="Log in to your account"
            variant="primary"
            haptic
            onPress={() => router.push("/auth/login")}
          />
          <Button
            label="Create an account"
            variant="secondary"
            haptic
            onPress={() => router.push("/auth/register")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

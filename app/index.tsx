import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { StyledText } from "@/components/styled-text";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 px-4 justify-between py-12">
        <View className="gap-6 mt-12">
          <Logo size="lg" />

          <View className="gap-3">
            <StyledText variant="title" className="text-primary">
              Ride green,{"\n"}earn more.
            </StyledText>
            <StyledText variant="body" className="text-secondary">
              Book eco-friendly rides, track your carbon savings, and earn
              EcoPoints with every trip.
            </StyledText>
          </View>
        </View>

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

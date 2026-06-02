import { StyledText } from "@/components/styled-text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RideConfirmationScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 items-center justify-center">
        <StyledText variant="body" className="text-secondary">
          Ride confirmation — Phase 4
        </StyledText>
      </View>
    </SafeAreaView>
  );
}

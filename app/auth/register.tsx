import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Logo } from "@/components/logo";
import { StyledText } from "@/components/styled-text";
import { sanitize, sanitizeEmail } from "@/utils/sanitize";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  function handleRegister() {
    const cleanEmail = sanitizeEmail(email);
    const cleanPassword = sanitize(password);
    const cleanConfirm = sanitize(confirmPassword);

    if (!cleanEmail || !cleanPassword || !cleanConfirm) {
      Toast.show({ type: "error", text1: "Please fill in all fields." });
      return;
    }

    Toast.show({
      type: "info",
      text1: "Feature unavailable",
      text2: "Account creation is coming soon. Stay tuned.",
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 48,
          gap: 32,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-2">
          <Logo size="sm" />
          <StyledText variant="body" className="text-secondary">
            Create an account to start riding green.
          </StyledText>
        </View>

        <View className="gap-4">
          <Input
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            variant="password"
            label="Password"
            placeholder="Choose a password"
            value={password}
            onChangeText={setPassword}
          />
          <Input
            variant="password"
            label="Confirm password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <View className="gap-3">
          <Button
            label="Create account"
            variant="primary"
            haptic
            onPress={handleRegister}
          />
          <Button label="Back" variant="ghost" onPress={() => router.back()} />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

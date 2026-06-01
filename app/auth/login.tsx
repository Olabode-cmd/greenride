import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Logo } from "@/components/logo";
import { StyledText } from "@/components/styled-text";
import { login } from "@/services/auth-service";
import { getErrorMessage } from "@/utils/errors";
import { sanitize } from "@/utils/sanitize";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleLogin() {
    const cleanUsername = sanitize(username);
    const cleanPassword = sanitize(password);

    if (!cleanUsername || !cleanPassword) {
      setError("Please enter your username and password.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await login(cleanUsername, cleanPassword);
      router.replace("/(tabs)");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
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
            Welcome back. Sign in to continue.
          </StyledText>
        </View>

        <View className="gap-4">
          <Input
            label="Username"
            placeholder="e.g. emilys"
            autoCapitalize="none"
            autoCorrect={false}
            value={username}
            onChangeText={setUsername}
          />
          <Input
            variant="password"
            label="Password"
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
          />

          {error && (
            <StyledText variant="caption" className="text-danger">
              {error}
            </StyledText>
          )}
        </View>

        <View className="gap-3">
          <Button
            label="Log in"
            variant="primary"
            haptic
            loading={loading}
            onPress={handleLogin}
          />
          <Button label="Back" variant="ghost" onPress={() => router.back()} />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

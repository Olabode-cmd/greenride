/*
 * Catches synchronous render-phase errors that would crash the app.
 * Async errors (API calls, promise rejections) are not caught here —
 * those are handled at the call site with try/catch and toast feedback.
 *
 * Must be a class component — React's error boundary API requires it.
 */
import { colors } from "@/theme/tokens";
import React from "react";
import { Pressable, View } from "react-native";
import { StyledText } from "./styled-text";

interface Props {
  children: React.ReactNode;
}

interface State {
  crashed: boolean;
  message: string | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { crashed: false, message: null };

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return { crashed: true, message };
  }

  handleReset = () => {
    this.setState({ crashed: false, message: null });
  };

  render() {
    if (!this.state.crashed) {
      return this.props.children;
    }

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 32,
          gap: 24,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            backgroundColor: colors.danger + "20",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: colors.danger + "40",
          }}
        >
          <StyledText
            variant="display"
            style={{ fontSize: 28, color: colors.danger }}
          >
            !
          </StyledText>
        </View>

        <View style={{ gap: 8, alignItems: "center" }}>
          <StyledText
            variant="section"
            style={{ color: colors.primary, textAlign: "center" }}
          >
            Something went wrong
          </StyledText>
          {this.state.message && (
            <StyledText
              variant="caption"
              style={{ color: colors.secondary, textAlign: "center" }}
            >
              {this.state.message}
            </StyledText>
          )}
        </View>

        <Pressable
          onPress={this.handleReset}
          accessibilityRole="button"
          accessibilityLabel="Try again"
          style={{
            backgroundColor: colors.accent,
            borderRadius: 999,
            paddingHorizontal: 32,
            paddingVertical: 14,
          }}
        >
          <StyledText variant="label" style={{ color: colors.bg }}>
            Try again
          </StyledText>
        </Pressable>
      </View>
    );
  }
}

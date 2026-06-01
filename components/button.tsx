/*
 * Button — multi-variant pressable with optional haptic feedback
 * and a gentle bounce microinteraction on press.
 *
 * Variants:
 *   primary   — accent fill, dark label (main CTA)
 *   secondary — bordered, no fill (cancel / back actions)
 *   ghost     — no border, no fill (inline text actions)
 *   danger    — danger-red fill (destructive actions)
 *
 * NativeWind handles all static layout and colour classes.
 * Animated.spring scale lives in inline style — NativeWind cannot
 * drive JS-animated values via className.
 */
import { useTheme } from "@/theme/use-theme";
import * as Haptics from "expo-haptics";
import { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  PressableProps,
  View,
} from "react-native";
import { StyledText } from "./styled-text";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends Omit<PressableProps, "style"> {
  variant?: ButtonVariant;
  label: string;
  haptic?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  label,
  haptic = false,
  loading = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  disabled,
  onPress,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 6,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 10,
    }).start();
  }

  async function handlePress(
    e: Parameters<NonNullable<PressableProps["onPress"]>>[0],
  ) {
    if (haptic) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  }

  const isDisabled = disabled ?? loading;

  const containerClassName =
    variant === "primary"
      ? "bg-accent rounded-xl h-[52px] flex-row items-center justify-center gap-2"
      : variant === "secondary"
        ? "bg-transparent border border-border rounded-xl h-[52px] flex-row items-center justify-center gap-2"
        : variant === "ghost"
          ? "bg-transparent rounded-xl h-[52px] flex-row items-center justify-center gap-2"
          : "bg-danger rounded-xl h-[52px] flex-row items-center justify-center gap-2";

  const labelClassName =
    variant === "primary"
      ? "text-bg"
      : variant === "secondary"
        ? "text-secondary"
        : variant === "ghost"
          ? "text-accent"
          : "text-primary";

  const spinnerColor = variant === "primary" ? colors.bg : colors.accent;

  return (
    <Animated.View
      style={{ transform: [{ scale }] }}
      className={fullWidth ? "w-full" : undefined}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={isDisabled}
        className={`${containerClassName} ${isDisabled ? "opacity-50" : "opacity-100"}`}
        accessibilityRole="button"
        accessibilityLabel={label}
        {...props}
      >
        {loading ? (
          <ActivityIndicator size="small" color={spinnerColor} />
        ) : (
          <>
            {leftIcon && <View>{leftIcon}</View>}
            <StyledText variant="label" className={labelClassName}>
              {label}
            </StyledText>
            {rightIcon && <View>{rightIcon}</View>}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

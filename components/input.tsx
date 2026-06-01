/*
 * Input — multi-variant text input components.
 *
 * Variants:
 *   default   — standard single-line input
 *   password  — secure entry with eye toggle
 *   search    — leading magnifier icon, pill shape
 *   textarea  — multiline, fixed height
 *
 * NativeWind handles static layout and colour classes.
 * borderColor is driven by focus/error state so it stays inline —
 * NativeWind cannot resolve JS-computed values at runtime.
 */
import { useTheme } from "@/theme/use-theme";
import {
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
} from "phosphor-react-native";
import { useRef, useState } from "react";
import {
  Platform,
  Pressable,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { StyledText } from "./styled-text";

type InputVariant = "default" | "password" | "search" | "textarea";

interface InputProps extends Omit<TextInputProps, "style"> {
  variant?: InputVariant;
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  variant = "default",
  label,
  error,
  hint,
  ...props
}: InputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(variant === "password");
  const inputRef = useRef<TextInput>(null);

  const isPassword = variant === "password";
  const isSearch = variant === "search";
  const isTextarea = variant === "textarea";

  /*
   * Border colour is computed from JS state — must stay inline.
   * Everything else uses NativeWind classes.
   */
  const borderColor = error
    ? colors.danger
    : focused
      ? colors.accent
      : colors.border;

  const iconColor = focused ? colors.accent : colors.secondary;

  return (
    <View className="gap-1.5">
      {label && (
        <StyledText variant="caption" className="text-secondary">
          {label}
        </StyledText>
      )}

      <Pressable
        onPress={() => inputRef.current?.focus()}
        className={
          isTextarea
            ? "flex-row items-start bg-surface-input px-4 py-3 h-[120px]"
            : isSearch
              ? "flex-row items-center bg-surface-input px-4 h-[52px] rounded-full"
              : "flex-row items-center bg-surface-input px-4 h-[52px] rounded-xl"
        }
        style={{ borderWidth: 1, borderColor, gap: 8 }}
      >
        {isSearch && (
          <MagnifyingGlassIcon size={20} color={iconColor} weight="regular" />
        )}

        <TextInput
          ref={inputRef}
          secureTextEntry={isPassword ? secure : false}
          multiline={isTextarea}
          numberOfLines={isTextarea ? 4 : 1}
          textAlignVertical={isTextarea ? "top" : "center"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={colors.disabled}
          style={[
            {
              flex: 1,
              fontFamily: "DMSans_400Regular",
              fontSize: 14,
              color: colors.primary,
              height: isTextarea ? "100%" : 52,
              paddingVertical: 0,
            },
            /*
             * Android injects default top padding into TextInput.
             * Zeroing it keeps vertical alignment consistent.
             */
            Platform.OS === "android" && { paddingTop: 0 },
          ]}
          {...props}
        />

        {isPassword && (
          /*
           * 44pt minimum touch area for the eye toggle per
           * accessibility guidelines. hitSlop extends the tap
           * region without affecting layout.
           */
          <Pressable
            onPress={() => setSecure((prev) => !prev)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="p-2 -mr-2 justify-center items-center"
            accessibilityLabel={secure ? "Show password" : "Hide password"}
            accessibilityRole="button"
          >
            {secure ? (
              <EyeIcon size={22} color={colors.secondary} weight="regular" />
            ) : (
              <EyeSlashIcon
                size={22}
                color={colors.secondary}
                weight="regular"
              />
            )}
          </Pressable>
        )}
      </Pressable>

      {error && (
        <StyledText variant="caption" className="text-danger">
          {error}
        </StyledText>
      )}

      {hint && !error && (
        <StyledText variant="caption" className="text-secondary">
          {hint}
        </StyledText>
      )}
    </View>
  );
}

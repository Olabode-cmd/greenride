import { useColorScheme } from "react-native";
import { colors } from "./tokens";

export type ThemeColors = {
  bg: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  accent: string;
  accentMuted: string;
  primary: string;
  secondary: string;
  disabled: string;
  danger: string;
};

export function useTheme(): { colors: ThemeColors; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const themeColors: ThemeColors = {
    bg: isDark ? colors.bg : colors.light.bg,
    surface: isDark ? colors.surface : colors.light.surface,
    surfaceRaised: isDark ? colors.surfaceRaised : colors.light.surfaceRaised,
    border: isDark ? colors.border : colors.light.border,
    accent: colors.accent,
    accentMuted: colors.accentMuted,
    primary: isDark ? colors.primary : colors.light.primary,
    secondary: isDark ? colors.secondary : colors.light.secondary,
    disabled: isDark ? colors.disabled : colors.light.disabled,
    danger: colors.danger,
  };

  return { colors: themeColors, isDark };
}

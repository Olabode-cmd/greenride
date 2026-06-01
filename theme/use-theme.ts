import { useColorScheme } from "nativewind";
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
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const themeColors: ThemeColors = {
    bg: isDark ? colors.dark.bg : colors.bg,
    surface: isDark ? colors.dark.surface : colors.surface,
    surfaceRaised: isDark ? colors.dark.surfaceRaised : colors.surfaceRaised,
    border: isDark ? colors.dark.border : colors.border,
    accent: colors.accent,
    accentMuted: colors.accentMuted,
    primary: isDark ? colors.dark.primary : colors.primary,
    secondary: isDark ? colors.dark.secondary : colors.secondary,
    disabled: isDark ? colors.dark.disabled : colors.disabled,
    danger: colors.danger,
  };

  return { colors: themeColors, isDark };
}

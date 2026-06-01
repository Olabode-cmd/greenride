import { useTheme } from "@/theme/use-theme";
import { Text, View } from "react-native";

type LogoSize = "sm" | "md" | "lg";
type LogoTheme = "dark" | "light";

interface LogoProps {
  size?: LogoSize;
  theme?: LogoTheme;
}

const fontSizes: Record<LogoSize, number> = {
  sm: 24,
  md: 36,
  lg: 48,
};

const lineHeights: Record<LogoSize, number> = {
  sm: 24 * 1.1,
  md: 36 * 1.1,
  lg: 48 * 1.1,
};

export function Logo({ size = "md", theme }: LogoProps) {
  const { colors, isDark } = useTheme();

  const resolvedIsDark = theme ? theme === "dark" : isDark;
  const primaryColor = resolvedIsDark ? "#FFFFFF" : "#111111";

  const fontSize = fontSizes[size];
  const lineHeight = lineHeights[size];

  return (
    <View className="flex-row items-baseline">
      <Text
        style={{
          fontFamily: "DMSerifDisplay_400Regular",
          fontSize,
          lineHeight,
          color: primaryColor,
        }}
      >
        Green
      </Text>
      <Text
        style={{
          fontFamily: "DMSerifDisplay_400Regular",
          fontSize,
          lineHeight,
          color: colors.accent,
        }}
      >
        Ride
      </Text>
    </View>
  );
}

import { useTheme } from "@/theme/use-theme";
import { Text, View } from "react-native";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
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

export function Logo({ size = "md" }: LogoProps) {
  const { colors } = useTheme();

  const fontSize = fontSizes[size];
  const lineHeight = lineHeights[size];

  return (
    <View className="flex-row items-baseline">
      <Text
        style={{
          fontFamily: "DMSerifDisplay_400Regular",
          fontSize,
          lineHeight,
          color: colors.primary,
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

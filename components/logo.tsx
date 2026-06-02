import { useTheme } from "@/theme/use-theme";
import { LeafIcon } from "phosphor-react-native";
import { View } from "react-native";
import { StyledText } from "./styled-text";

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

const iconSizes: Record<LogoSize, number> = {
  sm: 16,
  md: 22,
  lg: 30,
};

export function Logo({ size = "md" }: LogoProps) {
  const { colors } = useTheme();

  const fontSize = fontSizes[size];
  const lineHeight = lineHeights[size];
  const iconSize = iconSizes[size];

  return (
    <View className="flex-row items-center gap-1">
      <LeafIcon size={iconSize} color={colors.accent} weight="fill" />
      <View className="flex-row items-baseline">
        <StyledText
          variant="display"
          style={{ fontSize, lineHeight, color: colors.primary }}
        >
          Green
        </StyledText>
        <StyledText
          variant="display"
          style={{ fontSize, lineHeight, color: colors.accent }}
        >
          Ride
        </StyledText>
      </View>
    </View>
  );
}

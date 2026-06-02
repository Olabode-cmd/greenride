import { useTheme } from "@/theme/use-theme";
import { Text, TextProps } from "react-native";

export type TextVariant =
  | "display"
  | "title"
  | "section"
  | "body"
  | "label"
  | "caption";

interface StyledTextProps extends TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
}

/*
 * Font metrics per style guide. fontFamily must be set via style prop —
 * NativeWind cannot resolve loaded custom font families as utility classes.
 * fontFamily is placed last in the style array so it always wins.
 *
 * Default text colours come from useTheme() so dark mode works
 * automatically without needing dark: className variants on every usage.
 * Callers can override via the style prop or className as needed.
 */
const variantMetrics: Record<
  TextVariant,
  { fontFamily: string; fontSize: number; lineHeight: number }
> = {
  display: { fontFamily: "DMSans_700Bold", fontSize: 36, lineHeight: 36 * 1.1 },
  title: { fontFamily: "DMSans_700Bold", fontSize: 28, lineHeight: 28 * 1.2 },
  section: { fontFamily: "DMSans_700Bold", fontSize: 20, lineHeight: 20 * 1.2 },
  body: { fontFamily: "DMSans_400Regular", fontSize: 16, lineHeight: 16 * 1.5 },
  label: { fontFamily: "DMSans_500Medium", fontSize: 15, lineHeight: 15 * 1.2 },
  caption: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 13 * 1.4,
  },
};

export function StyledText({
  variant = "body",
  className,
  style,
  children,
  ...props
}: StyledTextProps) {
  const { colors } = useTheme();
  const { fontFamily, fontSize, lineHeight } = variantMetrics[variant];

  /*
   * Default colour per variant — heading variants use primary,
   * utility variants use secondary. Callers override with style prop.
   */
  const defaultColor =
    variant === "display" ||
    variant === "title" ||
    variant === "section" ||
    variant === "label"
      ? colors.primary
      : colors.secondary;

  return (
    <Text
      className={className}
      style={[
        { fontSize, lineHeight, color: defaultColor },
        style,
        { fontFamily },
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

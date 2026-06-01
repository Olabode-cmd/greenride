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
 * The fontStyle entry is listed last in the merged array so it always wins
 * over any NativeWind-compiled className styles.
 */
const variantStyles: Record<
  TextVariant,
  { fontFamily: string; fontSize: number; lineHeight: number }
> = {
  display: {
    fontFamily: "DMSans_700Bold",
    fontSize: 36,
    lineHeight: 36 * 1.1,
  },
  title: {
    fontFamily: "DMSans_700Bold",
    fontSize: 28,
    lineHeight: 28 * 1.2,
  },
  section: {
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    lineHeight: 20 * 1.2,
  },
  body: {
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
    lineHeight: 16 * 1.5,
  },
  label: {
    fontFamily: "DMSans_500Medium",
    fontSize: 15,
    lineHeight: 15 * 1.2,
  },
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
  const { fontFamily, fontSize, lineHeight } = variantStyles[variant];
  return (
    <Text
      className={className}
      style={[{ fontSize, lineHeight }, style, { fontFamily }]}
      {...props}
    >
      {children}
    </Text>
  );
}

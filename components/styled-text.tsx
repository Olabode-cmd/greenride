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
 * Font metrics per style guide. Kept as inline style because
 * NativeWind cannot resolve loaded custom font families as
 * utility classes — fontFamily must be set via style prop.
 */
const variantStyles: Record<
  TextVariant,
  { fontFamily: string; fontSize: number; lineHeight: number }
> = {
  display: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 36,
    lineHeight: 36 * 1.1,
  },
  title: {
    fontFamily: "DMSerifDisplay_400Regular",
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
  return (
    <Text
      className={className}
      style={[variantStyles[variant], style]}
      {...props}
    >
      {children}
    </Text>
  );
}

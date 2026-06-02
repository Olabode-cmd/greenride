import { useTheme } from "@/theme/use-theme";
import { NavigationArrowIcon } from "phosphor-react-native";
import { View } from "react-native";
import { StyledText } from "./styled-text";

export function NoRidesEmptyState() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        gap: 12,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: colors.accentMuted,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.accent + "30",
        }}
      >
        <NavigationArrowIcon size={26} color={colors.accent} weight="fill" />
      </View>
      <View style={{ gap: 4, alignItems: "center" }}>
        <StyledText variant="label" style={{ color: colors.primary }}>
          No rides yet
        </StyledText>
        <StyledText
          variant="caption"
          style={{ color: colors.secondary, textAlign: "center" }}
        >
          Book your first ride to start earning EcoPoints and tracking your
          carbon savings.
        </StyledText>
      </View>
    </View>
  );
}

import { useTheme } from "@/theme/use-theme";
import { LeafIcon, ShootingStarIcon } from "phosphor-react-native";
import { View } from "react-native";
import { StyledText } from "./styled-text";

interface EcoPointsPanelProps {
  ecoPoints: number;
}

export function EcoPointsPanel({ ecoPoints }: EcoPointsPanelProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.accentMuted,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.accent + "40",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <ShootingStarIcon size={16} color={colors.accent} weight="fill" />
          <StyledText
            variant="caption"
            style={{
              color: colors.accent + "CC",
              fontFamily: "DMSans_500Medium",
            }}
          >
            EcoPoints
          </StyledText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
          <StyledText variant="display" style={{ color: colors.accent }}>
            {ecoPoints}
          </StyledText>
          <StyledText variant="body" style={{ color: colors.accent + "CC" }}>
            pts
          </StyledText>
        </View>
        <StyledText variant="caption" style={{ color: colors.accent + "99" }}>
          1 pt per 0.1 kg CO₂ saved
        </StyledText>
      </View>

      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          backgroundColor: colors.accent + "25",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.accent + "50",
        }}
      >
        <LeafIcon size={30} color={colors.accent} weight="fill" />
      </View>
    </View>
  );
}

import { useTheme } from "@/theme/use-theme";
import { View } from "react-native";
import { StyledText } from "./styled-text";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
}

export function StatCard({
  icon,
  label,
  value,
  unit,
  accent = false,
}: StatCardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: accent ? colors.accentMuted : colors.surface,
        borderRadius: 16,
        padding: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: accent ? colors.accent + "40" : colors.border,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: accent ? colors.accent + "25" : colors.surfaceRaised,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </View>
      <View style={{ gap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
          <StyledText
            variant="display"
            style={{ color: accent ? colors.accent : colors.primary }}
          >
            {value}
          </StyledText>
          {unit && (
            <StyledText
              variant="caption"
              style={{
                color: accent ? colors.accent + "CC" : colors.secondary,
              }}
            >
              {unit}
            </StyledText>
          )}
        </View>
        <StyledText
          variant="caption"
          style={{ color: accent ? colors.accent + "CC" : colors.secondary }}
        >
          {label}
        </StyledText>
      </View>
    </View>
  );
}

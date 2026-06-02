import { useTheme } from "@/theme/use-theme";
import { FunnelIcon } from "phosphor-react-native";
import { Pressable, TextInput, View } from "react-native";

interface RideSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  hasActiveFilters: boolean;
  onFilterPress: () => void;
}

export function RideSearchBar({
  value,
  onChangeText,
  hasActiveFilters,
  onFilterPress,
}: RideSearchBarProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        paddingLeft: 14,
        paddingRight: 4,
        height: 52,
        gap: 8,
      }}
    >
      <TextInput
        placeholder="Search rides, vehicles, destinations..."
        placeholderTextColor={colors.disabled}
        value={value}
        onChangeText={onChangeText}
        style={{
          flex: 1,
          fontFamily: "DMSans_400Regular",
          fontSize: 14,
          color: colors.primary,
          height: "100%",
        }}
        returnKeyType="search"
        autoCorrect={false}
      />

      <Pressable
        onPress={onFilterPress}
        accessibilityLabel="Open ride filters"
        accessibilityRole="button"
        hitSlop={8}
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: hasActiveFilters
            ? colors.accentMuted
            : colors.surface,
          borderWidth: 1,
          borderColor: hasActiveFilters ? colors.accent + "60" : colors.border,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FunnelIcon
          size={18}
          color={hasActiveFilters ? colors.accent : colors.secondary}
          weight={hasActiveFilters ? "fill" : "regular"}
        />
      </Pressable>
    </View>
  );
}

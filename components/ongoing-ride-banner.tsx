/*
 * Two variants of ongoing ride display:
 *
 *  "banner"  — used on the home screen. Tappable, navigates to the
 *              Ongoing tab. Shows a pulsing dot, vehicle name, destination.
 *
 *  "summary" — used on the profile screen. Read-only card showing
 *              vehicle, destination, and an Ongoing badge.
 */
import { useTheme } from "@/theme/use-theme";
import { OngoingRide } from "@/types";
import { router } from "expo-router";
import { NavigationArrowIcon } from "phosphor-react-native";
import { Pressable, View } from "react-native";
import { StyledText } from "./styled-text";

interface OngoingRideBannerProps {
  ongoingRide: OngoingRide;
  variant?: "banner" | "summary";
}

export function OngoingRideBanner({
  ongoingRide,
  variant = "banner",
}: OngoingRideBannerProps) {
  const { colors } = useTheme();
  const { ride } = ongoingRide;

  if (variant === "summary") {
    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 12,
        }}
      >
        <StyledText variant="label" style={{ color: colors.secondary }}>
          Current ride
        </StyledText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ gap: 2 }}>
            <StyledText variant="label" style={{ color: colors.primary }}>
              {ride.vehicle.make} {ride.vehicle.model}
            </StyledText>
            <StyledText variant="caption" style={{ color: colors.secondary }}>
              To {ride.destination.label}
            </StyledText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: colors.accentMuted,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: colors.accent + "40",
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.accent,
              }}
            />
            <StyledText
              variant="caption"
              style={{ color: colors.accent, fontFamily: "DMSans_500Medium" }}
            >
              Ongoing
            </StyledText>
          </View>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => router.navigate("/(protected)/(tabs)/ongoing")}
      accessibilityRole="button"
      accessibilityLabel="View ongoing ride"
      style={{
        backgroundColor: colors.accentMuted,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.accent + "50",
        gap: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.accent,
          }}
        />
        <StyledText
          variant="caption"
          style={{ color: colors.accent, fontFamily: "DMSans_500Medium" }}
        >
          Ride in progress
        </StyledText>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ gap: 2 }}>
          <StyledText variant="label" style={{ color: colors.primary }}>
            {ride.vehicle.make} {ride.vehicle.model}
          </StyledText>
          <StyledText variant="caption" style={{ color: colors.secondary }}>
            To {ride.destination.label} · {ride.destination.distanceKm} km
          </StyledText>
        </View>
        <NavigationArrowIcon size={20} color={colors.accent} weight="fill" />
      </View>
    </Pressable>
  );
}

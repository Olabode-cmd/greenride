import { Logo } from "@/components/logo";
import { StyledText } from "@/components/styled-text";
import { useOngoingRideStore } from "@/stores/ongoing-ride-store";
import { useProfileStore } from "@/stores/profile-store";
import { useThemeStore } from "@/stores/theme-store";
import { useUserStore } from "@/stores/user-store";
import { useTheme } from "@/theme/use-theme";
import { useFocusEffect } from "expo-router";
import {
    CarIcon,
    LeafIcon,
    MoonIcon,
    NavigationArrowIcon,
    ShootingStarIcon,
    SunIcon,
} from "phosphor-react-native";
import { useCallback } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
}

function StatCard({ icon, label, value, unit, accent = false }: StatCardProps) {
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

function EmptyState() {
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
        <StyledText variant="label" className="text-primary">
          No rides yet
        </StyledText>
        <StyledText
          variant="caption"
          className="text-secondary"
          style={{ textAlign: "center" }}
        >
          Book your first ride to start earning EcoPoints and tracking your
          carbon savings.
        </StyledText>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { totalRides, totalCo2Saved, ecoPoints } = useUserStore();
  const ongoingRide = useOngoingRideStore((s) => s.ongoingRide);
  const { profile, isLoading, fetchProfile } = useProfileStore();
  const { mode, toggle } = useThemeStore();
  const { colors, isDark } = useTheme();

  const hasActivity = totalRides > 0 || ongoingRide !== null;

  useFocusEffect(
    useCallback(() => {
      if (!profile) fetchProfile();
    }, [profile, fetchProfile]),
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top"]}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 48 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Logo size="sm" />
          {/*
           * Dark mode toggle — switches between sun and moon icons.
           * Tapping calls useThemeStore.toggle() which updates NativeWind's
           * colorScheme and persists the preference to SecureStore.
           */}
          <Pressable
            onPress={toggle}
            accessibilityRole="switch"
            accessibilityLabel={
              isDark ? "Switch to light mode" : "Switch to dark mode"
            }
            accessibilityState={{ checked: isDark }}
            hitSlop={8}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isDark ? (
              <SunIcon size={20} color={colors.accent} weight="fill" />
            ) : (
              <MoonIcon size={20} color={colors.secondary} weight="regular" />
            )}
          </Pressable>
        </View>

        {isLoading && !profile ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : profile ? (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
            }}
          >
            <Image
              source={{ uri: profile.avatarUrl }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: colors.surfaceRaised,
                borderWidth: 2,
                borderColor: colors.accent + "40",
              }}
              accessibilityLabel={`${profile.firstName}'s avatar`}
            />
            <View style={{ flex: 1, gap: 3 }}>
              <StyledText variant="section" className="text-primary">
                {profile.firstName} {profile.lastName}
              </StyledText>
              <StyledText variant="caption" className="text-secondary">
                @{profile.username}
              </StyledText>
              <StyledText variant="caption" style={{ color: colors.disabled }}>
                {profile.email}
              </StyledText>
            </View>
          </View>
        ) : null}

        {!hasActivity ? (
          <EmptyState />
        ) : (
          <View style={{ gap: 12 }}>
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
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <ShootingStarIcon
                    size={16}
                    color={colors.accent}
                    weight="fill"
                  />
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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    gap: 6,
                  }}
                >
                  <StyledText
                    variant="display"
                    style={{ color: colors.accent }}
                  >
                    {ecoPoints}
                  </StyledText>
                  <StyledText
                    variant="body"
                    style={{ color: colors.accent + "CC" }}
                  >
                    pts
                  </StyledText>
                </View>
                <StyledText
                  variant="caption"
                  style={{ color: colors.accent + "99" }}
                >
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

            <View style={{ flexDirection: "row", gap: 12 }}>
              <StatCard
                icon={
                  <CarIcon
                    size={18}
                    color={colors.secondary}
                    weight="regular"
                  />
                }
                label="Total rides"
                value={String(totalRides)}
              />
              <StatCard
                icon={
                  <LeafIcon size={18} color={colors.accent} weight="fill" />
                }
                label="CO₂ saved"
                value={totalCo2Saved.toFixed(2)}
                unit="kg"
                accent
              />
            </View>
          </View>
        )}

        {ongoingRide && (
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
            <StyledText variant="label" className="text-secondary">
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
                <StyledText variant="label" className="text-primary">
                  {ongoingRide.ride.vehicle.make}{" "}
                  {ongoingRide.ride.vehicle.model}
                </StyledText>
                <StyledText variant="caption" className="text-secondary">
                  To {ongoingRide.ride.destination.label}
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
                  style={{
                    color: colors.accent,
                    fontFamily: "DMSans_500Medium",
                  }}
                >
                  Ongoing
                </StyledText>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

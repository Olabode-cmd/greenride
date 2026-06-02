import { EcoPointsPanel } from "@/components/eco-points-panel";
import { Logo } from "@/components/logo";
import { NoRidesEmptyState } from "@/components/no-rides-empty-state";
import { OngoingRideBanner } from "@/components/ongoing-ride-banner";
import { ProfileCard } from "@/components/profile-card";
import { StatCard } from "@/components/stat-card";
import { StyledText } from "@/components/styled-text";
import { tokenStore } from "@/services/token-store";
import { useOngoingRideStore } from "@/stores/ongoing-ride-store";
import { useProfileStore } from "@/stores/profile-store";
import { useThemeStore } from "@/stores/theme-store";
import { useUserStore } from "@/stores/user-store";
import { useTheme } from "@/theme/use-theme";
import { router, useFocusEffect } from "expo-router";
import { CarIcon, LeafIcon, MoonIcon, SunIcon } from "phosphor-react-native";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { totalRides, totalCo2Saved, ecoPoints } = useUserStore();
  const ongoingRide = useOngoingRideStore((s) => s.ongoingRide);
  const { profile, isLoading, fetchProfile } = useProfileStore();
  const { toggle } = useThemeStore();
  const { colors, isDark } = useTheme();

  const hasActivity = totalRides > 0 || ongoingRide !== null;

  useFocusEffect(
    useCallback(() => {
      if (!profile) fetchProfile();
    }, [profile, fetchProfile]),
  );

  function handleLogout() {
    Alert.alert(
      "Log out",
      "Your ride history and EcoPoints will be saved for when you return.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: () => {
            tokenStore.clearCache();
            router.replace("/auth/login");
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top"]}
    >
      <ScrollView
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
          <ProfileCard profile={profile} />
        ) : null}

        {!hasActivity ? (
          <NoRidesEmptyState />
        ) : (
          <View style={{ gap: 12 }}>
            <EcoPointsPanel ecoPoints={ecoPoints} />
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
          <OngoingRideBanner ongoingRide={ongoingRide} variant="summary" />
        )}

        <Pressable
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          style={{
            height: 52,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.danger + "50",
            backgroundColor: colors.danger + "10",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StyledText variant="label" style={{ color: colors.danger }}>
            Log out
          </StyledText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

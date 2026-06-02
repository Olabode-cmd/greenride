import { Button } from "@/components/button";
import { RideCard } from "@/components/ride-card";
import { StyledText } from "@/components/styled-text";
import { useRideStore } from "@/stores/ride-store";
import { useUserStore } from "@/stores/user-store";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { rides, isLoading, selectedRide, fetchRides, selectRide } =
    useRideStore();
  const { ecoPoints } = useUserStore();

  useFocusEffect(
    useCallback(() => {
      fetchRides();
    }, [fetchRides]),
  );

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 48,
          paddingTop: 24,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ gap: 2 }}>
            <StyledText variant="caption" className="text-secondary">
              Good day 👋
            </StyledText>
            <StyledText variant="section" className="text-primary">
              Where to?
            </StyledText>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#1DB95420",
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <StyledText
              variant="caption"
              style={{ fontFamily: "DMSans_500Medium", color: "#1DB954" }}
            >
              🌿 {ecoPoints} pts
            </StyledText>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <StyledText variant="label" className="text-secondary">
            Available rides
          </StyledText>

          {isLoading ? (
            <View className="py-12 items-center">
              <ActivityIndicator color="#1DB954" />
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {rides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  selected={selectedRide?.id === ride.id}
                  onPress={selectRide}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View
        className="bg-bg"
        style={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
        }}
      >
        <Button
          label="Book Ride"
          variant="primary"
          haptic
          disabled={!selectedRide}
          onPress={() => router.push("/(protected)/ride-confirmation")}
        />
      </View>
    </SafeAreaView>
  );
}

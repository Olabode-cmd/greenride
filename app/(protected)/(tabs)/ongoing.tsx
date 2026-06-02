import { Button } from "@/components/button";
import { StyledText } from "@/components/styled-text";
import { useOngoingRideStore } from "@/stores/ongoing-ride-store";
import { useTheme } from "@/theme/use-theme";
import { VehicleCategory } from "@/types";
import { calculateEcoPoints } from "@/utils/eco-utils";
import { router } from "expo-router";
import {
  BicycleIcon,
  CarIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyNgnIcon,
  LeafIcon,
  LightningIcon,
  MapPinIcon,
  MotorcycleIcon,
  NavigationArrowIcon,
  StarIcon,
  UserIcon,
} from "phosphor-react-native";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

function VehicleIcon({
  category,
  color,
  size = 22,
}: {
  category: VehicleCategory;
  color: string;
  size?: number;
}) {
  const props = { size, color, weight: "regular" as const };
  if (category === VehicleCategory.Bike) return <BicycleIcon {...props} />;
  if (category === VehicleCategory.Scooter)
    return <MotorcycleIcon {...props} />;
  return <CarIcon {...props} />;
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}

function DetailRow({ icon, label, value, valueColor }: DetailRowProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {icon}
        <StyledText variant="caption" className="text-secondary">
          {label}
        </StyledText>
      </View>
      <StyledText
        variant="label"
        style={{ color: valueColor ?? colors.primary }}
      >
        {value}
      </StyledText>
    </View>
  );
}

function EmptyState() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        paddingHorizontal: 32,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          backgroundColor: colors.accentMuted,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.accent + "40",
        }}
      >
        <NavigationArrowIcon size={32} color={colors.accent} weight="fill" />
      </View>
      <View style={{ gap: 8, alignItems: "center" }}>
        <StyledText
          variant="section"
          className="text-primary"
          style={{ textAlign: "center" }}
        >
          No active ride
        </StyledText>
        <StyledText
          variant="body"
          className="text-secondary"
          style={{ textAlign: "center" }}
        >
          Book a ride on the home screen and it will appear here while it's in
          progress.
        </StyledText>
      </View>
      <Button
        label="Find a ride"
        variant="primary"
        rounded
        haptic
        fullWidth={true}
        onPress={() => router.navigate("/(protected)/(tabs)")}
      />
    </View>
  );
}

export default function OngoingScreen() {
  const { ongoingRide, endRide } = useOngoingRideStore();
  const { colors } = useTheme();

  if (!ongoingRide) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
        <View
          style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 }}
        >
          <StyledText variant="title" className="text-primary">
            Ongoing ride
          </StyledText>
        </View>
        <EmptyState />
      </SafeAreaView>
    );
  }

  const { ride, paymentReference, startedAt } = ongoingRide;
  const ecoPoints = calculateEcoPoints(ride.co2SavedKg);
  const isSelfRide = ride.driver.totalTrips === 0;
  const startTime = new Date(startedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  function handleEndRide() {
    Alert.alert("End ride", "Are you sure you want to end this ride?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End ride",
        style: "destructive",
        onPress: async () => {
          await endRide();
          Toast.show({
            type: "success",
            text1: "Ride completed",
            text2: `+${ecoPoints} EcoPoints earned`,
          });
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 16,
            gap: 4,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: colors.accent,
              }}
            />
            <StyledText
              variant="caption"
              style={{ color: colors.accent, fontFamily: "DMSans_500Medium" }}
            >
              In progress · started {startTime}
            </StyledText>
          </View>
          <StyledText variant="title" className="text-primary">
            Ongoing ride
          </StyledText>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: colors.accentMuted,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.accent + "40",
              }}
            >
              <VehicleIcon
                category={ride.vehicle.category}
                color={colors.accent}
                size={24}
              />
            </View>
            <View style={{ flex: 1 }}>
              <StyledText variant="section" className="text-primary">
                {ride.vehicle.make} {ride.vehicle.model}
              </StyledText>
              <StyledText variant="caption" className="text-secondary">
                {ride.vehicle.year} · {ride.vehicle.colour}
              </StyledText>
            </View>
            {ride.vehicle.rating >= 4.8 && (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <StarIcon size={14} color={colors.accent} weight="fill" />
                <StyledText variant="label" style={{ color: colors.accent }}>
                  {ride.vehicle.rating}
                </StyledText>
              </View>
            )}
          </View>

          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              gap: 14,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <StyledText variant="label" className="text-secondary">
              Trip details
            </StyledText>
            <DetailRow
              icon={
                <MapPinIcon size={16} color={colors.secondary} weight="fill" />
              }
              label="Destination"
              value={ride.destination.label}
            />
            <View style={{ height: 1, backgroundColor: colors.border }} />
            <DetailRow
              icon={
                <NavigationArrowIcon
                  size={16}
                  color={colors.secondary}
                  weight="fill"
                />
              }
              label="Distance"
              value={`${ride.destination.distanceKm} km`}
            />
            <View style={{ height: 1, backgroundColor: colors.border }} />
            <DetailRow
              icon={<ClockIcon size={16} color={colors.secondary} />}
              label="Duration"
              value={`${ride.durationMinutes} min`}
            />
            {!isSelfRide && (
              <>
                <View style={{ height: 1, backgroundColor: colors.border }} />
                <DetailRow
                  icon={<UserIcon size={16} color={colors.secondary} />}
                  label="Driver"
                  value={`${ride.driver.name} · ⭐ ${ride.driver.rating}`}
                />
              </>
            )}
            <View style={{ height: 1, backgroundColor: colors.border }} />
            <DetailRow
              icon={
                <LightningIcon
                  size={16}
                  color={colors.secondary}
                  weight="fill"
                />
              }
              label="Propulsion"
              value={ride.vehicle.propulsion}
            />
          </View>

          <View
            style={{
              backgroundColor: colors.accentMuted,
              borderRadius: 16,
              padding: 16,
              gap: 12,
              borderWidth: 1,
              borderColor: colors.accent + "30",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <LeafIcon size={16} color={colors.accent} weight="fill" />
              <StyledText variant="label" style={{ color: colors.accent }}>
                Eco impact
              </StyledText>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}
            >
              <StyledText variant="display" style={{ color: colors.accent }}>
                {ride.co2SavedKg.toFixed(2)}
              </StyledText>
              <StyledText variant="body" style={{ color: colors.accent }}>
                kg CO₂ saved
              </StyledText>
            </View>
            <StyledText
              variant="caption"
              style={{ color: colors.accent + "CC" }}
            >
              {ride.co2ComparisonLabel}
            </StyledText>
            <View
              style={{ height: 1, backgroundColor: colors.accent + "30" }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <StyledText
                variant="caption"
                style={{ color: colors.accent + "CC" }}
              >
                EcoPoints earned
              </StyledText>
              <StyledText variant="label" style={{ color: colors.accent }}>
                +{ecoPoints} pts
              </StyledText>
            </View>
          </View>

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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <CurrencyNgnIcon size={20} color={colors.secondary} />
                <StyledText variant="label" className="text-secondary">
                  Paid
                </StyledText>
              </View>
              <StyledText variant="title" style={{ color: colors.primary }}>
                ₦{ride.priceNgn.toLocaleString()}
              </StyledText>
            </View>
            <View style={{ height: 1, backgroundColor: colors.border }} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <StyledText variant="caption" className="text-secondary">
                Reference
              </StyledText>
              <StyledText
                variant="caption"
                style={{
                  fontFamily: "DMSans_500Medium",
                  color: colors.primary,
                }}
              >
                {paymentReference}
              </StyledText>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 16,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.bg,
        }}
      >
        <Button
          label="End ride"
          variant="primary"
          rounded
          haptic
          leftIcon={
            <CheckCircleIcon size={18} color={colors.bg} weight="fill" />
          }
          onPress={handleEndRide}
        />
      </View>
    </SafeAreaView>
  );
}

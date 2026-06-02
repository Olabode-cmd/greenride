import { Button } from "@/components/button";
import { StyledText } from "@/components/styled-text";
import { simulatePayment } from "@/services/payment-service";
import { useOngoingRideStore } from "@/stores/ongoing-ride-store";
import { useRideStore } from "@/stores/ride-store";
import { useUserStore } from "@/stores/user-store";
import { useTheme } from "@/theme/use-theme";
import { Ride, VehicleCategory } from "@/types";
import { calculateEcoPoints } from "@/utils/eco-utils";
import { router } from "expo-router";
import {
    BicycleIcon,
    CarIcon,
    ClockIcon,
    CurrencyNgnIcon,
    LeafIcon,
    LightningIcon,
    MapPinIcon,
    MotorcycleIcon as ScooterIcon,
    StarIcon,
    UserIcon,
} from "phosphor-react-native";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";

/*
 * Builds a self-contained Leaflet HTML page centred on the given
 * coordinates. All assets are loaded from CDN so no API key is needed.
 * Interaction is disabled — the map is purely decorative.
 */
function buildLeafletHtml(lat: number, lng: number, accentColor: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map', {
      center: [${lat}, ${lng}],
      zoom: 15,
      zoomControl: false,
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const icon = L.divIcon({
      html: '<div style="width:14px;height:14px;border-radius:50%;background:${accentColor};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      className: '',
    });

    L.marker([${lat}, ${lng}], { icon }).addTo(map);
  </script>
</body>
</html>
  `.trim();
}

function VehicleIcon({
  category,
  color,
  size = 20,
}: {
  category: VehicleCategory;
  color: string;
  size?: number;
}) {
  const props = { size, color, weight: "regular" as const };
  if (category === VehicleCategory.Bike) return <BicycleIcon {...props} />;
  if (category === VehicleCategory.Scooter) return <ScooterIcon {...props} />;
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

export default function RideConfirmationScreen() {
  const { selectedRide, clearSelection } = useRideStore();
  const { recordBooking } = useUserStore();
  const { setOngoing } = useOngoingRideStore();
  const { colors } = useTheme();
  const [paying, setPaying] = useState(false);

  if (!selectedRide) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StyledText variant="body" className="text-secondary">
          No ride selected.
        </StyledText>
        <Button
          label="Go back"
          variant="ghost"
          fullWidth={false}
          onPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const ride: Ride = selectedRide;
  const ecoPointsToEarn = calculateEcoPoints(ride.co2SavedKg);
  const isSelfRide = ride.driver.totalTrips === 0;

  async function handleConfirm() {
    setPaying(true);
    try {
      const result = await simulatePayment(ride.priceNgn);
      if (result.status === "success") {
        await setOngoing(ride, result.reference);
        recordBooking(ride);
        clearSelection();
        Toast.show({
          type: "success",
          text1: "Ride booked",
          text2: `Ref: ${result.reference} · +${ecoPointsToEarn} EcoPoints`,
        });
        router.replace("/(protected)/(tabs)/ongoing");
      } else {
        Toast.show({
          type: "error",
          text1: "Payment failed",
          text2: "Please try again.",
        });
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Payment error",
        text2: "Something went wrong.",
      });
    } finally {
      setPaying(false);
    }
  }

  function handleCancel() {
    Alert.alert(
      "Cancel booking",
      "Are you sure you want to cancel this ride?",
      [
        { text: "Stay", style: "cancel" },
        {
          text: "Cancel booking",
          style: "destructive",
          onPress: () => router.back(),
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
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Leaflet OSM map — no API key required */}
        <View style={{ height: 220, backgroundColor: colors.surface }}>
          <WebView
            style={{ flex: 1 }}
            source={{
              html: buildLeafletHtml(
                ride.destination.latitude,
                ride.destination.longitude,
                colors.accent,
              ),
            }}
            scrollEnabled={false}
            javaScriptEnabled
            originWhitelist={["*"]}
          />
        </View>

        <View style={{ padding: 16, gap: 20 }}>
          {/* Vehicle header */}
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

          {/* Trip details */}
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
              icon={<ClockIcon size={16} color={colors.secondary} />}
              label="ETA"
              value={`${ride.etaMinutes} min away`}
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

          {/* Eco impact */}
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
                EcoPoints to earn
              </StyledText>
              <StyledText variant="label" style={{ color: colors.accent }}>
                +{ecoPointsToEarn} pts
              </StyledText>
            </View>
          </View>

          {/* Fare */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
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
                Total fare
              </StyledText>
            </View>
            <StyledText variant="title" style={{ color: colors.primary }}>
              ₦{ride.priceNgn.toLocaleString()}
            </StyledText>
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
          gap: 10,
        }}
      >
        <Button
          label={paying ? "Opening payment…" : "Confirm & Pay"}
          variant="primary"
          rounded
          haptic
          loading={paying}
          onPress={handleConfirm}
        />
        <Button
          label="Cancel"
          variant="ghost"
          rounded
          disabled={paying}
          onPress={handleCancel}
        />
      </View>
    </SafeAreaView>
  );
}

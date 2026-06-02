import { useTheme } from "@/theme/use-theme";
import { Ride, VehicleCategory } from "@/types";
import {
  BicycleIcon,
  CarIcon,
  LeafIcon,
  MotorcycleIcon,
} from "phosphor-react-native";
import { Pressable, View } from "react-native";
import { StyledText } from "./styled-text";

interface RideCardProps {
  ride: Ride;
  selected: boolean;
  onPress: (ride: Ride) => void;
}

function VehicleIcon({
  category,
  color,
}: {
  category: VehicleCategory;
  color: string;
}) {
  const props = { size: 24, color, weight: "regular" as const };
  if (category === VehicleCategory.Bike) return <BicycleIcon {...props} />;
  if (category === VehicleCategory.Scooter)
    return <MotorcycleIcon {...props} />;
  return <CarIcon {...props} />;
}

export function RideCard({ ride, selected, onPress }: RideCardProps) {
  const { colors } = useTheme();
  const isSelfRide = ride.driver.totalTrips === 0;

  return (
    <Pressable
      onPress={() => onPress(ride)}
      accessibilityRole="button"
      accessibilityLabel={`${ride.vehicle.make} ${ride.vehicle.model}, $${ride.priceUsd}, ${ride.etaMinutes} min ETA`}
      accessibilityState={{ selected }}
      style={{
        borderColor: selected ? colors.accent : colors.border,
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: selected ? colors.surfaceRaised : colors.surface,
        padding: 16,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: colors.accentMuted,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <VehicleIcon category={ride.vehicle.category} color={colors.accent} />
        </View>

        <View style={{ flex: 1, gap: 2 }}>
          <StyledText variant="label" className="text-primary">
            {ride.vehicle.make} {ride.vehicle.model}
          </StyledText>
          <StyledText variant="caption" className="text-secondary">
            {ride.destination.label} · {ride.destination.distanceKm} km
            {!isSelfRide && ` · ${ride.driver.name}`}
          </StyledText>
        </View>

        <View style={{ alignItems: "flex-end", gap: 2 }}>
          <StyledText variant="label" className="text-primary">
            ${ride.priceUsd.toFixed(2)}
          </StyledText>
          <StyledText variant="caption" className="text-secondary">
            {ride.etaMinutes} min away
          </StyledText>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: colors.accentMuted,
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <LeafIcon size={14} color={colors.accent} weight="fill" />
          <StyledText
            variant="caption"
            style={{ color: colors.accent, fontFamily: "DMSans_500Medium" }}
          >
            {ride.co2SavedKg} kg CO₂ saved
          </StyledText>
        </View>

        <StyledText variant="caption" className="text-secondary">
          {ride.durationMinutes} min ride
        </StyledText>
      </View>
    </Pressable>
  );
}

import { useTheme } from "@/theme/use-theme";
import { Ride, VehicleCategory } from "@/types";
import {
  BicycleIcon,
  CarIcon,
  ClockIcon,
  LeafIcon,
  MotorcycleIcon,
  NavigationArrowIcon,
  StarIcon,
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
  const props = { size: 22, color, weight: "regular" as const };
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
      accessibilityLabel={`${ride.vehicle.make} ${ride.vehicle.model}, ₦${ride.priceNgn.toLocaleString()}, ${ride.etaMinutes} min ETA`}
      accessibilityState={{ selected }}
      style={{
        borderColor: selected ? colors.accent : colors.border,
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: selected ? colors.surfaceRaised : colors.surface,
        overflow: "hidden",
      }}
    >
      {selected && (
        <View
          style={{
            height: 3,
            backgroundColor: colors.accent,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        />
      )}

      <View style={{ padding: 16, gap: 14 }}>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: selected
                ? colors.accent + "25"
                : colors.accentMuted,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: selected ? colors.accent + "50" : "transparent",
            }}
          >
            <VehicleIcon
              category={ride.vehicle.category}
              color={colors.accent}
            />
          </View>

          <View style={{ flex: 1, gap: 3 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <StyledText variant="label" className="text-primary">
                {ride.vehicle.make} {ride.vehicle.model}
              </StyledText>
              {ride.vehicle.rating >= 4.8 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: colors.accentMuted,
                    borderRadius: 999,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}
                >
                  <StarIcon size={10} color={colors.accent} weight="fill" />
                  <StyledText
                    variant="caption"
                    style={{
                      color: colors.accent,
                      fontSize: 10,
                      fontFamily: "DMSans_500Medium",
                    }}
                  >
                    {ride.vehicle.rating}
                  </StyledText>
                </View>
              )}
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <NavigationArrowIcon
                size={11}
                color={colors.secondary}
                weight="fill"
              />
              <StyledText variant="caption" className="text-secondary">
                {ride.destination.label} · {ride.destination.distanceKm} km
              </StyledText>
            </View>

            {!isSelfRide && (
              <StyledText
                variant="caption"
                style={{ color: colors.disabled, fontSize: 11 }}
              >
                {ride.driver.name} · ⭐ {ride.driver.rating}
              </StyledText>
            )}
          </View>

          <View style={{ alignItems: "flex-end", gap: 4 }}>
            <StyledText
              variant="section"
              style={{ fontSize: 18, color: colors.primary }}
            >
              ₦{ride.priceNgn.toLocaleString()}
            </StyledText>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            >
              <ClockIcon size={11} color={colors.secondary} weight="regular" />
              <StyledText variant="caption" className="text-secondary">
                {ride.etaMinutes} min
              </StyledText>
            </View>
          </View>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: selected ? colors.accent + "20" : colors.border,
          }}
        />

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
              gap: 5,
              backgroundColor: colors.accentMuted,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <LeafIcon size={12} color={colors.accent} weight="fill" />
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
      </View>
    </Pressable>
  );
}

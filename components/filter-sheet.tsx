import { Sheet } from "@/components/bottom-sheet";
import { StyledText } from "@/components/styled-text";
import { useTheme } from "@/theme/use-theme";
import { PropulsionType, VehicleCategory } from "@/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { XIcon } from "phosphor-react-native";
import { forwardRef } from "react";
import { Pressable, View } from "react-native";

export interface RideFilters {
  categories: VehicleCategory[];
  propulsions: PropulsionType[];
  maxPrice: number | null;
  maxEta: number | null;
  minCo2Saved: number | null;
  selfRideOnly: boolean;
}

export const DEFAULT_FILTERS: RideFilters = {
  categories: [],
  propulsions: [],
  maxPrice: null,
  maxEta: null,
  minCo2Saved: null,
  selfRideOnly: false,
};

interface FilterSheetProps {
  filters: RideFilters;
  onChange: (filters: RideFilters) => void;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<VehicleCategory, string> = {
  [VehicleCategory.Bike]: "Bike",
  [VehicleCategory.Scooter]: "Scooter",
  [VehicleCategory.Car]: "Car",
};

const PROPULSION_LABELS: Record<PropulsionType, string> = {
  [PropulsionType.HumanPowered]: "Human powered",
  [PropulsionType.Electric]: "Electric",
  [PropulsionType.Hybrid]: "Hybrid",
};

const PRICE_OPTIONS = [2000, 5000, 10000, 15000];
const ETA_OPTIONS = [3, 5, 8, 15];
const CO2_OPTIONS = [1, 2, 3, 4];

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function Chip({ label, active, onPress }: ChipProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: active }}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? colors.accent : colors.border,
        backgroundColor: active ? colors.accentMuted : "transparent",
      }}
    >
      <StyledText
        variant="caption"
        style={{
          color: active ? colors.accent : colors.secondary,
          fontFamily: "DMSans_500Medium",
        }}
      >
        {label}
      </StyledText>
    </Pressable>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <StyledText
      variant="caption"
      className="text-secondary"
      style={{ fontFamily: "DMSans_500Medium", marginBottom: 8 }}
    >
      {children}
    </StyledText>
  );
}

function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

export const FilterSheet = forwardRef<BottomSheetModal, FilterSheetProps>(
  function FilterSheet({ filters, onChange, onClose }, ref) {
    const { colors } = useTheme();

    const hasActiveFilters =
      filters.categories.length > 0 ||
      filters.propulsions.length > 0 ||
      filters.maxPrice !== null ||
      filters.maxEta !== null ||
      filters.minCo2Saved !== null ||
      filters.selfRideOnly;

    return (
      <Sheet ref={ref} enableDynamicSizing>
        <View style={{ gap: 24 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <StyledText variant="section" className="text-primary">
              Filter rides
            </StyledText>
            <View
              style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
            >
              {hasActiveFilters && (
                <Pressable
                  onPress={() => onChange(DEFAULT_FILTERS)}
                  accessibilityLabel="Clear all filters"
                >
                  <StyledText
                    variant="caption"
                    style={{
                      color: colors.accent,
                      fontFamily: "DMSans_500Medium",
                    }}
                  >
                    Clear all
                  </StyledText>
                </Pressable>
              )}
              <Pressable
                onPress={onClose}
                hitSlop={8}
                accessibilityLabel="Close filter sheet"
              >
                <XIcon size={20} color={colors.secondary} />
              </Pressable>
            </View>
          </View>

          <View>
            <SectionLabel>Vehicle type</SectionLabel>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {Object.values(VehicleCategory).map((cat) => (
                <Chip
                  key={cat}
                  label={CATEGORY_LABELS[cat]}
                  active={filters.categories.includes(cat)}
                  onPress={() =>
                    onChange({
                      ...filters,
                      categories: toggleItem(filters.categories, cat),
                    })
                  }
                />
              ))}
            </View>
          </View>

          <View>
            <SectionLabel>Propulsion</SectionLabel>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {Object.values(PropulsionType).map((prop) => (
                <Chip
                  key={prop}
                  label={PROPULSION_LABELS[prop]}
                  active={filters.propulsions.includes(prop)}
                  onPress={() =>
                    onChange({
                      ...filters,
                      propulsions: toggleItem(filters.propulsions, prop),
                    })
                  }
                />
              ))}
            </View>
          </View>

          <View>
            <SectionLabel>Max price</SectionLabel>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {PRICE_OPTIONS.map((p) => (
                <Chip
                  key={p}
                  label={`≤ ₦${p.toLocaleString()}`}
                  active={filters.maxPrice === p}
                  onPress={() =>
                    onChange({
                      ...filters,
                      maxPrice: filters.maxPrice === p ? null : p,
                    })
                  }
                />
              ))}
            </View>
          </View>

          <View>
            <SectionLabel>Max ETA</SectionLabel>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {ETA_OPTIONS.map((eta) => (
                <Chip
                  key={eta}
                  label={`≤ ${eta} min`}
                  active={filters.maxEta === eta}
                  onPress={() =>
                    onChange({
                      ...filters,
                      maxEta: filters.maxEta === eta ? null : eta,
                    })
                  }
                />
              ))}
            </View>
          </View>

          <View>
            <SectionLabel>Min CO₂ saved</SectionLabel>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {CO2_OPTIONS.map((co2) => (
                <Chip
                  key={co2}
                  label={`≥ ${co2} kg`}
                  active={filters.minCo2Saved === co2}
                  onPress={() =>
                    onChange({
                      ...filters,
                      minCo2Saved: filters.minCo2Saved === co2 ? null : co2,
                    })
                  }
                />
              ))}
            </View>
          </View>

          <View>
            <SectionLabel>Ride type</SectionLabel>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Chip
                label="Self-ride only"
                active={filters.selfRideOnly}
                onPress={() =>
                  onChange({ ...filters, selfRideOnly: !filters.selfRideOnly })
                }
              />
            </View>
          </View>
        </View>
      </Sheet>
    );
  },
);

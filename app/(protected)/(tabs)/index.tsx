import { Button } from "@/components/button";
import {
    DEFAULT_FILTERS,
    FilterSheet,
    RideFilters,
} from "@/components/filter-sheet";
import { RideCard } from "@/components/ride-card";
import { StyledText } from "@/components/styled-text";
import { useRideStore } from "@/stores/ride-store";
import { useUserStore } from "@/stores/user-store";
import { useTheme } from "@/theme/use-theme";
import { Ride } from "@/types";
import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { router, useFocusEffect } from "expo-router";
import { FunnelIcon, LeafIcon } from "phosphor-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    TextInput,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);

  /*
   * useEffect is permitted here — it sets up a timer subscription
   * that depends on an external value changing over time.
   */
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = useCallback(
    (v: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setDebounced(v), delay);
    },
    [delay],
  );

  useFocusEffect(
    useCallback(() => {
      update(value);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [value, update]),
  );

  return debounced;
}

function applyFilters(
  rides: Ride[],
  query: string,
  filters: RideFilters,
): Ride[] {
  let result = rides;

  if (query.length > 0) {
    const q = query.toLowerCase();
    result = result.filter(
      (r) =>
        r.vehicle.make.toLowerCase().includes(q) ||
        r.vehicle.model.toLowerCase().includes(q) ||
        r.destination.label.toLowerCase().includes(q) ||
        r.vehicle.category.toLowerCase().includes(q),
    );
  }

  if (filters.categories.length > 0) {
    result = result.filter((r) =>
      filters.categories.includes(r.vehicle.category),
    );
  }

  if (filters.propulsions.length > 0) {
    result = result.filter((r) =>
      filters.propulsions.includes(r.vehicle.propulsion),
    );
  }

  if (filters.maxPrice !== null) {
    result = result.filter((r) => r.priceNgn <= filters.maxPrice!);
  }

  if (filters.maxEta !== null) {
    result = result.filter((r) => r.etaMinutes <= filters.maxEta!);
  }

  if (filters.minCo2Saved !== null) {
    result = result.filter((r) => r.co2SavedKg >= filters.minCo2Saved!);
  }

  if (filters.selfRideOnly) {
    result = result.filter((r) => r.driver.totalTrips === 0);
  }

  return result;
}

export default function HomeScreen() {
  const { rides, isLoading, selectedRide, fetchRides, selectRide } =
    useRideStore();
  const { ecoPoints } = useUserStore();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<RideFilters>(DEFAULT_FILTERS);
  const filterSheetRef = useRef<BottomSheetModal>(null);

  const debouncedQuery = useDebounce(searchText, 300);

  const filteredRides = useMemo(
    () => applyFilters(rides, debouncedQuery, filters),
    [rides, debouncedQuery, filters],
  );

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.propulsions.length > 0 ||
    filters.maxPrice !== null ||
    filters.maxEta !== null ||
    filters.minCo2Saved !== null ||
    filters.selfRideOnly;

  useFocusEffect(
    useCallback(() => {
      fetchRides();
    }, [fetchRides]),
  );

  return (
    <BottomSheetModalProvider>
      <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 48, paddingTop: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ paddingHorizontal: 16, gap: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ gap: 2 }}>
                <StyledText variant="body" className="text-secondary">
                  Good day
                </StyledText>
                <StyledText variant="title" className="text-primary">
                  Where to?
                </StyledText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  backgroundColor: colors.accentMuted,
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderWidth: 1,
                  borderColor: colors.accent + "30",
                }}
              >
                <LeafIcon size={13} color={colors.accent} weight="fill" />
                <StyledText
                  variant="caption"
                  style={{
                    fontFamily: "DMSans_500Medium",
                    color: colors.accent,
                  }}
                >
                  {ecoPoints} pts
                </StyledText>
              </View>
            </View>

            {/*
             * Search bar with inline filter button.
             * The filter dot badge indicates active filters are applied.
             */}
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
                value={searchText}
                onChangeText={setSearchText}
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
                onPress={() => filterSheetRef.current?.present()}
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
                  borderColor: hasActiveFilters
                    ? colors.accent + "60"
                    : colors.border,
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
          </View>

          <View style={{ paddingHorizontal: 16, marginTop: 20, gap: 8 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <StyledText variant="label" className="text-secondary">
                {filteredRides.length} ride
                {filteredRides.length !== 1 ? "s" : ""} available
              </StyledText>
              {hasActiveFilters && (
                <Pressable onPress={() => setFilters(DEFAULT_FILTERS)}>
                  <StyledText
                    variant="caption"
                    style={{
                      color: colors.accent,
                      fontFamily: "DMSans_500Medium",
                    }}
                  >
                    Clear filters
                  </StyledText>
                </Pressable>
              )}
            </View>

            {isLoading ? (
              <View style={{ paddingVertical: 48, alignItems: "center" }}>
                <ActivityIndicator color={colors.accent} />
              </View>
            ) : filteredRides.length === 0 ? (
              <View
                style={{ paddingVertical: 48, alignItems: "center", gap: 8 }}
              >
                <StyledText
                  variant="body"
                  className="text-secondary"
                  style={{ textAlign: "center" }}
                >
                  No rides match your search.
                </StyledText>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {filteredRides.map((ride) => (
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
          style={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.bg,
          }}
        >
          <Button
            label="Book Ride"
            variant="primary"
            rounded
            haptic
            disabled={!selectedRide}
            onPress={() => router.push("/(protected)/ride-confirmation")}
          />
        </View>
      </SafeAreaView>

      <FilterSheet
        ref={filterSheetRef}
        filters={filters}
        onChange={setFilters}
        onClose={() => filterSheetRef.current?.dismiss()}
      />
    </BottomSheetModalProvider>
  );
}

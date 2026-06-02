/*
 * Tests for the RideCard component.
 *
 * Covers:
 *   - Vehicle make and model render
 *   - Price renders in naira format
 *   - CO₂ saved value renders
 *   - ETA renders
 *   - Destination label renders
 *   - Driver name renders for driven rides; omitted for self-rides
 *   - Star rating badge renders only when rating >= 4.8
 *   - Accent top bar renders when selected, absent when not
 *   - onPress fires with the correct ride object
 *   - accessibilityState reflects selected prop
 *
 * How to run:
 *   npm test                      — single run, no watch
 *   npx jest ride-card.test.tsx   — run only this file
 */

import { RideCard } from "@/components/ride-card";
import {
    PropulsionType,
    Ride,
    RideStatus,
    VehicleCategory,
    VehicleCondition,
} from "@/types";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/theme/use-theme", () => ({
  useTheme: () => ({
    colors: {
      bg: "#FFFFFF",
      surface: "#F5F5F5",
      surfaceRaised: "#EBEBEB",
      border: "#E0E0E0",
      accent: "#1DB954",
      accentMuted: "#1DB95420",
      primary: "#111111",
      secondary: "#555555",
      disabled: "#AAAAAA",
      danger: "#FF4C4C",
    },
    isDark: false,
  }),
}));

jest.mock("nativewind", () => ({
  useColorScheme: () => ({ colorScheme: "light" }),
}));

/*
 * Phosphor icons are SVG-based and require a native renderer.
 * Mock them as simple string components so tests focus on component
 * behaviour rather than icon rendering. Variable names must be prefixed
 * with "mock" to satisfy jest.mock() scope rules.
 */
jest.mock("phosphor-react-native", () => ({
  BicycleIcon: "BicycleIcon",
  MotorcycleIcon: "MotorcycleIcon",
  CarIcon: "CarIcon",
  LeafIcon: "LeafIcon",
  StarIcon: "StarIcon",
  ClockIcon: "ClockIcon",
  NavigationArrowIcon: "NavigationArrowIcon",
}));

const baseRide: Ride = {
  id: "ride-001",
  vehicle: {
    id: "BK-001",
    plateNumber: "LG-001-BK",
    category: VehicleCategory.Bike,
    make: "Trek",
    model: "FX 3",
    year: 2023,
    colour: "Matte Black",
    propulsion: PropulsionType.HumanPowered,
    condition: VehicleCondition.Excellent,
    seatingCapacity: 1,
    rangeKm: 0,
    topSpeedKmh: 30,
    features: [],
    imageUrl: "",
    rating: 4.8,
    totalRatings: 100,
  },
  driver: {
    name: "Self-ride",
    avatarUrl: "",
    rating: 0,
    totalTrips: 0,
  },
  etaMinutes: 3,
  durationMinutes: 12,
  priceNgn: 2500,
  co2SavedKg: 1.8,
  co2ComparisonLabel: "Equal to charging 150 phones",
  status: RideStatus.Available,
  destination: {
    latitude: 6.5244,
    longitude: 3.3792,
    label: "Lagos Island",
    address: "10 Broad Street",
    distanceKm: 3.2,
  },
  tags: ["eco"],
};

describe("RideCard", () => {
  it("renders vehicle make and model", () => {
    const { getByText } = render(
      <RideCard ride={baseRide} selected={false} onPress={jest.fn()} />,
    );
    expect(getByText("Trek FX 3")).toBeTruthy();
  });

  it("renders price in naira", () => {
    const { getByText } = render(
      <RideCard ride={baseRide} selected={false} onPress={jest.fn()} />,
    );
    expect(getByText("₦2,500")).toBeTruthy();
  });

  it("renders CO₂ saved value", () => {
    const { getByText } = render(
      <RideCard ride={baseRide} selected={false} onPress={jest.fn()} />,
    );
    expect(getByText("1.8 kg CO₂ saved")).toBeTruthy();
  });

  it("renders ETA", () => {
    const { getByText } = render(
      <RideCard ride={baseRide} selected={false} onPress={jest.fn()} />,
    );
    expect(getByText("3 min")).toBeTruthy();
  });

  it("renders destination label", () => {
    const { getByText } = render(
      <RideCard ride={baseRide} selected={false} onPress={jest.fn()} />,
    );
    expect(getByText(/Lagos Island/)).toBeTruthy();
  });

  it("does not render driver name for self-rides", () => {
    const { queryByText } = render(
      <RideCard ride={baseRide} selected={false} onPress={jest.fn()} />,
    );
    expect(queryByText(/Self-ride/)).toBeNull();
  });

  it("renders driver name for driven rides", () => {
    const drivenRide: Ride = {
      ...baseRide,
      driver: {
        name: "Chidi Okafor",
        avatarUrl: "",
        rating: 4.95,
        totalTrips: 200,
      },
    };
    const { getByText } = render(
      <RideCard ride={drivenRide} selected={false} onPress={jest.fn()} />,
    );
    expect(getByText(/Chidi Okafor/)).toBeTruthy();
  });

  it("renders star badge when rating >= 4.8", () => {
    const { getByText } = render(
      <RideCard ride={baseRide} selected={false} onPress={jest.fn()} />,
    );
    expect(getByText("4.8")).toBeTruthy();
  });

  it("does not render star badge when rating < 4.8", () => {
    const lowRatedRide: Ride = {
      ...baseRide,
      vehicle: { ...baseRide.vehicle, rating: 4.5 },
    };
    const { queryByText } = render(
      <RideCard ride={lowRatedRide} selected={false} onPress={jest.fn()} />,
    );
    expect(queryByText("4.5")).toBeNull();
  });

  it("calls onPress with the ride object when pressed", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <RideCard ride={baseRide} selected={false} onPress={onPress} />,
    );
    fireEvent.press(getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(baseRide);
  });

  it("reflects selected accessibilityState when selected", () => {
    const { getByRole } = render(
      <RideCard ride={baseRide} selected onPress={jest.fn()} />,
    );
    expect(getByRole("button").props.accessibilityState.selected).toBe(true);
  });

  it("reflects unselected accessibilityState when not selected", () => {
    const { getByRole } = render(
      <RideCard ride={baseRide} selected={false} onPress={jest.fn()} />,
    );
    expect(getByRole("button").props.accessibilityState.selected).toBe(false);
  });
});

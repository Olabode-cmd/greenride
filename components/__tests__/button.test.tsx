/*
 * Tests for the Button component.
 *
 * Covers:
 *   - Label renders for all four variants
 *   - Loading state shows ActivityIndicator, hides label
 *   - Disabled state prevents onPress from firing
 *   - onPress fires when enabled
 *   - accessibilityLabel is applied
 *   - leftIcon and rightIcon render when provided
 *
 * How to run:
 *   npm test                  — single run, no watch
 *   npx jest button.test.tsx  — run only this file
 */

import { Button } from "@/components/button";
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

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light" },
}));

jest.mock("nativewind", () => ({
  useColorScheme: () => ({ colorScheme: "light" }),
}));

describe("Button", () => {
  it("renders the label", () => {
    const { getByText } = render(<Button label="Book Ride" />);
    expect(getByText("Book Ride")).toBeTruthy();
  });

  it("renders label for secondary variant", () => {
    const { getByText } = render(<Button label="Cancel" variant="secondary" />);
    expect(getByText("Cancel")).toBeTruthy();
  });

  it("renders label for ghost variant", () => {
    const { getByText } = render(<Button label="Back" variant="ghost" />);
    expect(getByText("Back")).toBeTruthy();
  });

  it("renders label for danger variant", () => {
    const { getByText } = render(<Button label="Delete" variant="danger" />);
    expect(getByText("Delete")).toBeTruthy();
  });

  it("shows ActivityIndicator and hides label when loading", () => {
    const { queryByText, UNSAFE_getByType } = render(
      <Button label="Book Ride" loading />,
    );
    expect(queryByText("Book Ride")).toBeNull();
    const { ActivityIndicator } = require("react-native");
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button label="Book Ride" onPress={onPress} />,
    );
    fireEvent.press(getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button label="Book Ride" onPress={onPress} disabled />,
    );
    fireEvent.press(getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("does not call onPress when loading", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button label="Book Ride" onPress={onPress} loading />,
    );
    fireEvent.press(getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("applies the correct accessibilityLabel", () => {
    const { getByLabelText } = render(<Button label="Confirm & Pay" />);
    expect(getByLabelText("Confirm & Pay")).toBeTruthy();
  });

  it("renders leftIcon when provided", () => {
    const LeftIcon = () => null;
    const { UNSAFE_getByType } = render(
      <Button label="Book Ride" leftIcon={<LeftIcon />} />,
    );
    expect(UNSAFE_getByType(LeftIcon)).toBeTruthy();
  });

  it("renders rightIcon when provided", () => {
    const RightIcon = () => null;
    const { UNSAFE_getByType } = render(
      <Button label="Book Ride" rightIcon={<RightIcon />} />,
    );
    expect(UNSAFE_getByType(RightIcon)).toBeTruthy();
  });
});

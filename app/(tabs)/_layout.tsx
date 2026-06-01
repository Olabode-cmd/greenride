/*
 * Bottom tab navigator.
 * Home and Profile tabs. Ride Confirmation is a stack screen, not a tab.
 * Icons from phosphor-react-native — weight switches between
 * "regular" (inactive) and "fill" (active) for a clean state toggle.
 */
import { useTheme } from "@/theme/use-theme";
import { Tabs } from "expo-router";
import { HouseIcon, UserIcon } from "phosphor-react-native";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.secondary,
        tabBarLabelStyle: {
          fontFamily: "DMSans_500Medium",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <HouseIcon
              size={26}
              color={color}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <UserIcon
              size={26}
              color={color}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

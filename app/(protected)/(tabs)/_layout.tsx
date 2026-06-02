import { useOngoingRideStore } from "@/stores/ongoing-ride-store";
import { useTheme } from "@/theme/use-theme";
import { Tabs } from "expo-router";
import {
    HouseIcon,
    NavigationArrowIcon,
    UserIcon,
} from "phosphor-react-native";
import { View } from "react-native";

export default function TabLayout() {
  const { colors } = useTheme();
  const ongoingRide = useOngoingRideStore((s) => s.ongoingRide);

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
        name="ongoing"
        options={{
          title: "Ongoing",
          tabBarIcon: ({ color, focused }) => (
            <View>
              <NavigationArrowIcon
                size={26}
                color={color}
                weight={focused ? "fill" : "regular"}
              />
              {ongoingRide && (
                <View
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -4,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.accent,
                  }}
                />
              )}
            </View>
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

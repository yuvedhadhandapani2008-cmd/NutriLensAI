import React from "react";

import { createBottomTabNavigator }
from "@react-navigation/bottom-tabs";

import Ionicons
from "@expo/vector-icons/Ionicons";

import HomeScreen from "./screens/HomeScreen";
import HistoryScreen from "./screens/HistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#111",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },

        tabBarActiveTintColor: "#00cc88",

        tabBarInactiveTintColor: "#888",

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          }

          else if (route.name === "History") {
            iconName = "time";
          }

          else if (route.name === "Profile") {
            iconName = "person";
          }

          return (
            <Ionicons
              name={iconName}
              size={24}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}
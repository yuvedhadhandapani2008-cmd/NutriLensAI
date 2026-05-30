import React from "react";

import {
  View,
  StyleSheet,
} from "react-native";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import Ionicons
from "@expo/vector-icons/Ionicons";

import {
  BlurView,
} from "expo-blur";

import HomeScreen
from "./screens/HomeScreen";

import DashboardScreen
from "./screens/DashboardScreen";

import HistoryScreen
from "./screens/HistoryScreen";

import AnalyticsScreen
from "./screens/AnalyticsScreen";

import ProfileScreen
from "./screens/ProfileScreen";

const Tab =
  createBottomTabNavigator();

function TabBarIcon({
  focused,
  name,
}) {
  return (
    <View
      style={[
        styles.iconContainer,

        focused &&
          styles.activeIconContainer,
      ]}
    >
      <Ionicons
        name={name}
        size={24}
        color={
          focused
            ? "#00d084"
            : "#7a7a7a"
        }
      />
    </View>
  );
}

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: false,

        tabBarStyle: {
          position: "absolute",

          bottom: 22,

          left: 18,

          right: 18,

          height: 78,

          borderRadius: 32,

          backgroundColor:
            "rgba(15,15,15,0.92)",

          borderTopWidth: 0,

          elevation: 0,

          shadowColor: "#000",

          shadowOffset: {
            width: 0,
            height: 10,
          },

          shadowOpacity: 0.35,

          shadowRadius: 20,
        },

        tabBarBackground: () => (
          <BlurView
            intensity={40}
            tint="dark"
            style={
              StyleSheet.absoluteFill
            }
          />
        ),
      }}
    >
      {/* HOME */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({
            focused,
          }) => (
            <TabBarIcon
              focused={focused}
              name={
                focused
                  ? "home"
                  : "home-outline"
              }
            />
          ),
        }}
      />

      {/* DASHBOARD */}
      <Tab.Screen
        name="Dashboard"
        component={
          DashboardScreen
        }
        options={{
          tabBarIcon: ({
            focused,
          }) => (
            <TabBarIcon
              focused={focused}
              name={
                focused
                  ? "speedometer"
                  : "speedometer-outline"
              }
            />
          ),
        }}
      />

      {/* HISTORY */}
      <Tab.Screen
        name="History"
        component={
          HistoryScreen
        }
        options={{
          tabBarIcon: ({
            focused,
          }) => (
            <TabBarIcon
              focused={focused}
              name={
                focused
                  ? "time"
                  : "time-outline"
              }
            />
          ),
        }}
      />

      {/* ANALYTICS */}
      <Tab.Screen
        name="Analytics"
        component={
          AnalyticsScreen
        }
        options={{
          tabBarIcon: ({
            focused,
          }) => (
            <TabBarIcon
              focused={focused}
              name={
                focused
                  ? "stats-chart"
                  : "stats-chart-outline"
              }
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tab.Screen
        name="Profile"
        component={
          ProfileScreen
        }
        options={{
          tabBarIcon: ({
            focused,
          }) => (
            <TabBarIcon
              focused={focused}
              name={
                focused
                  ? "person"
                  : "person-outline"
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles =
  StyleSheet.create({
    iconContainer: {
      width: 52,

      height: 52,

      borderRadius: 26,

      justifyContent:
        "center",

      alignItems: "center",
    },

    activeIconContainer: {
      backgroundColor:
        "rgba(0,208,132,0.15)",

      borderWidth: 1,

      borderColor:
        "rgba(0,208,132,0.25)",
    },
  });
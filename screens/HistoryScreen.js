import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import { LinearGradient }
from "expo-linear-gradient";

import { useFocusEffect }
from "@react-navigation/native";

import { getMeals }
from "../services/userData";

import {
  downloadMealScanReport,
} from "../services/reportService";

export default function HistoryScreen() {
  const [meals, setMeals] =
    useState([]);

  const [exportingId,
    setExportingId] =
    useState(null);

  const loadMeals =
    useCallback(async () => {
      try {
        const data =
          await getMeals();

        data.sort(
          (a, b) =>
            (b.createdAt
              ?.seconds || 0) -
            (a.createdAt
              ?.seconds || 0)
        );

        setMeals(data);

      } catch (error) {
        console.log(error);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [loadMeals])
  );

  const formatTime =
    (timestamp) => {
      if (!timestamp) return "";

      const date =
        new Date(
          timestamp.seconds *
            1000
        );

      return date.toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      );
    };

  const handleDownload =
    async (meal) => {
      setExportingId(meal.id);

      try {
        await downloadMealScanReport(
          meal
        );

        Alert.alert(
          "Report Downloaded",
          "PDF saved successfully to your device."
        );

      } catch (error) {
        console.log(error);

        Alert.alert(
          "Download Failed",
          "Could not generate report."
        );

      } finally {
        setExportingId(null);
      }
    };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={
        false
      }
    >
      <Text style={styles.title}>
        History
      </Text>

      {meals.map((meal) => (
        <LinearGradient
          key={meal.id}
          colors={[
            "#1A1F2E",
            "#121826",
          ]}
          style={styles.card}
        >
          <Image
            source={{
              uri: meal.image,
            }}
            style={styles.image}
          />

          {/* TOP ROW */}
          <View style={styles.topRow}>
            <View
              style={
                styles.badge
              }
            >
              <Text
                style={
                  styles.badgeText
                }
              >
                {meal.mealType ||
                  "Meal"}
              </Text>
            </View>

            <Text
              style={
                styles.time
              }
            >
              {formatTime(
                meal.createdAt
              )}
            </Text>
          </View>

          {/* TITLE */}
          <Text
            style={
              styles.mealTitle
            }
          >
            AI Nutrition Analysis
          </Text>

          {/* NUTRITION CHIPS */}
          <View
            style={
              styles.chipsRow
            }
          >
            <View
              style={[
                styles.chip,
                {
                  backgroundColor:
                    "#00E5A8",
                },
              ]}
            >
              <Text
                style={
                  styles.chipText
                }
              >
                Calories
              </Text>
            </View>

            <View
              style={[
                styles.chip,
                {
                  backgroundColor:
                    "#3B82F6",
                },
              ]}
            >
              <Text
                style={
                  styles.chipText
                }
              >
                Protein
              </Text>
            </View>

            <View
              style={[
                styles.chip,
                {
                  backgroundColor:
                    "#F59E0B",
                },
              ]}
            >
              <Text
                style={
                  styles.chipText
                }
              >
                Carbs
              </Text>
            </View>

            <View
              style={[
                styles.chip,
                {
                  backgroundColor:
                    "#EF4444",
                },
              ]}
            >
              <Text
                style={
                  styles.chipText
                }
              >
                Fats
              </Text>
            </View>
          </View>

          {/* RESULT */}
          <Text
            style={
              styles.result
            }
            numberOfLines={8}
          >
            {meal.result}
          </Text>

          {/* DOWNLOAD BUTTON */}
          <TouchableOpacity
            style={
              styles.downloadBtn
            }
            onPress={() =>
              handleDownload(
                meal
              )
            }
            disabled={
              exportingId ===
              meal.id
            }
          >
            {exportingId ===
            meal.id ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={
                  styles.downloadBtnText
                }
              >
                Download PDF Report
              </Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
      ))}

      <View
        style={{ height: 80 }}
      />
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#0B0F1A",

      paddingHorizontal: 20,
    },

    title: {
      color: "white",

      fontSize: 38,

      fontWeight: "bold",

      marginTop: 50,

      marginBottom: 30,

      letterSpacing: 0.5,
    },

    card: {
      borderRadius: 35,

      padding: 18,

      marginBottom: 28,

      borderWidth: 1,

      borderColor:
        "#1F2937",

      shadowColor: "#000",

      shadowOpacity: 0.3,

      shadowRadius: 12,

      elevation: 10,
    },

    image: {
      width: "100%",

      height: 240,

      borderRadius: 28,
    },

    topRow: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginTop: 18,
    },

    badge: {
      backgroundColor:
        "#00E5A8",

      paddingHorizontal: 16,

      paddingVertical: 8,

      borderRadius: 30,
    },

    badgeText: {
      color: "#000",

      fontWeight: "bold",

      fontSize: 13,
    },

    time: {
      color: "#8A93A7",

      fontSize: 14,
    },

    mealTitle: {
      color: "white",

      fontSize: 24,

      fontWeight: "bold",

      marginTop: 18,

      marginBottom: 18,
    },

    chipsRow: {
      flexDirection: "row",

      flexWrap: "wrap",

      marginBottom: 18,
    },

    chip: {
      paddingHorizontal: 14,

      paddingVertical: 8,

      borderRadius: 20,

      marginRight: 10,

      marginBottom: 10,
    },

    chipText: {
      color: "white",

      fontWeight: "bold",

      fontSize: 12,
    },

    result: {
      color: "#D1D5DB",

      lineHeight: 24,

      fontSize: 15,
    },

    downloadBtn: {
      backgroundColor:
        "#00E5A8",

      paddingVertical: 18,

      borderRadius: 22,

      alignItems: "center",

      marginTop: 25,

      shadowColor:
        "#00E5A8",

      shadowOpacity: 0.4,

      shadowRadius: 10,

      elevation: 8,
    },

    downloadBtnText: {
      color: "#000",

      fontWeight: "bold",

      fontSize: 16,
    },
  });


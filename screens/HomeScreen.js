import React, {
  useState,
  useEffect,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { LinearGradient }
from "expo-linear-gradient";

import * as ImagePicker
from "expo-image-picker";

import * as FileSystem
from "expo-file-system/legacy";

import { analyzeFoodImage }
from "../gemini";

import {
  getProfile,
  addMeal,
  getMeals,
  syncTodayStats,
} from "../services/userData";

export default function HomeScreen({
  navigation,
}) {
  const [image,
    setImage] =
    useState(null);

  const [loading,
    setLoading] =
    useState(false);

  const [profile,
    setProfile] =
    useState({
      goal: "Muscle Gain",
      weight: 70,
      height: 170,
      bmi: 24,
      activityLevel: "Moderate",
    });

  useEffect(() => {
    const loadProfile =
      async () => {
        try {
          const data =
            await getProfile();

          if (data) {
            setProfile(data);
          }
        } catch (e) {
          console.log(e);
        }
      };

    loadProfile();
  }, []);

  const analyzeImage =
    async (imageUri) => {
      try {
        setLoading(true);

        setImage(imageUri);

        const base64 =
          await FileSystem.readAsStringAsync(
            imageUri,
            {
              encoding:
                FileSystem.EncodingType
                  .Base64,
            }
          );

        const result =
          await analyzeFoodImage(
            base64,
            profile
          );

        if (!result) {
          setLoading(false);

          alert(
            "AI analysis failed."
          );

          return;
        }

        let detectedMeal =
          "snacks";

        const lower =
          result.toLowerCase();

        if (
          lower.includes(
            "breakfast"
          )
        ) {
          detectedMeal =
            "breakfast";

        } else if (
          lower.includes(
            "lunch"
          )
        ) {
          detectedMeal =
            "lunch";

        } else if (
          lower.includes(
            "dinner"
          )
        ) {
          detectedMeal =
            "dinner";

        } else if (
          lower.includes(
            "dessert"
          )
        ) {
          detectedMeal =
            "dessert";
        }

        await addMeal({
          image: imageUri,
          result:
            result ||
            "No analysis",
          mealType:
            detectedMeal,
        });

        const updatedProfile =
          await getProfile();

        const allMeals =
          await getMeals();

        if (
          updatedProfile
        ) {
          await syncTodayStats(
            updatedProfile,
            allMeals
          );
        }

        setLoading(false);

        navigation.navigate(
          "Result",
          {
            image:
              imageUri,
            result,
          }
        );

      } catch (error) {
        console.log(error);

        setLoading(false);

        alert(
          error.message ||
            "AI analysis failed"
        );
      }
    };

  const pickImage =
    async () => {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (
        !permissionResult.granted
      ) {
        alert(
          "Gallery permission required"
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync(
          {
            quality: 1,
          }
        );

      if (
        !result.canceled
      ) {
        analyzeImage(
          result.assets[0]
            .uri
        );
      }
    };

  const openCamera =
    async () => {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (
        !permissionResult.granted
      ) {
        alert(
          "Camera permission required"
        );

        return;
      }

      const result =
        await ImagePicker.launchCameraAsync(
          {
            quality: 1,
          }
        );

      if (
        !result.canceled
      ) {
        analyzeImage(
          result.assets[0]
            .uri
        );
      }
    };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={
        false
      }
    >
      {/* HERO */}
      <LinearGradient
        colors={[
          "#1A1F2E",
          "#121826",
        ]}
        style={styles.heroCard}
      >
        <Text
          style={styles.title}
        >
          NutriLens AI
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          AI-powered nutrition
          tracking for smarter,
          healthier eating.
        </Text>

        {/* USER STATS */}
        <View
          style={
            styles.statsRow
          }
        >
          <View
            style={
              styles.statCard
            }
          >
            <Text
              style={
                styles.statValue
              }
            >
              {profile.weight}
            </Text>

            <Text
              style={
                styles.statLabel
              }
            >
              Weight
            </Text>
          </View>

          <View
            style={
              styles.statCard
            }
          >
            <Text
              style={
                styles.statValue
              }
            >
              {profile.bmi}
            </Text>

            <Text
              style={
                styles.statLabel
              }
            >
              BMI
            </Text>
          </View>

          <View
            style={
              styles.statCard
            }
          >
            <Text
              style={
                styles.statValue
              }
            >
              {profile.goal}
            </Text>

            <Text
              style={
                styles.statLabel
              }
            >
              Goal
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* AI CARD */}
      <LinearGradient
        colors={[
          "#151B2D",
          "#0F172A",
        ]}
        style={styles.scanCard}
      >
        <Text
          style={
            styles.scanTitle
          }
        >
          AI Meal Scanner
        </Text>

        <Text
          style={
            styles.scanText
          }
        >
          Capture or upload a
          meal photo to receive
          detailed nutrition,
          ingredient-level
          breakdown, macros,
          micros, and gym
          recommendations.
        </Text>

        {/* BUTTONS */}
        <TouchableOpacity
          style={
            styles.uploadButton
          }
          onPress={pickImage}
        >
          <Text
            style={
              styles.buttonText
            }
          >
            Upload Food
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            styles.cameraButton
          }
          onPress={openCamera}
        >
          <Text
            style={
              styles.buttonText
            }
          >
            Capture Meal
          </Text>
        </TouchableOpacity>

        {loading && (
          <View
            style={
              styles.loadingBox
            }
          >
            <ActivityIndicator
              size="large"
              color="#00E5A8"
            />

            <Text
              style={
                styles.loadingText
              }
            >
              AI analyzing your
              meal...
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* FEATURES */}
      <Text
        style={
          styles.sectionTitle
        }
      >
        Features
      </Text>

      <View
        style={
          styles.featuresGrid
        }
      >
        <FeatureCard
          emoji="🔥"
          title="Macro Tracking"
        />

        <FeatureCard
          emoji="💧"
          title="Water Tracking"
        />

        <FeatureCard
          emoji="📈"
          title="Weekly Analytics"
        />

        <FeatureCard
          emoji="🤝"
          title="Partner Fitness"
        />
      </View>

      {/* RECENT SCAN */}
      {image && (
        <>
          <Text
            style={
              styles.sectionTitle
            }
          >
            Recent Scan
          </Text>

          <Image
            source={{
              uri: image,
            }}
            style={
              styles.previewImage
            }
          />
        </>
      )}

      <View
        style={{
          height: 80,
        }}
      />
    </ScrollView>
  );
}

function FeatureCard({
  emoji,
  title,
}) {
  return (
    <View
      style={
        styles.featureCard
      }
    >
      <Text
        style={
          styles.featureEmoji
        }
      >
        {emoji}
      </Text>

      <Text
        style={
          styles.featureTitle
        }
      >
        {title}
      </Text>
    </View>
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

    heroCard: {
      borderRadius: 35,

      padding: 28,

      marginTop: 50,

      borderWidth: 1,

      borderColor:
        "#1F2937",
    },

    title: {
      color: "white",

      fontSize: 42,

      fontWeight: "bold",

      letterSpacing: 0.5,
    },

    subtitle: {
      color: "#8A93A7",

      fontSize: 16,

      lineHeight: 28,

      marginTop: 12,
    },

    statsRow: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      marginTop: 28,
    },

    statCard: {
      backgroundColor:
        "rgba(255,255,255,0.06)",

      padding: 18,

      borderRadius: 22,

      width: "31%",

      alignItems: "center",
    },

    statValue: {
      color: "#00E5A8",

      fontSize: 18,

      fontWeight: "bold",

      textAlign: "center",
    },

    statLabel: {
      color: "#8A93A7",

      marginTop: 6,

      fontSize: 12,
    },

    scanCard: {
      borderRadius: 35,

      padding: 28,

      marginTop: 30,

      borderWidth: 1,

      borderColor:
        "#1F2937",
    },

    scanTitle: {
      color: "white",

      fontSize: 30,

      fontWeight: "bold",
    },

    scanText: {
      color: "#9CA3AF",

      fontSize: 15,

      lineHeight: 26,

      marginTop: 18,

      marginBottom: 30,
    },

    uploadButton: {
      backgroundColor:
        "#00E5A8",

      paddingVertical: 18,

      borderRadius: 22,

      alignItems: "center",

      marginBottom: 18,

      shadowColor:
        "#00E5A8",

      shadowOpacity: 0.4,

      shadowRadius: 10,

      elevation: 10,
    },

    cameraButton: {
      backgroundColor:
        "#3B82F6",

      paddingVertical: 18,

      borderRadius: 22,

      alignItems: "center",

      shadowColor:
        "#3B82F6",

      shadowOpacity: 0.4,

      shadowRadius: 10,

      elevation: 10,
    },

    buttonText: {
      color: "white",

      fontWeight: "bold",

      fontSize: 17,
    },

    loadingBox: {
      marginTop: 30,

      alignItems: "center",
    },

    loadingText: {
      color: "#8A93A7",

      marginTop: 15,

      fontSize: 15,
    },

    sectionTitle: {
      color: "white",

      fontSize: 26,

      fontWeight: "bold",

      marginTop: 35,

      marginBottom: 20,
    },

    featuresGrid: {
      flexDirection: "row",

      flexWrap: "wrap",

      justifyContent:
        "space-between",
    },

    featureCard: {
      backgroundColor:
        "#121826",

      width: "48%",

      borderRadius: 28,

      padding: 24,

      marginBottom: 18,

      borderWidth: 1,

      borderColor:
        "#1F2937",
    },

    featureEmoji: {
      fontSize: 30,
    },

    featureTitle: {
      color: "white",

      fontSize: 16,

      fontWeight: "bold",

      marginTop: 18,
    },

    previewImage: {
      width: "100%",

      height: 320,

      borderRadius: 32,

      marginBottom: 50,
    },
  });


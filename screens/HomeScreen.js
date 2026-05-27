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
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import * as FileSystem
from "expo-file-system/legacy";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

import { db }
from "../firebaseConfig";

import { analyzeFoodImage }
from "../gemini";

export default function HomeScreen({
  navigation,
}) {
  const [image, setImage] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [mealCount, setMealCount] =
    useState(0);

  const [totalCalories,
    setTotalCalories] =
    useState(0);

  const [protein,
    setProtein] =
    useState(0);

  const [carbs,
    setCarbs] =
    useState(0);

  const [fats,
    setFats] =
    useState(0);

  const [desserts,
    setDesserts] =
    useState(0);

  const [water,
    setWater] =
    useState(0);

  const calorieGoal = 2500;

  const proteinGoal = 180;

  const waterGoal = 8;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData =
    async () => {
      try {
        const querySnapshot =
          await getDocs(
            collection(db, "meals")
          );

        let meals = 0;

        let calories = 0;

        let proteinTotal = 0;

        let carbsTotal = 0;

        let fatsTotal = 0;

        let dessertCount = 0;

        querySnapshot.forEach(
          (doc) => {
            meals++;

            const data =
              doc.data();

            const resultText =
              (
                data.result || ""
              ).toLowerCase();

            const calorieMatch =
              resultText.match(
                /total overall calories[^0-9]*([0-9]+)/i
              );

            if (
              calorieMatch
            ) {
              calories +=
                parseInt(
                  calorieMatch[1]
                );
            }

            const proteinMatch =
              resultText.match(
                /total protein[^0-9]*([0-9]+)/i
              );

            if (
              proteinMatch
            ) {
              proteinTotal +=
                parseInt(
                  proteinMatch[1]
                );
            }

            const carbsMatch =
              resultText.match(
                /total carbs[^0-9]*([0-9]+)/i
              );

            if (
              carbsMatch
            ) {
              carbsTotal +=
                parseInt(
                  carbsMatch[1]
                );
            }

            const fatsMatch =
              resultText.match(
                /total fat[^0-9]*([0-9]+)/i
              );

            if (
              fatsMatch
            ) {
              fatsTotal +=
                parseInt(
                  fatsMatch[1]
                );
            }

            if (
              resultText.includes(
                "dessert"
              ) ||
              resultText.includes(
                "cake"
              ) ||
              resultText.includes(
                "ice cream"
              ) ||
              resultText.includes(
                "sweet"
              )
            ) {
              dessertCount++;
            }
          }
        );

        setMealCount(meals);

        setTotalCalories(
          calories
        );

        setProtein(
          proteinTotal
        );

        setCarbs(
          carbsTotal
        );

        setFats(
          fatsTotal
        );

        setDesserts(
          dessertCount
        );
      } catch (error) {
        console.log(error);
      }
    };

  const analyzeImage = async (
    imageUri
  ) => {
    try {
      setLoading(true);

      setImage(imageUri);

      const base64 =
        await FileSystem.readAsStringAsync(
          imageUri,
          {
            encoding:
              FileSystem.EncodingType.Base64,
          }
        );

      const result =
        await analyzeFoodImage(
          base64
        );

      await addDoc(
        collection(db, "meals"),
        {
          image: imageUri,
          result: result,
          createdAt:
            serverTimestamp(),
        }
      );

      await fetchDashboardData();

      setLoading(false);

      navigation.navigate(
        "Result",
        {
          image: imageUri,
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

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert(
        "Gallery permission required"
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        quality: 1,
      });

    if (!result.canceled) {
      analyzeImage(
        result.assets[0].uri
      );
    }
  };

  const openCamera = async () => {
    const permissionResult =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert(
        "Camera permission required"
      );
      return;
    }

    const result =
      await ImagePicker.launchCameraAsync({
        quality: 1,
      });

    if (!result.canceled) {
      analyzeImage(
        result.assets[0].uri
      );
    }
  };

  const calorieProgress =
    Math.min(
      totalCalories /
        calorieGoal,
      1
    ) * 100;

  const proteinProgress =
    Math.min(
      protein / proteinGoal,
      1
    ) * 100;

  const waterProgress =
    Math.min(
      water / waterGoal,
      1
    ) * 100;

  return (
    <SafeAreaView
      style={styles.safeContainer}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={
          false
        }
      >
        <Text style={styles.title}>
          NutriLens AI
        </Text>

        <Text style={styles.subtitle}>
          Premium AI Nutrition
          Tracker
        </Text>

        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>
            Daily Calories
          </Text>

          <Text style={styles.goalText}>
            {totalCalories} /{" "}
            {calorieGoal}
          </Text>

          <View
            style={styles.progressBackground}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${calorieProgress}%`,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>
            Protein Goal
          </Text>

          <Text style={styles.goalText}>
            {protein}g /{" "}
            {proteinGoal}g
          </Text>

          <View
            style={styles.progressBackground}
          >
            <View
              style={[
                styles.proteinFill,
                {
                  width: `${proteinProgress}%`,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>
            Water Intake
          </Text>

          <Text style={styles.goalText}>
            {water} / {waterGoal}{" "}
            Glasses
          </Text>

          <View
            style={styles.progressBackground}
          >
            <View
              style={[
                styles.waterFill,
                {
                  width: `${waterProgress}%`,
                },
              ]}
            />
          </View>

          <TouchableOpacity
            style={styles.waterButton}
            onPress={() =>
              setWater(
                water + 1
              )
            }
          >
            <Text
              style={styles.buttonText}
            >
              Add Water
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.value}>
              {mealCount}
            </Text>

            <Text style={styles.label}>
              Meals
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.value}>
              {carbs}g
            </Text>

            <Text style={styles.label}>
              Carbs
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.value}>
              {fats}g
            </Text>

            <Text style={styles.label}>
              Fats
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.value}>
              {desserts}
            </Text>

            <Text style={styles.label}>
              Desserts
            </Text>
          </View>
        </View>

        <View style={styles.mainCard}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={pickImage}
          >
            <Text
              style={styles.buttonText}
            >
              Upload Food Image
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cameraButton}
            onPress={openCamera}
          >
            <Text
              style={styles.buttonText}
            >
              Take Food Photo
            </Text>
          </TouchableOpacity>

          {loading && (
            <ActivityIndicator
              size="large"
              color="#00cc88"
              style={{
                marginTop: 20,
              }}
            />
          )}
        </View>

        {image && (
          <Image
            source={{ uri: image }}
            style={styles.previewImage}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f0f0f",
  },

  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 25,
  },

  subtitle: {
    color: "#888",
    marginTop: 8,
    marginBottom: 25,
  },

  goalCard: {
    backgroundColor: "#181818",
    padding: 22,
    borderRadius: 25,
    marginBottom: 20,
  },

  goalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  goalText: {
    color: "#aaa",
    marginTop: 10,
    marginBottom: 18,
    fontSize: 16,
  },

  progressBackground: {
    width: "100%",
    height: 14,
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#00cc88",
    borderRadius: 20,
  },

  proteinFill: {
    height: "100%",
    backgroundColor: "#ff9500",
    borderRadius: 20,
  },

  waterFill: {
    height: "100%",
    backgroundColor: "#00ccff",
    borderRadius: 20,
  },

  waterButton: {
    backgroundColor: "#00ccff",
    marginTop: 20,
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
  },

  card: {
    backgroundColor: "#1b1b1b",
    width: "48%",
    padding: 22,
    borderRadius: 22,
    marginBottom: 18,
  },

  value: {
    color: "#00cc88",
    fontSize: 24,
    fontWeight: "bold",
  },

  label: {
    color: "#aaa",
    marginTop: 8,
  },

  mainCard: {
    backgroundColor: "#181818",
    padding: 24,
    borderRadius: 28,
    marginTop: 10,
    marginBottom: 25,
  },

  uploadButton: {
    backgroundColor: "#00cc88",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 16,
  },

  cameraButton: {
    backgroundColor: "#1495ff",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  previewImage: {
    width: "100%",
    height: 400,
    borderRadius: 25,
    marginBottom: 40,
  },
});
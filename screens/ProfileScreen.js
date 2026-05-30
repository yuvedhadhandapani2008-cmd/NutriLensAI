import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StatusBar,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import {
  getProfile,
  saveProfile as persistProfile,
} from "../services/userData";

import { calculateNutritionGoals }
from "../utils/nutritionGoals";

import { signOut } from "firebase/auth";

import { auth } from "../firebaseConfig";

export default function ProfileScreen() {

  const [profileImage,
    setProfileImage] =
    useState(null);

  const [name, setName] =
    useState("");

  const [age, setAge] =
    useState("");

  const [gender,
    setGender] =
    useState("Male");

  const [weight,
    setWeight] =
    useState("");

  const [height,
    setHeight] =
    useState("");

  const [goal, setGoal] =
    useState("Muscle Gain");

  const [activityLevel,
    setActivityLevel] =
    useState("Moderate");

  const [bmi, setBmi] =
    useState("");

  const [bmiCategory,
    setBmiCategory] =
    useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile =
    async () => {
      try {

        const data =
          await getProfile();

        if (data) {

          setProfileImage(
            data.profileImage
          );

          setName(
            data.name || ""
          );

          setAge(
            String(data.age || "")
          );

          setGender(
            data.gender || "Male"
          );

          setWeight(
            String(data.weight || "")
          );

          setHeight(
            String(data.height || "")
          );

          setGoal(
            data.goal || "Muscle Gain"
          );

          setActivityLevel(
            data.activityLevel || "Moderate"
          );

          setBmi(
            data.bmi || ""
          );

          setBmiCategory(
            data.bmiCategory || ""
          );
        }

      } catch (error) {
        console.log(error);
      }
    };

  const pickImage =
    async () => {

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {

        Alert.alert(
          "Permission required"
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync(
          {
            quality: 1,
            allowsEditing: true,
            aspect: [1, 1],
          }
        );

      if (!result.canceled) {

        setProfileImage(
          result.assets[0].uri
        );
      }
    };

  const saveProfile =
    async () => {

      try {

        if (
          !name ||
          !age ||
          !weight ||
          !height
        ) {

          Alert.alert(
            "Missing Fields",
            "Please fill all profile details."
          );

          return;
        }

        const heightMeters =
          Number(height) / 100;

        const bmiValue =
          (
            Number(weight) /
            (
              heightMeters *
              heightMeters
            )
          ).toFixed(1);

        let category =
          "Normal";

        if (bmiValue < 18.5)
          category =
            "Underweight";

        if (bmiValue >= 25)
          category =
            "Overweight";

        if (bmiValue >= 30)
          category =
            "Obese";

        setBmi(bmiValue);

        setBmiCategory(
          category
        );

        const goals =
          calculateNutritionGoals({
            weight,
            height,
            age,
            gender,
            activityLevel,
            goal,
          });

        const {
          calorieGoal,
          proteinGoal,
          carbsGoal,
          fatsGoal,
          waterGoal,
          microsGoal,
        } = goals;

        await persistProfile({

          profileImage,

          name,

          age,

          gender,

          weight,

          height,

          bmi: bmiValue,

          bmiCategory: category,

          goal,

          activityLevel,

          calorieGoal,

          proteinGoal,

          carbsGoal,

          fatsGoal,

          waterGoal,

          microsGoal,
        });

        Alert.alert(
          "Success",
          "Profile saved successfully."
        );

      } catch (error) {

        console.log(error);

        Alert.alert(
          "Error",
          "Failed to save profile"
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

      <StatusBar
        barStyle="light-content"
      />

      <Text style={styles.title}>
        Profile
      </Text>

      <Text style={styles.subtitle}>
        Personalize your nutrition journey
      </Text>

      {/* PROFILE CARD */}

      <View style={styles.topCard}>

        <TouchableOpacity
          style={
            styles.imageContainer
          }
          onPress={pickImage}
        >

          {profileImage ? (

            <Image
              source={{
                uri: profileImage,
              }}
              style={
                styles.profileImage
              }
            />

          ) : (

            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageEmoji}>
                👤
              </Text>

              <Text
                style={
                  styles.imageText
                }
              >
                Add Photo
              </Text>
            </View>

          )}

        </TouchableOpacity>

        <Text style={styles.namePreview}>
          {name || "Your Name"}
        </Text>

        <Text style={styles.goalPreview}>
          {goal}
        </Text>

      </View>

      {/* INPUTS */}

      <View style={styles.sectionCard}>

        <Text style={styles.sectionTitle}>
          Basic Information
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Age"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />

      </View>

      {/* BMI CARD */}

      {bmi ? (

        <View style={styles.bmiCard}>

          <Text style={styles.bmiLabel}>
            BMI SCORE
          </Text>

          <Text style={styles.bmiValue}>
            {bmi}
          </Text>

          <Text style={styles.bmiCategory}>
            {bmiCategory}
          </Text>

        </View>

      ) : null}

      {/* FITNESS GOALS */}

      <View style={styles.sectionCard}>

        <Text style={styles.sectionTitle}>
          Fitness Goal
        </Text>

        <View style={styles.row}>

          {[
            "Weight Loss",
            "Fat Loss",
            "Maintenance",
            "Muscle Gain",
            "Lean Bulk",
            "Body Recomposition",
            "Athletic Performance",
          ].map((item) => (

            <TouchableOpacity
              key={item}
              style={[
                styles.goalButton,
                goal === item &&
                styles.activeGoal,
              ]}
              onPress={() =>
                setGoal(item)
              }
            >

              <Text
                style={[
                  styles.goalText,
                  goal === item &&
                  styles.activeGoalText,
                ]}
              >
                {item}
              </Text>

            </TouchableOpacity>

          ))}

        </View>

      </View>

      {/* ACTIVITY */}

      <View style={styles.sectionCard}>

        <Text style={styles.sectionTitle}>
          Activity Level
        </Text>

        <View style={styles.row}>

          {[
            "Low",
            "Moderate",
            "High",
          ].map((item) => (

            <TouchableOpacity
              key={item}
              style={[
                styles.goalButton,
                activityLevel ===
                item &&
                styles.activeGoal,
              ]}
              onPress={() =>
                setActivityLevel(
                  item
                )
              }
            >

              <Text
                style={[
                  styles.goalText,
                  activityLevel === item &&
                  styles.activeGoalText,
                ]}
              >
                {item}
              </Text>

            </TouchableOpacity>

          ))}

        </View>

      </View>

      {/* SAVE BUTTON */}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveProfile}
      >

        <Text
          style={
            styles.saveText
          }
        >
          Save Profile
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text 
          style={
            styles.logoutText
          }
        >
          Logout
        </Text> 
      </TouchableOpacity>

      <View
        style={{ height: 80 }}
      />

    </ScrollView>
  );
}

const handleLogout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);

    Alert.alert(
      "Error",
      "Logout failed"
    );
  }
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0B0B0F",
    paddingHorizontal: 20,
  },

  title: {
    color: "white",
    fontSize: 40,
    fontWeight: "800",
    marginTop: 60,
  },

  subtitle: {
    color: "#777",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 30,
  },

  topCard: {
    backgroundColor: "#15151C",
    borderRadius: 32,
    padding: 28,
    alignItems: "center",
    marginBottom: 25,

    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },

  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#00D38D",
    marginBottom: 20,
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    flex: 1,
    backgroundColor: "#202028",
    justifyContent: "center",
    alignItems: "center",
  },

  imageEmoji: {
    fontSize: 38,
    marginBottom: 8,
  },

  imageText: {
    color: "#999",
    fontSize: 14,
  },

  namePreview: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
  },

  goalPreview: {
    color: "#00D38D",
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
  },

  sectionCard: {
    backgroundColor: "#15151C",
    borderRadius: 30,
    padding: 22,
    marginBottom: 22,
  },

  sectionTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#202028",
    color: "white",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    fontSize: 16,
  },

  bmiCard: {
    backgroundColor: "#15151C",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    marginBottom: 22,
  },

  bmiLabel: {
    color: "#777",
    letterSpacing: 2,
    fontSize: 14,
  },

  bmiValue: {
    color: "white",
    fontSize: 54,
    fontWeight: "800",
    marginTop: 10,
  },

  bmiCategory: {
    color: "#00D38D",
    marginTop: 10,
    fontSize: 20,
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  goalButton: {
    backgroundColor: "#202028",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginRight: 10,
    marginBottom: 10,
  },

  activeGoal: {
    backgroundColor: "#00D38D",
  },

  goalText: {
    color: "#AAA",
    fontWeight: "600",
  },

  activeGoalText: {
    color: "#000",
    fontWeight: "800",
  },

  saveButton: {
    backgroundColor: "#00D38D",
    padding: 22,
    borderRadius: 24,
    alignItems: "center",

    shadowColor: "#00D38D",
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 10,
  },

  logoutButton: {
    backgroundColor: "#FF4D4D",
    padding: 22,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 15,

    shadowColor: "#FF4D4D",
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 10,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  saveText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "800",
  },

});
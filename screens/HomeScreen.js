import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

import * as FileSystem from "expo-file-system/legacy";

import { analyzeFoodImage } from "../services/gemini";

export default function HomeScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // PICK IMAGE FROM GALLERY
  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        alert("Gallery permission is required");
        return;
      }

      const pickedImage = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (!pickedImage.canceled) {
        processImage(pickedImage.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to pick image");
    }
  };

  // TAKE PHOTO USING CAMERA
  const takePhoto = async () => {
    try {
      const permission = await Camera.requestCameraPermissionsAsync();

      if (!permission.granted) {
        alert("Camera permission is required");
        return;
      }

      const capturedImage = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (!capturedImage.canceled) {
        processImage(capturedImage.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to open camera");
    }
  };

  // PROCESS IMAGE
  const processImage = async (imageUri) => {
    try {
      setImage(imageUri);

      setLoading(true);

      setResult("");

      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const aiResult = await analyzeFoodImage(base64);

      setResult(aiResult);
      navigation.navigate("Result", {
        image: imageUri,
        result: aiResult,
      });
    } catch (error) {
      console.log(error);
      alert("Image processing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>NutriLens AI</Text>

      <Text style={styles.subtitle}>
        AI Food Nutrition Analyzer
      </Text>

      {/* GALLERY BUTTON */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Food Image</Text>
      </TouchableOpacity>

      {/* CAMERA BUTTON */}
      <TouchableOpacity
        style={[styles.button, styles.cameraButton]}
        onPress={takePhoto}
      >
        <Text style={styles.buttonText}>Take Food Photo</Text>
      </TouchableOpacity>

      {/* IMAGE PREVIEW */}
      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      {/* LOADING */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ff99" />

          <Text style={styles.loadingText}>
            Analyzing your meal...
          </Text>
        </View>
      )}

      {/* RESULT */}
      {result !== "" && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>
            Nutrition Analysis
          </Text>

          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 60,
    textAlign: "center",
  },

  subtitle: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    marginTop: 10,
  },

  button: {
    backgroundColor: "#00cc88",
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: "center",
  },

  cameraButton: {
    backgroundColor: "#0099ff",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  image: {
    width: "100%",
    height: 280,
    borderRadius: 20,
    marginTop: 20,
  },

  loadingContainer: {
    marginTop: 30,
    alignItems: "center",
  },

  loadingText: {
    color: "white",
    marginTop: 15,
    fontSize: 16,
  },

  resultContainer: {
    marginTop: 30,
    backgroundColor: "#1c1c1c",
    padding: 20,
    borderRadius: 20,
    marginBottom: 50,
  },

  resultTitle: {
    color: "#00ff99",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  resultText: {
    color: "white",
    fontSize: 16,
    lineHeight: 26,
  },
});
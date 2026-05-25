import { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { analyzeFoodImage, getErrorMessage } from "../services/gemini";

export default function HomeScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Photo library access is needed to scan meals."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        const asset = result.assets[0];

        if (!asset.base64) {
          Alert.alert(
            "Error",
            "Could not read image data. Try another photo."
          );
          return;
        }

        setImage(asset.uri);
        analyzeMeal(
          asset.base64,
          asset.uri,
          asset.mimeType || "image/jpeg"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const analyzeMeal = async (base64, imageUri, mimeType) => {
    if (!base64) {
      Alert.alert("Error", "Could not read the selected image.");
      return;
    }

    try {
      setLoading(true);

      const result = await analyzeFoodImage(base64, mimeType);

      navigation.navigate("Result", {
        image: imageUri,
        result,
      });
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Analysis failed", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0D0D0D",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 42,
          fontWeight: "bold",
          marginTop: 70,
        }}
      >
        NutriLens AI
      </Text>

      <Text
        style={{
          color: "#888",
          fontSize: 18,
          marginTop: 10,
        }}
      >
        AI nutrition tracking
      </Text>

      <TouchableOpacity
        onPress={pickImage}
        style={{
          backgroundColor: "#00C896",
          padding: 22,
          borderRadius: 28,
          marginTop: 60,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          Scan Meal
        </Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: "100%",
            height: 320,
            borderRadius: 30,
            marginTop: 35,
          }}
        />
      )}

      {loading && (
        <ActivityIndicator
          size="large"
          color="#00C896"
          style={{
            marginTop: 40,
          }}
        />
      )}
    </View>
  );
}

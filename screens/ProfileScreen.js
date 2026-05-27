import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { signOut } from "firebase/auth";

import { auth } from "../firebaseConfig";

export default function ProfileScreen() {
  const [profileImage, setProfileImage] =
    useState(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission required!");
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        allowsEditing: true,

        aspect: [1, 1],

        quality: 1,
      });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);

      alert("Logged out successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Profile
      </Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : {
                  uri: "https://i.imgur.com/6VBx3io.png",
                }
          }
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <Text style={styles.changeText}>
        Tap image to change profile photo
      </Text>

      <Text style={styles.email}>
        {auth.currentUser?.email}
      </Text>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "center",
    paddingTop: 100,
  },

  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 30,
  },

  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
  },

  changeText: {
    color: "#00cc88",
    marginBottom: 25,
  },

  email: {
    color: "white",
    fontSize: 18,
    marginBottom: 40,
  },

  logoutButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 18,
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
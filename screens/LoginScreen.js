import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Login successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NutriLens AI</Text>

      <Text style={styles.subtitle}>
        AI Nutrition Tracker
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoComplete="password"
        textContentType="password"
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.signupText}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    padding: 25,
  },

  title: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 50,
  },

  input: {
    backgroundColor: "#1c1c1c",
    color: "white",
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,
    fontSize: 16,
  },

  loginButton: {
    backgroundColor: "#00cc88",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  signupText: {
    color: "#00cc88",
    textAlign: "center",
    marginTop: 25,
    fontSize: 15,
  },
});
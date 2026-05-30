import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";

import { LinearGradient }
from "expo-linear-gradient";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth }
from "../firebaseConfig";

export default function LoginScreen({
  navigation,
}) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin =
    async () => {
      if (!email || !password) {
        alert(
          "Please fill all fields"
        );
        return;
      }

      try {
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        alert(
          "Login successful!"
        );
      } catch (error) {
        alert(error.message);
      }
    };

  return (
    <LinearGradient
      colors={[
        "#050505",
        "#0d1117",
        "#121826",
      ]}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
      />

      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
        style={styles.flex}
      >
        {/* LOGO AREA */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>
              AI
            </Text>
          </View>

          <Text style={styles.title}>
            NutriLens AI
          </Text>

          <Text style={styles.subtitle}>
            Premium AI nutrition tracking
            powered by intelligent food
            analysis
          </Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Welcome Back
          </Text>

          {/* EMAIL */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Email Address
            </Text>

            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#666"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Password
            </Text>

            <TextInput
              placeholder="Enter password"
              placeholderTextColor="#666"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoComplete="password"
              textContentType="password"
            />
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <LinearGradient
              colors={[
                "#00d084",
                "#00b06b",
              ]}
              style={
                styles.gradientButton
              }
            >
              <Text
                style={
                  styles.buttonText
                }
              >
                Login
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* SIGNUP */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                "Signup"
              )
            }
          >
            <Text
              style={
                styles.signupText
              }
            >
              Don&apos;t have an account?
              <Text
                style={
                  styles.signupHighlight
                }
              >
                {" "}
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: "center",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  header: {
    alignItems: "center",
    marginBottom: 45,
  },

  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor:
      "rgba(0,208,132,0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor:
      "rgba(0,208,132,0.35)",
    marginBottom: 24,
  },

  logoText: {
    color: "#00d084",
    fontSize: 30,
    fontWeight: "800",
  },

  title: {
    color: "white",
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  subtitle: {
    color: "#8e8e93",
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 25,
    paddingHorizontal: 10,
  },

  card: {
    backgroundColor:
      "rgba(255,255,255,0.04)",
    borderRadius: 32,
    padding: 26,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.06)",
  },

  cardTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 30,
  },

  inputContainer: {
    marginBottom: 22,
  },

  label: {
    color: "#b0b0b5",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "600",
  },

  input: {
    backgroundColor:
      "rgba(255,255,255,0.05)",
    color: "white",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.06)",
  },

  loginButton: {
    marginTop: 10,
    borderRadius: 22,
    overflow: "hidden",
  },

  gradientButton: {
    paddingVertical: 18,
    alignItems: "center",
    borderRadius: 22,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  signupText: {
    color: "#8e8e93",
    textAlign: "center",
    marginTop: 28,
    fontSize: 15,
  },

  signupHighlight: {
    color: "#00d084",
    fontWeight: "700",
  },
});
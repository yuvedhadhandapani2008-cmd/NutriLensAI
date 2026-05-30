import React, {
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebaseConfig";

export default function SignupScreen({
  navigation,
}) {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleSignup =
    async () => {
      if (
        !email ||
        !password
      ) {
        alert(
          "Please fill all fields"
        );
        return;
      }

      try {
        const credential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

        await setDoc(
          doc(
            db,
            "users",
            credential.user.uid,
            "account",
            "info"
          ),
          {
            uid:
              credential.user.uid,
            displayName:
              name ||
              "Athlete",
            email,
            createdAt:
              serverTimestamp(),
          }
        );

        await signOut(auth);

        alert(
          "Account created successfully!"
        );

        navigation.navigate(
          "Login"
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
      style={
        styles.container
      }
    >
      <StatusBar
        barStyle="light-content"
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS ===
          "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scroll
          }
        >
          {/* HEADER */}
          <View
            style={
              styles.header
            }
          >
            <View
              style={
                styles.logoCircle
              }
            >
              <Text
                style={
                  styles.logoText
                }
              >
                AI
              </Text>
            </View>

            <Text
              style={
                styles.title
              }
            >
              Create Account
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Start your AI-powered
              fitness and nutrition
              journey
            </Text>
          </View>

          {/* CARD */}
          <View
            style={
              styles.card
            }
          >
            {/* NAME */}
            <View
              style={
                styles.inputContainer
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                Full Name
              </Text>

              <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#666"
                style={
                  styles.input
                }
                value={name}
                onChangeText={
                  setName
                }
              />
            </View>

            {/* EMAIL */}
            <View
              style={
                styles.inputContainer
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                Email Address
              </Text>

              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#666"
                style={
                  styles.input
                }
                value={email}
                onChangeText={
                  setEmail
                }
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </View>

            {/* PASSWORD */}
            <View
              style={
                styles.inputContainer
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                Password
              </Text>

              <TextInput
                placeholder="Create password"
                placeholderTextColor="#666"
                style={
                  styles.input
                }
                secureTextEntry
                value={password}
                onChangeText={
                  setPassword
                }
                autoComplete="new-password"
                textContentType="newPassword"
              />
            </View>

            {/* BUTTON */}
            <TouchableOpacity
              style={
                styles.signupButton
              }
              onPress={
                handleSignup
              }
            >
              <LinearGradient
                colors={[
                  "#1495ff",
                  "#0066ff",
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
                  Create Account
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* LOGIN */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "Login"
                )
              }
            >
              <Text
                style={
                  styles.loginText
                }
              >
                Already have an
                account?
                <Text
                  style={
                    styles.loginHighlight
                  }
                >
                  {" "}
                  Login
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles =
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    container: {
      flex: 1,
    },

    scroll: {
      paddingHorizontal: 24,
      paddingTop: 70,
      paddingBottom: 40,
    },

    header: {
      alignItems: "center",
      marginBottom: 40,
    },

    logoCircle: {
      width: 90,
      height: 90,
      borderRadius: 50,
      backgroundColor:
        "rgba(20,149,255,0.12)",
      justifyContent:
        "center",
      alignItems:
        "center",
      borderWidth: 1.5,
      borderColor:
        "rgba(20,149,255,0.35)",
      marginBottom: 24,
    },

    logoText: {
      color: "#1495ff",
      fontSize: 30,
      fontWeight: "800",
    },

    title: {
      color: "white",
      fontSize: 38,
      fontWeight: "800",
    },

    subtitle: {
      color: "#8e8e93",
      fontSize: 15,
      textAlign: "center",
      marginTop: 12,
      lineHeight: 24,
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

    signupButton: {
      marginTop: 10,
      borderRadius: 22,
      overflow: "hidden",
    },

    gradientButton: {
      paddingVertical: 18,
      alignItems:
        "center",
      borderRadius: 22,
    },

    buttonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "800",
      letterSpacing: 0.4,
    },

    loginText: {
      color: "#8e8e93",
      textAlign: "center",
      marginTop: 28,
      fontSize: 15,
    },

    loginHighlight: {
      color: "#1495ff",
      fontWeight: "700",
    },
  });
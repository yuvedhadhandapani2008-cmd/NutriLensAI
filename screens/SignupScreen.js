import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import {
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebaseConfig";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // IMPORTANT
      // Logout immediately after signup
      await signOut(auth);

      alert(
        "Account created successfully! Please login."
      );

      navigation.navigate("Login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#888"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

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
        autoComplete="new-password"
        textContentType="newPassword"
      />

      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>
          Create Account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    padding: 25,
    paddingTop: 80,
  },

  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 40,
  },

  input: {
    backgroundColor: "#1c1c1c",
    color: "white",
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,
    fontSize: 16,
  },

  signupButton: {
    backgroundColor: "#0099ff",
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

  loginText: {
    color: "#00cc88",
    textAlign: "center",
    marginTop: 25,
    fontSize: 15,
  },
});
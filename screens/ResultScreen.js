import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

export default function ResultScreen({ route }) {
  const { image, result } = route.params;

  const sections = result.split("\n");

  const renderLine = (line, index) => {
    const clean = line.trim();

    if (!clean) return null;

    // HEADINGS
    if (
      clean.includes("MEAL NAME") ||
      clean.includes("TOTAL NUTRITION") ||
      clean.includes("INGREDIENT BREAKDOWN") ||
      clean.includes("GYM RECOMMENDATION") ||
      clean.includes("DIET RECOMMENDATION") ||
      clean.includes("MICRONUTRIENTS")
    ) {
      return (
        <Text
          key={index}
          style={styles.sectionTitle}
        >
          {clean.replace(/\*/g, "")}
        </Text>
      );
    }

    // MACRO HIGHLIGHT
    if (
      clean.toLowerCase().includes("calories") ||
      clean.toLowerCase().includes("protein") ||
      clean.toLowerCase().includes("carbs") ||
      clean.toLowerCase().includes("fat")
    ) {
      return (
        <View
          key={index}
          style={styles.macroCard}
        >
          <Text style={styles.macroText}>
            {clean}
          </Text>
        </View>
      );
    }

    return (
      <Text
        key={index}
        style={styles.resultText}
      >
        {clean}
      </Text>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* IMAGE */}
      <Image
        source={{ uri: image }}
        style={styles.image}
      />

      {/* HEADER */}
      <View style={styles.headerCard}>
        <Text style={styles.title}>
          AI Nutrition Analysis
        </Text>

        <Text style={styles.subtitle}>
          Complete ingredient-wise nutrition
          breakdown powered by NutriLens AI
        </Text>
      </View>

      {/* RESULTS */}
      <View style={styles.resultCard}>
        {sections.map((line, index) =>
          renderLine(line, index)
        )}
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    paddingHorizontal: 20,
  },

  image: {
    width: "100%",
    height: 320,
    borderRadius: 32,
    marginTop: 50,
  },

  headerCard: {
    marginTop: 25,
    marginBottom: 20,
  },

  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "800",
  },

  subtitle: {
    color: "#8e8e93",
    fontSize: 16,
    marginTop: 10,
    lineHeight: 26,
  },

  resultCard: {
    backgroundColor: "#15151c",
    borderRadius: 30,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#222",
  },

  sectionTitle: {
    color: "#00d084",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 24,
    marginBottom: 14,
  },

  macroCard: {
    backgroundColor: "#1e1f27",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2b36",
  },

  macroText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },

  resultText: {
    color: "#d1d1d6",
    fontSize: 15,
    lineHeight: 28,
    marginBottom: 10,
  },
});
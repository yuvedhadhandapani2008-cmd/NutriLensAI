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

  return (
    <ScrollView style={styles.container}>
      {/* FOOD IMAGE */}
      <Image source={{ uri: image }} style={styles.image} />

      {/* TITLE */}
      <Text style={styles.title}>Nutrition Analysis</Text>

      {/* RESULT BOX */}
      <View style={styles.resultBox}>
        <Text style={styles.resultText}>{result}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    padding: 20,
  },

  image: {
    width: "100%",
    height: 280,
    borderRadius: 24,
    marginTop: 40,
  },

  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 20,
  },

  resultBox: {
    backgroundColor: "#1c1c1c",
    padding: 22,
    borderRadius: 22,
    marginBottom: 50,
  },

  resultText: {
    color: "white",
    fontSize: 16,
    lineHeight: 30,
  },
});
import { View, Text, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#111",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 32,
          fontWeight: "bold",
          marginTop: 60,
        }}
      >
        NutriLens AI
      </Text>

      <Text
        style={{
          color: "gray",
          fontSize: 18,
          marginTop: 10,
        }}
      >
        AI-powered calorie tracker
      </Text>

      <View
        style={{
          backgroundColor: "#222",
          padding: 20,
          borderRadius: 20,
          marginTop: 30,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 20,
            marginBottom: 10,
          }}
        >
          Calories Left: 540
        </Text>

        <Text style={{ color: "white", fontSize: 18 }}>
          Protein: 75g
        </Text>

        <Text style={{ color: "white", fontSize: 18 }}>
          Carbs: 120g
        </Text>

        <Text style={{ color: "white", fontSize: 18 }}>
          Fat: 40g
        </Text>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#00C896",
          padding: 18,
          borderRadius: 20,
          marginTop: 40,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Scan Meal
        </Text>
      </TouchableOpacity>
    </View>
  );
}
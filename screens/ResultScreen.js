import {
  View,
  Text,
  Image,
  ScrollView,
} from "react-native";

export default function ResultScreen({
  route,
}) {
  const { image, result } = route.params;

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0D0D0D",
      }}
    >
      <Image
        source={{ uri: image }}
        style={{
          width: "100%",
          height: 320,
        }}
      />

      <View
        style={{
          padding: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 32,
            fontWeight: "bold",
          }}
        >
          Nutrition Analysis
        </Text>

        <View
          style={{
            backgroundColor: "#1A1A1A",
            padding: 20,
            borderRadius: 24,
            marginTop: 25,
          }}
        >
          <Text
            style={{
              color: "#DDD",
              fontSize: 18,
              lineHeight: 32,
            }}
          >
            {result}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
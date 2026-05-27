import React, {
    useEffect,
    useState,
  } from "react";
  
  import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    ActivityIndicator,
  } from "react-native";
  
  import {
    collection,
    getDocs,
    query,
    orderBy,
  } from "firebase/firestore";
  
  import { db }
  from "../firebaseConfig";
  
  export default function HistoryScreen() {
    const [meals, setMeals] =
      useState([]);
  
    const [loading, setLoading] =
      useState(true);
  
    useEffect(() => {
      fetchMeals();
    }, []);
  
    const fetchMeals = async () => {
      try {
        const q = query(
          collection(db, "meals"),
          orderBy(
            "createdAt",
            "desc"
          )
        );
  
        const querySnapshot =
          await getDocs(q);
  
        const mealList = [];
  
        querySnapshot.forEach(
          (doc) => {
            mealList.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        );
  
        setMeals(mealList);
  
        setLoading(false);
  
        console.log(
          "MEALS FETCHED"
        );
      } catch (error) {
        console.log(
          "FETCH ERROR:"
        );
  
        console.log(error);
  
        setLoading(false);
      }
    };
  
    if (loading) {
      return (
        <View
          style={styles.loadingContainer}
        >
          <ActivityIndicator
            size="large"
            color="#00cc88"
          />
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Meal History
        </Text>
  
        <FlatList
          data={meals}
          keyExtractor={(item) =>
            item.id
          }
          showsVerticalScrollIndicator={
            false
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{
                  uri: item.image,
                }}
                style={styles.image}
              />
  
              <Text
                style={styles.result}
                numberOfLines={8}
              >
                {item.result}
              </Text>
            </View>
          )}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      backgroundColor: "#0f0f0f",
      justifyContent: "center",
      alignItems: "center",
    },
  
    container: {
      flex: 1,
      backgroundColor: "#0f0f0f",
      padding: 20,
      paddingTop: 60,
    },
  
    title: {
      color: "white",
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 25,
    },
  
    card: {
      backgroundColor: "#1b1b1b",
      borderRadius: 24,
      padding: 18,
      marginBottom: 20,
    },
  
    image: {
      width: "100%",
      height: 220,
      borderRadius: 20,
      marginBottom: 15,
    },
  
    result: {
      color: "white",
      fontSize: 14,
      lineHeight: 24,
    },
  });
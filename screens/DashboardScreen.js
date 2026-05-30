import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useFocusEffect }
from "@react-navigation/native";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import {
  AnimatedCircularProgress,
} from "react-native-circular-progress";

import Ionicons
from "react-native-vector-icons/Ionicons";

import { COLORS }
from "../constants/colors";

import { globalStyles }
from "../constants/styles";

import {
  sumNutrition,
  filterMealsByDay,
  calculateMicrosScore,
  ringPercent,
} from "../utils/mealParser";

import {
  calculateStreak,
  calculateFitnessScore,
} from "../utils/streakCalculator";

import {
  getProfile,
  getMeals,
  getDailyWater,
  setDailyWater,
  syncTodayStats,
} from "../services/userData";

import { subscribePartnerTeam }
from "../services/partnerService";

import PartnerFitnessCard
from "../components/PartnerFitnessCard";

export default function DashboardScreen() {
  const [profile,
    setProfile] =
    useState(null);

  const [mealCount,
    setMealCount] =
    useState(0);

  const [calories,
    setCalories] =
    useState(0);

  const [protein,
    setProtein] =
    useState(0);

  const [carbs,
    setCarbs] =
    useState(0);

  const [fats,
    setFats] =
    useState(0);

  const [micros,
    setMicros] =
    useState(0);

  const [water,
    setWater] =
    useState(0);

  const [partnerState,
    setPartnerState] =
    useState(null);

  const [streak,
    setStreak] =
    useState(0);

  const [fitnessScore,
    setFitnessScore] =
    useState(0);

  const [partnerName,
    setPartnerName] =
    useState("");

  const loadDashboard =
    useCallback(async () => {
      try {
        const profileData =
          await getProfile();

        if (!profileData) {
          return;
        }

        setProfile(profileData);

        const allMeals =
          await getMeals();

        const today =
          new Date();

        const todayMeals =
          filterMealsByDay(
            allMeals,
            today
          );

        setMealCount(
          todayMeals.length
        );

        const totals =
          sumNutrition(
            todayMeals
          );

        setCalories(
          totals.calories
        );

        setProtein(
          totals.protein
        );

        setCarbs(
          totals.carbs
        );

        setFats(
          totals.fats
        );

        setMicros(
          calculateMicrosScore(
            totals,
            profileData
          )
        );

        const calculatedStreak =
          calculateStreak(
            allMeals
          );

        setStreak(
          calculatedStreak
        );

        const score =
          calculateFitnessScore(
            {
              streak:
                calculatedStreak,

              caloriePercent:
                ringPercent(
                  totals.calories,
                  profileData.calorieGoal
                ),

              proteinPercent:
                ringPercent(
                  totals.protein,
                  profileData.proteinGoal
                ),

              carbsPercent:
                ringPercent(
                  totals.carbs,
                  profileData.carbsGoal
                ),

              fatsPercent:
                ringPercent(
                  totals.fats,
                  profileData.fatsGoal
                ),

              mealsToday:
                todayMeals.length,
            }
          );

        setFitnessScore(
          score
        );

        const waterToday =
          await getDailyWater();

        setWater(
          waterToday
        );

        await syncTodayStats(
          profileData,
          allMeals
        );

      } catch (error) {
        console.log(error);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  useEffect(() => {
    const unsub =
      subscribePartnerTeam(
        (state) => {
          setPartnerState(
            state
          );

          if (
            state?.account
              ?.partnerNickname
          ) {
            setPartnerName(
              state.account
                .partnerNickname
            );
          } else if (
            state?.account
              ?.partnerName
          ) {
            setPartnerName(
              state.account
                .partnerName
            );
          }
        }
      );

    return unsub;
  }, []);

  const updateWater =
    async (next) => {
      const clamped =
        Math.max(
          0,
          Math.min(
            next,
            profile
              ?.waterGoal || 14
          )
        );

      setWater(clamped);

      try {
        await setDailyWater(
          clamped
        );
      } catch (error) {
        console.log(error);
      }
    };

  if (!profile) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <Text
          style={
            styles.loadingText
          }
        >
          Loading Dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.header}>
        <View>
          <Text
            style={
              styles.greeting
            }
          >
            Good Evening 👋
          </Text>

          <Text
            style={styles.title}
          >
            Dashboard
          </Text>
        </View>

        <View
          style={
            styles.headerBadge
          }
        >
          <Text
            style={
              styles.headerBadgeText
            }
          >
            🔥 {streak}
          </Text>
        </View>
      </View>

      {/* PROFILE */}

      <View
        style={
          styles.profileCard
        }
      >
        <Text
          style={
            styles.profileName
          }
        >
          {profile.name}
        </Text>

        <Text
          style={
            styles.profileGoal
          }
        >
          {profile.goal}
        </Text>

        <Text
          style={
            styles.dailyGoalsHint
          }
        >
          Today&apos;s targets:
          {" "}
          {profile.calorieGoal}
          {" "}
          kcal ·{" "}
          {profile.proteinGoal}
          g protein ·{" "}
          {profile.carbsGoal}
          g carbs ·{" "}
          {profile.fatsGoal}
          g fats
        </Text>

        <View
          style={
            styles.profileRow
          }
        >
          <View>
            <Text
              style={
                styles.profileValue
              }
            >
              {profile.weight}
              kg
            </Text>

            <Text
              style={
                styles.profileLabel
              }
            >
              Weight
            </Text>
          </View>

          <View>
            <Text
              style={
                styles.profileValue
              }
            >
              {profile.height}
              cm
            </Text>

            <Text
              style={
                styles.profileLabel
              }
            >
              Height
            </Text>
          </View>

          <View>
            <Text
              style={
                styles.profileValue
              }
            >
              {profile.bmi}
            </Text>

            <Text
              style={
                styles.profileLabel
              }
            >
              BMI
            </Text>
          </View>
        </View>
      </View>

      {/* STREAK */}

      <View
        style={
          styles.streakCard
        }
      >
        <Text
          style={
            styles.streakEmoji
          }
        >
          🔥
        </Text>

        <Text
          style={
            styles.streakValue
          }
        >
          {streak} Day Streak
        </Text>

        <Text
          style={
            styles.streakText
          }
        >
          Fitness Score:
          {" "}
          {fitnessScore}
        </Text>
      </View>

      {/* BIG CALORIE RING */}

      <View
        style={styles.bigRing}
      >
        <AnimatedCircularProgress
          size={240}
          width={18}
          fill={Math.min(
            (calories /
              profile.calorieGoal) *
              100,
            100
          )}
          tintColor={
            COLORS.primary
          }
          backgroundColor="#222"
          rotation={0}
        >
          {() => (
            <View>
              <Text
                style={
                  styles.bigValue
                }
              >
                {calories}
              </Text>

              <Text
                style={
                  styles.bigLabel
                }
              >
                Calories
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* SMALL RINGS */}

      <View style={styles.row}>
        <RingCard
          value={protein}
          goal={
            profile.proteinGoal
          }
          label="Protein"
          color={COLORS.protein}
        />

        <RingCard
          value={carbs}
          goal={
            profile.carbsGoal
          }
          label="Carbs"
          color={COLORS.carbs}
        />
      </View>

      <View style={styles.row}>
        <RingCard
          value={fats}
          goal={
            profile.fatsGoal
          }
          label="Fats"
          color={COLORS.fats}
        />

        <RingCard
          value={micros}
          goal={
            profile.microsGoal ||
            100
          }
          label="Micros"
          color="#bb6cff"
          isPercent
        />
      </View>

      {/* WATER */}

      <View
        style={
          styles.waterCard
        }
      >
        <View
          style={{
            flexDirection: "row",
            alignItems:
              "center",

            marginBottom: 25,
          }}
        >
          <Ionicons
            name="water"
            size={28}
            color={
              COLORS.water
            }
          />

          <Text
            style={[
              styles.waterTitle,
              {
                marginLeft: 10,
              },
            ]}
          >
            Water Intake
          </Text>
        </View>

        <AnimatedCircularProgress
          size={150}
          width={15}
          fill={ringPercent(
            water,
            profile.waterGoal
          )}
          tintColor={
            COLORS.water
          }
          backgroundColor="#222"
          rotation={0}
        >
          {() => (
            <Text
              style={
                styles.waterValue
              }
            >
              {water}/
              {
                profile.waterGoal
              }
            </Text>
          )}
        </AnimatedCircularProgress>

        <View
          style={
            styles.waterButtons
          }
        >
          <TouchableOpacity
            style={
              styles.waterBtn
            }
            onPress={() =>
              updateWater(
                water - 1
              )
            }
          >
            <Text
              style={
                styles.waterBtnText
              }
            >
              -
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.waterBtn
            }
            onPress={() =>
              updateWater(
                water + 1
              )
            }
          >
            <Text
              style={
                styles.waterBtnText
              }
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PARTNER */}

      <PartnerFitnessCard
        partnerState={
          partnerState
        }
        partnerName={
          partnerName
        }
        onPartnerNameChange={
          setPartnerName
        }
        profileName={
          profile.name
        }
      />
    </ScrollView>
  );
}

function RingCard({
  value,
  goal,
  label,
  color,
  isPercent = false,
}) {
  const fill =
    ringPercent(
      value,
      goal
    );

  return (
    <View
      style={
        styles.smallRing
      }
    >
      <AnimatedCircularProgress
        size={120}
        width={10}
        fill={fill}
        tintColor={color}
        backgroundColor="#222"
        rotation={0}
      >
        {() => (
          <View>
            <Text
              style={
                styles.smallValue
              }
            >
              {isPercent
                ? `${value}%`
                : value}
            </Text>

            <Text
              style={
                styles.smallGoal
              }
            >
              {isPercent
                ? "score"
                : `/ ${goal}`}
            </Text>

            <Text
              style={
                styles.smallLabel
              }
            >
              {label}
            </Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        COLORS.background,

      paddingHorizontal: 20,

      paddingBottom: 120,
    },

    loadingContainer: {
      flex: 1,

      backgroundColor:
        COLORS.background,

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    loadingText: {
      color: COLORS.text,

      fontSize: 18,
    },

    header: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginTop: 55,

      marginBottom: 30,
    },

    greeting: {
      color:
        COLORS.subtext,

      fontSize: 16,
    },

    title: {
      color: COLORS.text,

      fontSize: 40,

      fontWeight: "bold",

      marginTop: 4,
    },

    headerBadge: {
      backgroundColor:
        COLORS.card,

      paddingHorizontal: 18,

      paddingVertical: 10,

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        COLORS.border,
    },

    headerBadgeText: {
      color:
        COLORS.primary,

      fontWeight:
        "bold",
    },

    profileCard: {
      ...globalStyles.card,

      padding: 28,
    },

    profileName: {
      color: COLORS.text,

      fontSize: 30,

      fontWeight: "bold",
    },

    profileGoal: {
      color:
        COLORS.primary,

      marginTop: 8,

      fontSize: 16,
    },

    dailyGoalsHint: {
      color:
        COLORS.subtext,

      marginTop: 12,

      fontSize: 13,

      lineHeight: 20,
    },

    profileRow: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      marginTop: 24,
    },

    profileValue: {
      color: COLORS.text,

      fontSize: 22,

      fontWeight: "bold",

      textAlign:
        "center",
    },

    profileLabel: {
      color:
        COLORS.subtext,

      textAlign:
        "center",

      marginTop: 6,
    },

    streakCard: {
      ...globalStyles.card,

      alignItems:
        "center",
    },

    streakEmoji: {
      fontSize: 50,
    },

    streakValue: {
      color: COLORS.text,

      fontSize: 32,

      fontWeight: "bold",

      marginTop: 10,
    },

    streakText: {
      color:
        COLORS.primary,

      marginTop: 10,

      fontSize: 18,
    },

    bigRing: {
      ...globalStyles.card,

      alignItems:
        "center",

      paddingVertical: 35,
    },

    bigValue: {
      color: COLORS.text,

      fontSize: 44,

      fontWeight: "bold",

      textAlign:
        "center",
    },

    bigLabel: {
      color:
        COLORS.subtext,

      marginTop: 10,

      textAlign:
        "center",
    },

    row: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      marginBottom: 25,
    },

    smallRing: {
      ...globalStyles.card,

      width: "48%",

      alignItems:
        "center",
    },

    smallValue: {
      color: COLORS.text,

      fontWeight:
        "bold",

      fontSize: 20,

      textAlign:
        "center",
    },

    smallGoal: {
      color:
        COLORS.subtext,

      textAlign:
        "center",

      marginTop: 2,
    },

    smallLabel: {
      color: COLORS.text,

      textAlign:
        "center",

      marginTop: 8,

      fontSize: 15,
    },

    waterCard: {
      ...globalStyles.card,

      alignItems:
        "center",
    },

    waterTitle: {
      color: COLORS.text,

      fontSize: 24,

      fontWeight: "bold",
    },

    waterValue: {
      color: COLORS.text,

      fontSize: 30,

      fontWeight: "bold",
    },

    waterButtons: {
      flexDirection: "row",

      marginTop: 25,
    },

    waterBtn: {
      backgroundColor:
        COLORS.water,

      width: 58,

      height: 58,

      borderRadius: 20,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginHorizontal: 12,

      shadowColor:
        COLORS.water,

      shadowOpacity: 0.5,

      shadowRadius: 10,

      elevation: 8,
    },

    waterBtnText: {
      color: COLORS.text,

      fontSize: 32,

      fontWeight: "bold",
    },
  });
import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";

import { useFocusEffect }
from "@react-navigation/native";

import {
  LineChart,
  BarChart,
} from "react-native-chart-kit";

import Ionicons
from "react-native-vector-icons/Ionicons";

import { COLORS }
from "../constants/colors";

import { globalStyles }
from "../constants/styles";

import {
  getProfile,
  getMeals,
} from "../services/userData";

import {
  sumNutrition,
  filterMealsLastNDays,
  getWeeklyNutritionSeries,
  ringPercent,
} from "../utils/mealParser";

import {
  calculateStreak,
  calculateFitnessScore,
} from "../utils/streakCalculator";

import {
  downloadFullReport,
  downloadWeeklyReport,
} from "../services/reportService";

const chartWidth =
  Dimensions.get("window").width - 80;

const chartConfig = {
  backgroundColor:
    COLORS.card,

  backgroundGradientFrom:
    COLORS.card,

  backgroundGradientTo:
    COLORS.card,

  decimalPlaces: 0,

  color: (opacity = 1) =>
    `rgba(0,229,168,${opacity})`,

  labelColor:
    (opacity = 1) =>
      `rgba(255,255,255,${opacity})`,

  propsForDots: {
    r: "5",

    strokeWidth: "2",

    stroke:
      COLORS.primary,
  },

  propsForBackgroundLines:
    {
      stroke:
        COLORS.border,
    },

  style: {
    borderRadius: 24,
  },
};

export default function AnalyticsScreen() {
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

  const [weeklySeries,
    setWeeklySeries] =
    useState([]);

  const [profile,
    setProfile] =
    useState(null);

  const [allMeals,
    setAllMeals] =
    useState([]);

  const [streak,
    setStreak] =
    useState(0);

  const [fitnessScore,
    setFitnessScore] =
    useState(0);

  const [exporting,
    setExporting] =
    useState(null);

  const loadAnalytics =
    useCallback(async () => {
      try {
        const profileData =
          await getProfile();

        if (profileData) {
          setProfile(
            profileData
          );
        }

        const meals =
          await getMeals();

        setAllMeals(
          meals
        );

        const weekMeals =
          filterMealsLastNDays(
            meals,
            7
          );

        const totals =
          sumNutrition(
            weekMeals
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

        const series =
          getWeeklyNutritionSeries(
            meals
          );

        setWeeklySeries(
          series
        );

        const calculatedStreak =
          calculateStreak(
            meals
          );

        setStreak(
          calculatedStreak
        );

        const goals =
          profileData || {
            calorieGoal: 2200,
            proteinGoal: 140,
            carbsGoal: 240,
            fatsGoal: 70,
          };

        const todayTotals =
          sumNutrition(
            filterMealsLastNDays(
              meals,
              1
            )
          );

        setFitnessScore(
          calculateFitnessScore(
            {
              streak:
                calculatedStreak,

              caloriePercent:
                ringPercent(
                  todayTotals.calories,
                  goals.calorieGoal
                ),

              proteinPercent:
                ringPercent(
                  todayTotals.protein,
                  goals.proteinGoal
                ),

              carbsPercent:
                ringPercent(
                  todayTotals.carbs,
                  goals.carbsGoal
                ),

              fatsPercent:
                ringPercent(
                  todayTotals.fats,
                  goals.fatsGoal
                ),

              mealsToday:
                filterMealsLastNDays(
                  meals,
                  1
                ).length,
            }
          )
        );

      } catch (error) {
        console.log(error);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      loadAnalytics();
    }, [loadAnalytics])
  );

  const weekLabels =
    weeklySeries.map(
      (d) => d.label
    );

  const calData =
    weeklySeries.map(
      (d) => d.calories
    );

  const handleExport =
    async (type) => {
      setExporting(type);

      try {
        const weekMeals =
          filterMealsLastNDays(
            allMeals,
            7
          );

        const totals =
          sumNutrition(
            weekMeals
          );

        const goals =
          profile || {
            calorieGoal: 2200,
            proteinGoal: 140,
            carbsGoal: 240,
            fatsGoal: 70,
          };

        const params = {
          profile,

          totals:
            type === "full"
              ? sumNutrition(
                  allMeals
                )
              : totals,

          goals,

          weeklySeries,

          streak,

          fitnessScore,
        };

        if (
          type === "full"
        ) {
          await downloadFullReport(
            {
              ...params,
              allMeals,
            }
          );
        } else {
          await downloadWeeklyReport(
            {
              ...params,
              weekMeals,
            }
          );
        }

        Alert.alert(
          "Report Ready",
          "Your premium nutrition PDF has been generated successfully."
        );

      } catch (error) {
        console.log(error);

        Alert.alert(
          "Export Failed",
          "Could not generate report."
        );

      } finally {
        setExporting(null);
      }
    };

  return (
    <ScrollView
      style={
        styles.container
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      {/* HEADER */}

      <View
        style={
          styles.header
        }
      >
        <View>
          <Text
            style={
              styles.subHeading
            }
          >
            Weekly insights 📊
          </Text>

          <Text
            style={
              styles.title
            }
          >
            Analytics
          </Text>
        </View>

        <View
          style={
            styles.streakBadge
          }
        >
          <Text
            style={
              styles.streakText
            }
          >
            🔥 {streak}
          </Text>
        </View>
      </View>

      {/* FITNESS SCORE */}

      <View
        style={
          styles.scoreCard
        }
      >
        <Ionicons
          name="fitness"
          size={34}
          color={
            COLORS.primary
          }
        />

        <Text
          style={
            styles.scoreValue
          }
        >
          {fitnessScore}
        </Text>

        <Text
          style={
            styles.scoreLabel
          }
        >
          Fitness Score
        </Text>
      </View>

      {/* STATS */}

      <Text
        style={
          styles.section
        }
      >
        This Week
      </Text>

      <View
        style={
          styles.statsRow
        }
      >
        <StatCard
          label="Calories"
          value={`${calories}`}
          unit="kcal"
          icon="flame"
          color={
            COLORS.primary
          }
        />

        <StatCard
          label="Protein"
          value={`${protein}`}
          unit="g"
          icon="barbell"
          color={
            COLORS.protein
          }
        />
      </View>

      <View
        style={
          styles.statsRow
        }
      >
        <StatCard
          label="Carbs"
          value={`${carbs}`}
          unit="g"
          icon="nutrition"
          color={
            COLORS.carbs
          }
        />

        <StatCard
          label="Fats"
          value={`${fats}`}
          unit="g"
          icon="water"
          color={
            COLORS.fats
          }
        />
      </View>

      {/* CHARTS */}

      {weekLabels.length >
        0 &&
      calData.some(
        (v) => v > 0
      ) ? (
        <>
          <Text
            style={
              styles.section
            }
          >
            Calorie Trend
          </Text>

          <View
            style={
              styles.chartContainer
            }
          >
            <LineChart
              data={{
                labels:
                  weekLabels,

                datasets: [
                  {
                    data:
                      calData.length
                        ? calData
                        : [0],
                  },
                ],
              }}

              width={
                chartWidth
              }

              height={220}

              chartConfig={
                chartConfig
              }

              bezier
              
              verticalLabelRotation={0}

              style={
                styles.chart
              }
            />
          </View>

          <Text
            style={
              styles.section
            }
          >
            Protein Intake
          </Text>

          <View
            style={
              styles.chartContainer
            }
          >
            <BarChart
              data={{
                labels:
                  weekLabels,

                datasets: [
                  {
                    data:
                      weeklySeries.map(
                        (
                          d
                        ) =>
                          d.protein
                      ),
                  },
                ],
              }}

              width={
                chartWidth
              }

              height={260}
          
              yAxisSuffix="g"

              fromZero

              showValuesOnTopOfBars={false}

              verticalLabelRotation={0}

              segments={4}
              withHorizontalLabels={true}
              withVerticalLabels={true}

              yAxisSuffix="g"

              chartConfig={{
                ...chartConfig,

                color:
                  (
                    opacity = 1
                  ) =>
                    `rgba(59,130,246,${opacity})`,
              }}

              style={
                styles.chart
              }
            />
          </View>

          <Text
            style={
              styles.section
            }
          >
            Carb Intake
          </Text>

          <View
            style={
              styles.chartContainer
            }
          >
            <BarChart
              data={{
                labels:
                  weekLabels,

                datasets: [
                  {
                    data:
                      weeklySeries.map(
                        (
                          d
                        ) =>
                          d.carbs
                      ),
                  },
                ],
              }}

              width={
                chartWidth
              }

              height={260}

              fromZero

              showValuesOnTopOfBars={false}

              verticalLabelRotation={0}

              segments={4}
              withHorizontalLabels={true}
              withVerticalLabels={true}


              yAxisSuffix="g"

              chartConfig={{
                ...chartConfig,

                color:
                  (
                    opacity = 1
                  ) =>
                    `rgba(245,158,11,${opacity})`,
              }}

              style={
                styles.chart
              }
            />
          </View>

          <Text
            style={
              styles.section
            }
          >
            Fat Intake
          </Text>

          <View
            style={
              styles.chartContainer
            }
          >
            <BarChart
              data={{
                labels:
                  weekLabels,

                datasets: [
                  {
                    data:
                      weeklySeries.map(
                        (
                          d
                        ) =>
                          d.fats
                      ),
                  },
                ],
              }}

              width={
                chartWidth
              }

              height={260}
          
              fromZero
              
              showValuesOnTopOfBars={false}

              verticalLabelRotation={0}

              segments={4}
              withHorizontalLabels={true}
              withVerticalLabels={true}


              yAxisSuffix="g"

              chartConfig={{
                ...chartConfig,

                color:
                  (
                    opacity = 1
                  ) =>
                    `rgba(239,68,68,${opacity})`,
              }}

              style={
                styles.chart
              }
            />
          </View>
        </>
      ) : (
        <View
          style={
            styles.emptyChart
          }
        >
          <Ionicons
            name="analytics"
            size={50}
            color={
              COLORS.subtext
            }
          />

          <Text
            style={
              styles.emptyText
            }
          >
            Scan meals to
            unlock analytics
          </Text>
        </View>
      )}

      {/* EXPORT */}

      <Text
        style={
          styles.section
        }
      >
        Download Reports
      </Text>

      <Text
        style={
          styles.exportHint
        }
      >
        Premium PDF includes:
        charts, nutrition
        breakdown, streak,
        goals and meal
        analysis.
      </Text>

      <TouchableOpacity
        style={
          styles.exportBtn
        }
        onPress={() =>
          handleExport(
            "weekly"
          )
        }
        disabled={
          !!exporting
        }
      >
        {exporting ===
        "weekly" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons
              name="download"
              size={20}
              color="white"
            />

            <Text
              style={
                styles.exportBtnText
              }
            >
              Download Weekly
              Report
            </Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.exportBtn,
          styles.exportBtnAlt,
        ]}
        onPress={() =>
          handleExport(
            "full"
          )
        }
        disabled={
          !!exporting
        }
      >
        {exporting ===
        "full" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons
              name="document-text"
              size={20}
              color="white"
            />

            <Text
              style={
                styles.exportBtnText
              }
            >
              Download Full
              Nutrition Report
            </Text>
          </>
        )}
      </TouchableOpacity>

      <View
        style={{
          height: 100,
        }}
      />
    </ScrollView>
  );
}

function StatCard({
  label,
  value,
  unit,
  icon,
  color,
}) {
  return (
    <View
      style={styles.card}
    >
      <Ionicons
        name={icon}
        size={26}
        color={color}
      />

      <Text
        style={
          styles.label
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.value
        }
      >
        {value}

        <Text
          style={
            styles.unit
          }
        >
          {" "}
          {unit}
        </Text>
      </Text>
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

    subHeading: {
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

    streakBadge: {
      backgroundColor:
        COLORS.card,

      paddingHorizontal: 18,

      paddingVertical: 10,

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        COLORS.border,
    },

    streakText: {
      color:
        COLORS.primary,

      fontWeight:
        "bold",
    },

    scoreCard: {
      ...globalStyles.card,

      alignItems:
        "center",

      paddingVertical: 35,
    },

    scoreValue: {
      color: COLORS.text,

      fontSize: 52,

      fontWeight: "bold",

      marginTop: 10,
    },

    scoreLabel: {
      color:
        COLORS.subtext,

      fontSize: 16,

      marginTop: 8,
    },

    section: {
      color: COLORS.text,

      fontSize: 24,

      fontWeight: "bold",

      marginTop: 30,

      marginBottom: 16,
    },

    statsRow: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      marginBottom: 16,
    },

    card: {
      ...globalStyles.card,

      width: "48%",
    },

    label: {
      color:
        COLORS.subtext,

      fontSize: 15,

      marginTop: 14,
    },

    value: {
      color: COLORS.text,

      fontSize: 30,

      fontWeight: "bold",

      marginTop: 8,
    },

    unit: {
      fontSize: 15,

      color:
        COLORS.subtext,

      fontWeight:
        "normal",
    },

    chartContainer: {
      ...globalStyles.card,
      padding : 15,
      overflow: "hidden",
    },
    
    chart: {
      borderRadius: 20,
    },

    emptyChart: {
      ...globalStyles.card,

      alignItems:
        "center",

      paddingVertical: 50,
    },

    emptyText: {
      color:
        COLORS.subtext,

      fontSize: 16,

      textAlign:
        "center",

      marginTop: 14,
    },

    exportHint: {
      color:
        COLORS.subtext,

      fontSize: 14,

      lineHeight: 22,

      marginBottom: 18,
    },

    exportBtn: {
      backgroundColor:
        COLORS.primary,

      padding: 20,

      borderRadius: 22,

      alignItems:
        "center",

      justifyContent:
        "center",

      flexDirection:
        "row",

      marginBottom: 16,

      shadowColor:
        COLORS.primary,

      shadowOpacity: 0.4,

      shadowRadius: 10,

      elevation: 8,
    },

    exportBtnAlt: {
      backgroundColor:
        COLORS.protein,
    },

    exportBtnText: {
      color: "white",

      fontWeight:
        "bold",

      fontSize: 16,

      marginLeft: 10,
    },
  });
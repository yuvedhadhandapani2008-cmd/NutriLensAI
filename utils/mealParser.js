export function parseMealNutrition(text) {
  if (!text) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      healthScore: 0,
    };
  }

  const lower = text.toLowerCase();

  const num = (pattern) => {
    const match = lower.match(pattern);
    return match ? parseInt(match[1], 10) : 0;
  };

  return {
    calories: num(
      /total overall calories[^0-9]*(\d+)/i
    ),
    protein: num(/total protein[^0-9]*(\d+)/i),
    carbs: num(/total carbs[^0-9]*(\d+)/i),
    fats: num(/total fat[^0-9]*(\d+)/i),
    fiber: num(/total fiber[^0-9]*(\d+)/i),
    healthScore: num(/health score:\s*(\d+)/i),
  };
}

export function sumNutrition(meals) {
  return meals.reduce(
    (acc, meal) => {
      const n = parseMealNutrition(
        meal.result || meal
      );
      return {
        calories: acc.calories + n.calories,
        protein: acc.protein + n.protein,
        carbs: acc.carbs + n.carbs,
        fats: acc.fats + n.fats,
        fiber: acc.fiber + n.fiber,
        healthScores: n.healthScore
          ? [...acc.healthScores, n.healthScore]
          : acc.healthScores,
      };
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      healthScores: [],
    }
  );
}

export function getMealDate(meal) {
  if (!meal?.createdAt?.seconds) {
    return null;
  }
  return new Date(meal.createdAt.seconds * 1000);
}

export function isSameDay(dateA, dateB) {
  if (!dateA || !dateB) return false;
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function filterMealsByDay(meals, date) {
  return meals.filter((meal) => {
    const mealDate = getMealDate(meal);
    return mealDate && isSameDay(mealDate, date);
  });
}

export function filterMealsLastNDays(meals, days) {
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (days - 1));

  return meals.filter((meal) => {
    const mealDate = getMealDate(meal);
    return mealDate && mealDate >= cutoff;
  });
}

export function groupMealsByDate(meals) {
  const map = {};
  meals.forEach((meal) => {
    const d = getMealDate(meal);
    if (!d) return;
    const key = d.toISOString().slice(0, 10);
    if (!map[key]) map[key] = [];
    map[key].push(meal);
  });
  return map;
}

export function getWeeklyDayLabels() {
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(
      d.toLocaleDateString("en-US", { weekday: "short" })
    );
  }
  return labels;
}

export function getWeeklyNutritionSeries(meals) {
  const series = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const dayMeals = filterMealsByDay(meals, day);
    const totals = sumNutrition(dayMeals);
    series.push({
      date: day,
      label: day.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      calories: totals.calories,
      protein: totals.protein,
      carbs: totals.carbs,
      fats: totals.fats,
      mealCount: dayMeals.length,
    });
  }
  return series;
}

export function calculateMicrosScore(totals, goals) {
  const fiberTarget = 30;
  const fiberScore = Math.min(
    100,
    (totals.fiber / fiberTarget) * 100
  );

  const avgHealth =
    totals.healthScores?.length > 0
      ? totals.healthScores.reduce((a, b) => a + b, 0) /
        totals.healthScores.length
      : 5;

  const healthScore = (avgHealth / 10) * 100;

  const vitaminBonus = Math.min(
    20,
    totals.healthScores?.length * 5
  );

  return Math.min(
    100,
    Math.round(
      fiberScore * 0.4 +
        healthScore * 0.5 +
        vitaminBonus
    )
  );
}

export function ringPercent(value, goal) {
  if (!goal || goal <= 0) return 0;
  return Math.min(100, Math.round((value / goal) * 100));
}

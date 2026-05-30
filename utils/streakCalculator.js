import { getMealDate } from "./mealParser";

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

export function getUniqueMealDates(meals) {
  const dates = new Set();
  meals.forEach((meal) => {
    const d = getMealDate(meal);
    if (d) dates.add(dateKey(d));
  });
  return dates;
}

/**
 * Consecutive days with at least one logged meal, counting back from today.
 */
export function calculateStreak(meals) {
  const dates = getUniqueMealDates(meals);
  if (dates.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = dateKey(cursor);
    if (dates.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Consecutive days where BOTH users logged at least one meal.
 */
export function calculateTeamStreak(mealsA, mealsB) {
  const datesA = getUniqueMealDates(mealsA);
  const datesB = getUniqueMealDates(mealsB);
  if (datesA.size === 0 || datesB.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = dateKey(cursor);
    if (datesA.has(key) && datesB.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function calculateFitnessScore({
  streak,
  caloriePercent,
  proteinPercent,
  carbsPercent,
  fatsPercent,
  mealsToday,
}) {
  const macroAvg =
    (caloriePercent +
      proteinPercent +
      carbsPercent +
      fatsPercent) /
    4;

  const streakBonus = Math.min(streak, 30) * 1.5;
  const loggingBonus = Math.min(mealsToday, 4) * 5;

  return Math.min(
    100,
    Math.round(macroAvg * 0.55 + streakBonus + loggingBonus)
  );
}

import { calculateNutritionGoals }
from "./nutritionGoals";

/**
 * Always derive ring goals from height, weight, age, gender, activity & fitness goal.
 */
export function resolveProfileWithGoals(profile) {
  if (!profile) return null;

  const hasMetrics =
    profile.weight &&
    profile.height;

  if (!hasMetrics) {
    return profile;
  }

  const goals = calculateNutritionGoals({
    weight: profile.weight,
    height: profile.height,
    age: profile.age,
    gender: profile.gender,
    activityLevel: profile.activityLevel,
    goal: profile.goal,
  });

  return {
    ...profile,
    ...goals,
  };
}

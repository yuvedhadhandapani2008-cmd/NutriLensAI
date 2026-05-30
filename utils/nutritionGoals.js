/**
 * Mifflin-St Jeor BMR + activity multiplier + goal adjustment.
 * Returns daily calorie and macro targets in grams.
 */
export function calculateNutritionGoals({
  weight,
  height,
  age,
  gender,
  activityLevel,
  goal,
}) {
  const w = Number(weight) || 70;
  const h = Number(height) || 170;
  const a = Number(age) || 25;
  const isMale =
    (gender || "Male").toLowerCase() !== "female";

  let bmr =
    10 * w + 6.25 * h - 5 * a + (isMale ? 5 : -161);

  const activityMultipliers = {
    Low: 1.2,
    Moderate: 1.55,
    High: 1.725,
  };

  const multiplier =
    activityMultipliers[activityLevel] ||
    activityMultipliers.Moderate;

  let tdee = Math.round(bmr * multiplier);

  const goalAdjustments = {
    "Weight Loss": -500,
    "Fat Loss": -400,
    Maintenance: 0,
    "Muscle Gain": 300,
    "Lean Bulk": 250,
    "Body Recomposition": -150,
    "Athletic Performance": 400,
  };

  tdee += goalAdjustments[goal] ?? 0;
  tdee = Math.max(1200, tdee);

  const proteinPerKg = {
    "Weight Loss": 2.0,
    "Fat Loss": 2.2,
    Maintenance: 1.6,
    "Muscle Gain": 2.0,
    "Lean Bulk": 1.8,
    "Body Recomposition": 2.2,
    "Athletic Performance": 1.8,
  };

  const proteinGoal = Math.round(
    w * (proteinPerKg[goal] ?? 1.8)
  );

  const fatPercent = {
    "Weight Loss": 0.28,
    "Fat Loss": 0.3,
    Maintenance: 0.28,
    "Muscle Gain": 0.25,
    "Lean Bulk": 0.27,
    "Body Recomposition": 0.3,
    "Athletic Performance": 0.25,
  };

  const fatsGoal = Math.round(
    (tdee * (fatPercent[goal] ?? 0.28)) / 9
  );

  const proteinCalories = proteinGoal * 4;
  const fatCalories = fatsGoal * 9;
  const carbsGoal = Math.max(
    50,
    Math.round(
      (tdee - proteinCalories - fatCalories) / 4
    )
  );

  const waterGoal = Math.max(
    6,
    Math.min(14, Math.round((w * 35) / 250))
  );

  const microsGoal = 100;

  return {
    calorieGoal: tdee,
    proteinGoal,
    carbsGoal,
    fatsGoal,
    waterGoal,
    microsGoal,
  };
}

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db }
from "../firebaseConfig";

import { resolveProfileWithGoals }
from "../utils/profileGoals";

import {
  sumNutrition,
  filterMealsByDay,
} from "../utils/mealParser";

import {
  calculateStreak,
  calculateFitnessScore,
} from "../utils/streakCalculator";

import { ringPercent }
from "../utils/mealParser";

export function getUid() {
  return auth.currentUser?.uid || null;
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

const legacyProfileRef = () =>
  doc(db, "profile", "userData");

const legacyMealsRef = () =>
  collection(db, "meals");

const legacyTrackingRef = () =>
  doc(db, "tracking", "dailyState");

export const userProfileRef = (uid) =>
  doc(db, "users", uid, "profile", "data");

export const userMealsRef = (uid) =>
  collection(db, "users", uid, "meals");

export const userTrackingRef = (uid) =>
  doc(db, "users", uid, "tracking", "daily");

export const userAccountRef = (uid) =>
  doc(db, "users", uid, "account", "info");

export const userDailyStatsRef = (uid, date) =>
  doc(db, "users", uid, "dailyStats", date);

export async function getProfile() {
  const uid = getUid();

  if (uid) {
    const userSnap = await getDoc(
      userProfileRef(uid)
    );
    if (userSnap.exists()) {
      return resolveProfileWithGoals(
        userSnap.data()
      );
    }
  }

  const legacySnap = await getDoc(
    legacyProfileRef()
  );

  if (!legacySnap.exists()) {
    return null;
  }

  const data = resolveProfileWithGoals(
    legacySnap.data()
  );

  if (uid) {
    await setDoc(userProfileRef(uid), data);
  }

  return data;
}

export async function saveProfile(profileData) {
  const resolved =
    resolveProfileWithGoals(profileData);
  const uid = getUid();

  if (uid) {
    await setDoc(userProfileRef(uid), resolved);
  }

  await setDoc(legacyProfileRef(), resolved);

  return resolved;
}

export async function getMeals() {
  const uid = getUid();
  let userMeals = [];
  let legacyMeals = [];

  if (uid) {
    const userSnap = await getDocs(
      userMealsRef(uid)
    );
    userMeals = userSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  }

  const legacySnap = await getDocs(
    legacyMealsRef()
  );
  legacyMeals = legacySnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  if (userMeals.length > 0) {
    return userMeals;
  }

  return legacyMeals;
}

export async function addMeal(mealData) {
  const uid = getUid();
  const payload = {
    ...mealData,
    createdAt: serverTimestamp(),
  };

  if (uid) {
    const ref = await addDoc(
      userMealsRef(uid),
      payload
    );
    return ref.id;
  }

  const ref = await addDoc(
    legacyMealsRef(),
    payload
  );
  return ref.id;
}

export async function getDailyWater() {
  const key = todayKey();
  const uid = getUid();

  if (uid) {
    const snap = await getDoc(
      userTrackingRef(uid)
    );
    if (snap.exists()) {
      const data = snap.data();
      if (data.date === key) {
        return data.water || 0;
      }
      await setDoc(userTrackingRef(uid), {
        date: key,
        water: 0,
      });
      return 0;
    }
    return 0;
  }

  const snap = await getDoc(legacyTrackingRef());
  if (snap.exists()) {
    const data = snap.data();
    if (data.date === key) {
      return data.water || 0;
    }
  }

  return 0;
}

export async function setDailyWater(water) {
  const key = todayKey();
  const uid = getUid();

  if (uid) {
    await setDoc(
      userTrackingRef(uid),
      { date: key, water },
      { merge: true }
    );
  }

  await setDoc(
    legacyTrackingRef(),
    { date: key, water },
    { merge: true }
  );
}

export async function syncTodayStats(
  profile,
  allMeals
) {
  const uid = getUid();
  if (!uid || !profile) return;

  const today = new Date();
  const todayMeals = filterMealsByDay(
    allMeals,
    today
  );
  const totals = sumNutrition(todayMeals);
  const goals = resolveProfileWithGoals(profile);
  const streak = calculateStreak(allMeals);

  const fitnessScore = calculateFitnessScore({
    streak,
    caloriePercent: ringPercent(
      totals.calories,
      goals.calorieGoal
    ),
    proteinPercent: ringPercent(
      totals.protein,
      goals.proteinGoal
    ),
    carbsPercent: ringPercent(
      totals.carbs,
      goals.carbsGoal
    ),
    fatsPercent: ringPercent(
      totals.fats,
      goals.fatsGoal
    ),
    mealsToday: todayMeals.length,
  });

  await setDoc(
    userDailyStatsRef(uid, todayKey()),
    {
      date: todayKey(),
      calories: totals.calories,
      protein: totals.protein,
      carbs: totals.carbs,
      fats: totals.fats,
      streak,
      fitnessScore,
      displayName:
        profile.name || "You",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

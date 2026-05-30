import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db, auth }
from "../firebaseConfig";

import {
  getUid,
  userAccountRef,
  todayKey,
} from "./userData";

import { calculateTeamStreak }
from "../utils/streakCalculator";

import { getMeals }
from "./userData";

function generateInviteCode() {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
}

export async function ensureAccount(displayName) {
  const uid = getUid();
  if (!uid) return null;

  const ref = userAccountRef(uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data();
  }

  const inviteCode = generateInviteCode();
  const account = {
    uid,
    displayName: displayName || "Athlete",
    inviteCode,
    teamId: null,
    partnerUid: null,
    createdAt: serverTimestamp(),
  };

  await setDoc(ref, account);
  await setDoc(doc(db, "invites", inviteCode), {
    inviterUid: uid,
    inviterName: displayName || "Athlete",
    used: false,
    createdAt: serverTimestamp(),
  });

  return account;
}

export async function getOrCreateInviteCode(
  displayName
) {
  const account = await ensureAccount(
    displayName
  );
  return account?.inviteCode || null;
}

export async function joinPartnerWithCode(
  code,
  joinerName
) {
  const uid = getUid();
  if (!uid) {
    throw new Error("You must be logged in.");
  }

  const normalized = (code || "")
    .trim()
    .toUpperCase();

  if (!normalized) {
    throw new Error("Enter a valid invite code.");
  }

  const inviteRef = doc(
    db,
    "invites",
    normalized
  );
  const inviteSnap = await getDoc(
    inviteRef
  );

  if (!inviteSnap.exists()) {
    throw new Error("Invite code not found.");
  }

  const invite = inviteSnap.data();

  if (invite.used) {
    throw new Error("This invite code was already used.");
  }

  if (invite.inviterUid === uid) {
    throw new Error("You cannot join your own invite.");
  }

  const joinerAccountRef =
    userAccountRef(uid);
  const joinerSnap = await getDoc(
    joinerAccountRef
  );

  if (
    joinerSnap.exists() &&
    joinerSnap.data().teamId
  ) {
    throw new Error(
      "You are already linked with a partner."
    );
  }

  const inviterUid = invite.inviterUid;
  const inviterAccountRef =
    userAccountRef(inviterUid);
  const inviterSnap = await getDoc(
    inviterAccountRef
  );

  if (
    inviterSnap.exists() &&
    inviterSnap.data().teamId
  ) {
    throw new Error(
      "This user already has a partner."
    );
  }

  const teamId = `team_${inviterUid}_${uid}`;

  await setDoc(doc(db, "teams", teamId), {
    memberUids: [inviterUid, uid],
    memberNames: {
      [inviterUid]:
        invite.inviterName || "Partner",
      [uid]: joinerName || "You",
    },
    createdAt: serverTimestamp(),
    challenge: {
      title: "Weekly Protein Challenge",
      target: 1400,
      unit: "g protein (team)",
      progress: 0,
      weekStart: todayKey(),
    },
    motivation: "Team up and hit your goals together!",
  });

  await updateDoc(inviteRef, { used: true });

  await setDoc(
    inviterAccountRef,
    {
      teamId,
      partnerUid: uid,
      partnerName: joinerName || "Partner",
    },
    { merge: true }
  );

  await setDoc(
    joinerAccountRef,
    {
      uid,
      displayName: joinerName || "You",
      teamId,
      partnerUid: inviterUid,
      partnerName:
        invite.inviterName || "Partner",
      inviteCode:
        joinerSnap.data()?.inviteCode ||
        generateInviteCode(),
    },
    { merge: true }
  );

  return teamId;
}

export async function savePartnerNickname(
  nickname
) {
  const uid = getUid();
  if (!uid) return;

  await setDoc(
    userAccountRef(uid),
    { partnerNickname: nickname },
    { merge: true }
  );

  await setDoc(
    doc(db, "partner", "partnerData"),
    { partnerName: nickname },
    { merge: true }
  );
}

export function subscribePartnerTeam(
  onUpdate
) {
  const uid = getUid();
  if (!uid) {
    onUpdate(null);
    return () => {};
  }

  let teamUnsub = () => {};
  let partnerStatsUnsub = () => {};

  const accountUnsub = onSnapshot(
    userAccountRef(uid),
    async (accountSnap) => {
      teamUnsub();
      partnerStatsUnsub();

      if (!accountSnap.exists()) {
        onUpdate(null);
        return;
      }

      const account = accountSnap.data();

      if (!account.teamId) {
        onUpdate({
          account,
          team: null,
          partnerStats: null,
          myStats: null,
          computed: null,
        });
        return;
      }

      teamUnsub = onSnapshot(
        doc(db, "teams", account.teamId),
        (teamSnap) => {
          const team = teamSnap.exists()
            ? teamSnap.data()
            : null;
          const partnerUid =
            account.partnerUid;

          if (!partnerUid) {
            onUpdate({
              account,
              team,
              partnerStats: null,
              myStats: null,
              computed: null,
            });
            return;
          }

          partnerStatsUnsub = onSnapshot(
            doc(
              db,
              "users",
              partnerUid,
              "dailyStats",
              todayKey()
            ),
            async (partnerSnap) => {
              const myStatsSnap =
                await getDoc(
                  doc(
                    db,
                    "users",
                    uid,
                    "dailyStats",
                    todayKey()
                  )
                );

              const partnerStats =
                partnerSnap.exists()
                  ? partnerSnap.data()
                  : {
                      protein: 0,
                      calories: 0,
                      streak: 0,
                      fitnessScore: 0,
                    };

              const myStats =
                myStatsSnap.exists()
                  ? myStatsSnap.data()
                  : {
                      protein: 0,
                      calories: 0,
                      streak: 0,
                      fitnessScore: 0,
                    };

              const [myMeals, partnerMeals] =
                await Promise.all([
                  getMeals(),
                  fetchPartnerMeals(partnerUid),
                ]);

              const teamStreak =
                calculateTeamStreak(
                  myMeals,
                  partnerMeals
                );

              const combinedCalories =
                (myStats.calories || 0) +
                (partnerStats.calories || 0);

              const combinedProtein =
                (myStats.protein || 0) +
                (partnerStats.protein || 0);

              const challengeTarget =
                team?.challenge?.target || 1400;
              const challengeProgress =
                combinedProtein;

              const leaderboard = [
                {
                  name:
                    team?.memberNames?.[uid] ||
                    myStats.displayName ||
                    "You",
                  protein: myStats.protein || 0,
                  streak: myStats.streak || 0,
                  score:
                    myStats.fitnessScore || 0,
                  isYou: true,
                },
                {
                  name:
                    team?.memberNames?.[
                      partnerUid
                    ] ||
                    account.partnerName ||
                    "Partner",
                  protein:
                    partnerStats.protein || 0,
                  streak:
                    partnerStats.streak || 0,
                  score:
                    partnerStats.fitnessScore ||
                    0,
                  isYou: false,
                },
              ].sort(
                (a, b) => b.protein - a.protein
              );

              const proteinGap =
                (partnerStats.protein || 0) -
                (myStats.protein || 0);

              let motivation =
                team?.motivation ||
                "Keep logging meals!";

              if (proteinGap > 15) {
                motivation = `💪 Partner is ${proteinGap}g ahead on protein — catch up!`;
              } else if (proteinGap < -15) {
                motivation = `🔥 You're ${Math.abs(proteinGap)}g ahead — lead the team!`;
              } else {
                motivation =
                  "🤝 You're neck and neck today — great teamwork!";
              }

              onUpdate({
                account,
                team,
                partnerStats,
                myStats,
                computed: {
                  teamStreak,
                  combinedCalories,
                  combinedProtein,
                  challengeProgress,
                  challengeTarget,
                  leaderboard,
                  motivation,
                  combinedScore: Math.round(
                    ((myStats.fitnessScore || 0) +
                      (partnerStats.fitnessScore ||
                        0)) /
                      2
                  ),
                },
              });
            }
          );
        }
      );
    }
  );

  return () => {
    accountUnsub();
    teamUnsub();
    partnerStatsUnsub();
  };
}

async function fetchPartnerMeals(partnerUid) {
  const snap = await getDocs(
    collection(
      db,
      "users",
      partnerUid,
      "meals"
    )
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export function getCurrentUser() {
  return auth.currentUser;
}

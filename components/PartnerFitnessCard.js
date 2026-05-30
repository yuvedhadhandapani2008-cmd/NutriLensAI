import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  joinPartnerWithCode,
  savePartnerNickname,
  getOrCreateInviteCode,
} from "../services/partnerService";

export default function PartnerFitnessCard({
  partnerState,
  partnerName,
  onPartnerNameChange,
  profileName,
}) {
  const [inviteCode, setInviteCode] =
    useState("");
  const [joinCode, setJoinCode] =
    useState("");
  const [loading, setLoading] =
    useState(false);

  const account = partnerState?.account;
  const computed = partnerState?.computed;
  const hasTeam = !!account?.teamId;

  const loadMyInvite = async () => {
    setLoading(true);
    try {
      const code = await getOrCreateInviteCode(
        profileName
      );
      setInviteCode(code || "");
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!inviteCode && profileName) {
      loadMyInvite();
    }
  }, [profileName]);

  const handleJoin = async () => {
    setLoading(true);
    try {
      await joinPartnerWithCode(
        joinCode,
        profileName
      );
      Alert.alert(
        "Connected!",
        "You and your gym partner are now linked. Stats sync in real time."
      );
      setJoinCode("");
    } catch (e) {
      Alert.alert("Could not connect", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNickname = async () => {
    try {
      await savePartnerNickname(partnerName);
      Alert.alert("Saved", "Partner nickname updated.");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.partnerCard}>
      <Text style={styles.partnerTitle}>
        Gym Partner
      </Text>

      <Text style={styles.sectionLabel}>
        Your invite code
      </Text>
      <View style={styles.codeRow}>
        <Text style={styles.inviteCode}>
          {inviteCode || "······"}
        </Text>
        <TouchableOpacity
          style={styles.smallBtn}
          onPress={loadMyInvite}
        >
          <Text style={styles.smallBtnText}>
            Refresh
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>
        Share this code with your gym friend so they can connect.
      </Text>

      {!hasTeam ? (
        <>
          <Text style={styles.sectionLabel}>
            Enter partner&apos;s code
          </Text>
          <TextInput
            style={styles.input}
            placeholder="INVITE CODE"
            placeholderTextColor="#777"
            value={joinCode}
            onChangeText={(t) =>
              setJoinCode(t.toUpperCase())
            }
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={styles.partnerButton}
            onPress={handleJoin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.partnerBtnText}>
                Connect Partner
              </Text>
            )}
          </TouchableOpacity>
        </>
      ) : null}

      <Text style={styles.sectionLabel}>
        Partner nickname (optional)
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Partner Name"
        placeholderTextColor="#777"
        value={partnerName}
        onChangeText={onPartnerNameChange}
      />
      <TouchableOpacity
        style={styles.partnerButtonSecondary}
        onPress={handleSaveNickname}
      >
        <Text style={styles.partnerBtnText}>
          Save Partner Name
        </Text>
      </TouchableOpacity>

      {hasTeam && computed ? (
        <View style={styles.teamBlock}>
          <Text style={styles.teamStreak}>
            🔥 Team Streak: {computed.teamStreak} Days
          </Text>

          <View style={styles.teamRow}>
            <View style={styles.teamStat}>
              <Text style={styles.teamStatValue}>
                {computed.combinedCalories}
              </Text>
              <Text style={styles.teamStatLabel}>
                Combined kcal (today)
              </Text>
            </View>
            <View style={styles.teamStat}>
              <Text style={styles.teamStatValue}>
                {computed.combinedProtein}g
              </Text>
              <Text style={styles.teamStatLabel}>
                Combined protein
              </Text>
            </View>
          </View>

          <Text style={styles.compareTitle}>
            Today&apos;s protein
          </Text>
          <Text style={styles.youLine}>
            You: {partnerState.myStats?.protein || 0}g
            protein
          </Text>
          <Text style={styles.partnerLine}>
            {account.partnerName || "Partner"}:{" "}
            {partnerState.partnerStats?.protein || 0}g
            protein
          </Text>

          <Text style={styles.challengeTitle}>
            {partnerState.team?.challenge?.title ||
              "Weekly Challenge"}
          </Text>
          <View style={styles.challengeBar}>
            <View
              style={[
                styles.challengeFill,
                {
                  width: `${Math.min(
                    100,
                    (computed.challengeProgress /
                      computed.challengeTarget) *
                      100
                  )}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.challengeText}>
            {computed.challengeProgress} /{" "}
            {computed.challengeTarget}g team protein
          </Text>

          <Text style={styles.leaderboardTitle}>
            Leaderboard (today)
          </Text>
          {computed.leaderboard.map((row, i) => (
            <View key={i} style={styles.leaderRow}>
              <Text style={styles.leaderRank}>
                #{i + 1}
              </Text>
              <Text style={styles.leaderName}>
                {row.name}
                {row.isYou ? " (you)" : ""}
              </Text>
              <Text style={styles.leaderProtein}>
                {row.protein}g
              </Text>
            </View>
          ))}

          <Text style={styles.motivation}>
            {computed.motivation}
          </Text>

          <Text style={styles.partnerInfo}>
            🤝 Combined fitness score:{" "}
            {computed.combinedScore}
          </Text>
        </View>
      ) : partnerName ? (
        <Text style={styles.partnerInfo}>
          Connect with an invite code to unlock team
          stats.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  partnerCard: {
    backgroundColor: "#181818",
    borderRadius: 30,
    padding: 25,
  },
  partnerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionLabel: {
    color: "#888",
    fontSize: 14,
    marginTop: 12,
    marginBottom: 8,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inviteCode: {
    color: "#00cc88",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 4,
  },
  smallBtn: {
    backgroundColor: "#0f0f0f",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  smallBtnText: {
    color: "#00cc88",
    fontWeight: "bold",
  },
  hint: {
    color: "#666",
    fontSize: 13,
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#0f0f0f",
    color: "white",
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
  },
  partnerButton: {
    backgroundColor: "#00cc88",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 8,
  },
  partnerButtonSecondary: {
    backgroundColor: "#1495ff",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },
  partnerBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  teamBlock: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 20,
  },
  teamStreak: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  teamStat: {
    width: "48%",
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },
  teamStatValue: {
    color: "#00cc88",
    fontSize: 22,
    fontWeight: "bold",
  },
  teamStatLabel: {
    color: "#888",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },
  compareTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  youLine: {
    color: "#00cc88",
    fontSize: 15,
    marginBottom: 4,
  },
  partnerLine: {
    color: "#1495ff",
    fontSize: 15,
    marginBottom: 16,
  },
  challengeTitle: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
  },
  challengeBar: {
    height: 10,
    backgroundColor: "#333",
    borderRadius: 8,
    overflow: "hidden",
  },
  challengeFill: {
    height: "100%",
    backgroundColor: "#00cc88",
  },
  challengeText: {
    color: "#888",
    marginTop: 8,
    marginBottom: 16,
    fontSize: 13,
  },
  leaderboardTitle: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  leaderRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  leaderRank: {
    color: "#00cc88",
    fontWeight: "bold",
    width: 36,
  },
  leaderName: {
    color: "white",
    flex: 1,
  },
  leaderProtein: {
    color: "#00cc88",
    fontWeight: "bold",
  },
  motivation: {
    color: "#ffaa00",
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
  },
  partnerInfo: {
    color: "#00cc88",
    marginTop: 18,
    fontSize: 16,
    fontWeight: "bold",
  },
});

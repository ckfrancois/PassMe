import Passling from "@/components/passling";
import { useAuth } from "@/hooks/use-auth";
import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type PassedUser = {
  uid: string;
  displayName?: string;
  passlingData?: any;
};

const PasslingList = () => {
  const { currentUser } = useAuth();
  const [passedUsers, setPassedUsers] = useState<PassedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchPassedUsers = async () => {
      try {
        const userSnap = await firestore()
          .collection("Users")
          .doc(currentUser.uid)
          .get();

        const usersPassed: string[] = userSnap.data()?.usersPassed ?? [];

        if (usersPassed.length === 0) {
          setPassedUsers([]);
          return;
        }

        const users = await Promise.all(
          usersPassed.map(async (uid) => {
            const [userDoc, passlingDoc] = await Promise.all([
              firestore().collection("Users").doc(uid).get(),
              firestore().collection("Passlings").doc(uid).get(),
            ]);

            return {
              uid,
              displayName: userDoc.data()?.displayName,
              passlingData: passlingDoc.exists ? passlingDoc.data() : null,
            };
          })
        );

        setPassedUsers(users);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading users");
      } finally {
        setLoading(false);
      }
    };

    fetchPassedUsers();
  }, [currentUser]);

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={ORANGE} />
      </View>
    );

  if (error)
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: BG_PINK }}>
      {/* Dotted background pattern */}
      <View style={styles.patternContainer} pointerEvents="none">
        {Array.from({ length: 450 }).map((_, i) => (
          <View key={i} style={styles.square} />
        ))}
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Passlings</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{passedUsers.length}</Text>
          </View>
        </View>

        {/* List */}
        <View style={styles.listWrapper}>
          <FlatList
            data={passedUsers}
            keyExtractor={(item) => item.uid}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.card}>
                {/* Avatar circle */}
                <View style={styles.avatarOuter}>
                  <View style={styles.avatarInner}>
                    {item.passlingData ? (
                      <View
                        style={{
                          transform: [{ translateX: 5 }, { translateY: 20 }],
                        }}
                      >
                        <Passling data={item.passlingData} size={100} />
                      </View>
                    ) : (
                      <Text style={styles.emoji}>👋</Text>
                    )}
                  </View>
                </View>

                {/* Text */}
                <View style={styles.textContainer}>
                  <Text style={styles.title}>
                    {item.displayName || "Unnamed User"}
                  </Text>
                  {item.passlingData?.name && (
                    <View style={styles.namePill}>
                      <Text style={styles.namePillText}>
                        {item.passlingData.name}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No passlings yet!</Text>
                <Text style={styles.emptySubtitle}>
                  Pass someone to see them here.
                </Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PasslingList;

const CREAM = "#F5F0E8";
const ORANGE = "#C4611A";
const BLACK = "#000000";
const BG_PINK = "#f0b4e2";
const PATTERN_COLOR = "rgba(230, 150, 210, 0.5)";

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BG_PINK,
  },
  error: {
    color: "red",
    fontSize: 15,
    textAlign: "center",
  },

  // Background pattern
  patternContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    flexWrap: "wrap",
    zIndex: 0,
  },
  square: {
    width: 70,
    height: 70,
    borderRadius: 20,
    margin: 10,
    backgroundColor: PATTERN_COLOR,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: BLACK,
    letterSpacing: 0.5,
  },
  countBadge: {
    backgroundColor: ORANGE,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  // List
  listWrapper: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: CREAM,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: BLACK,
    overflow: "hidden",
    marginBottom: 16,
  },
  listContent: {
    padding: 12,
    gap: 10,
  },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: BLACK,
    padding: 10,
    gap: 14,
  },
  avatarOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2.5,
    borderColor: BLACK,
    backgroundColor: BG_PINK,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  textContainer: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: BLACK,
  },
  namePill: {
    alignSelf: "flex-start",
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  namePillText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emoji: {
    fontSize: 22,
  },

  // Empty
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: BLACK,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
  },
});
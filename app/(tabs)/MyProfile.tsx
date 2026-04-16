import { useAuth } from "@/hooks/use-auth";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import Passling from "../../components/passling";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const normalizeToRgba = (colorString: string, t: Float) => {
  if (!colorString) return "rgba(255,255,255,1)";
  const values = colorString.replace(/[()]/g, "").split(",");
  const r = Math.round(parseFloat(values[0]) * 255);
  const g = Math.round(parseFloat(values[1]) * 255);
  const b = Math.round(parseFloat(values[2]) * 255);
  const a = values[3] ? values[3].trim() : "1.0";
  const i = (r + g + b) / 3;
  const r2 = r + (i - r) * t;
  const g2 = g + (i - g) * t;
  const b2 = b + (i - b) * t;
  return `rgba(${r2}, ${g2}, ${b2}, ${a})`;
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ReadOnlyFieldProps {
  value: string;
  multiline?: boolean;
}

// ---------------------------------------------------------------------------
// Simplified Field Component (Read Only)
// ---------------------------------------------------------------------------
function ReadOnlyField({ value, multiline = false }: ReadOnlyFieldProps) {
  return (
    <View style={[styles.fieldBox, multiline && styles.fieldBoxMulti]}>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldInputMulti]}
        value={value}
        editable={false}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        placeholderTextColor="#aaa"
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// ProfileScreen
// ---------------------------------------------------------------------------
export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || "Unknown User",
  );
  const [greeting, setGreeting] = useState("Hello there!");
  const [bio, setBio] = useState("This is my bio.");
  const [passlingData, setPasslingData] = useState<any>(null);
  const [loadingPassling, setLoadingPassling] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const refreshAll = async () => {
        const user = currentUser;
        if (!user) return;

        try {
          // ONLY show spinner if we don't have data yet
          if (!passlingData) {
            setLoadingPassling(true);
          }

          await user.reload();
          setDisplayName(currentUser?.displayName || "Unknown User");

          const data = await fetchPasslingData();
          setPasslingData(data);
        } catch (error) {
          console.error("Failed to refresh:", error);
        } finally {
          // Always turn off loading at the end
          setLoadingPassling(false);
        }
      };

      refreshAll();
    }, [passlingData]), // Add passlingData as a dependency to check its existence
  );

  useFocusEffect(
    useCallback(() => {
      const refreshAll = async () => {
        const user = currentUser;
        if (!user) return;
        try {
          await user.reload();
          setDisplayName(currentUser?.displayName || "Unknown User");
          setLoadingPassling(true);
          const data = await fetchPasslingData();
          setPasslingData(data);
          setLoadingPassling(false);
        } catch (error) {
          console.error("Failed to refresh:", error);
          setLoadingPassling(false);
        }
      };
      refreshAll();
    }, []),
  );

  const fetchPasslingData = async () => {
    const user = currentUser;
    if (!user) return null;
    try {
      const userSnap = await firestore()
        .collection("Passlings")
        .doc(user.uid)
        .get();

      if (userSnap.exists) {
        // ✅ .exists (not .exists())
        return userSnap.data();
      } else {
        console.log("❌ No passling found for", user.uid);
        return null;
      }
    } catch (err) {
      console.error("Firestore Error:", err);
      return null;
    }
  };

  // Derive background color from passling outfit, fallback to pink
  const bgColor = passlingData
    ? normalizeToRgba(passlingData.outfit_color, 0.3)
    : "#f0b4e2";

  // Derive square color as a slightly transparent version of bgColor
  const squareColor = passlingData
    ? normalizeToRgba(passlingData.outfit_color, 0.5)
    : "#f0b4e2";

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      {/* Background Pattern */}
      <View style={styles.patternContainer} pointerEvents="none">
        {Array.from({ length: 450 }).map((_, i) => (
          <View
            key={i}
            style={[styles.square, { backgroundColor: squareColor }]}
          />
        ))}
      </View>

      <SafeAreaView style={styles.safe}>
        <View style={[styles.screen, styles.scrollContent]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Feather name="chevron-left" size={22} color="#555" />
            </TouchableOpacity>

            <View style={[styles.avatarWrap, { backgroundColor: "#FFFFFF" }]}>
              {loadingPassling && !passlingData ? ( // Only show spinner if totally empty
                <ActivityIndicator color={"#443cd0"} /> // Changed color so it's visible on white
              ) : passlingData ? (
                <View
                  style={{
                    transform: [{ translateX: -72 }, { translateY: -20 }],
                  }}
                >
                  <Passling data={passlingData} size={340} />
                </View>
              ) : (
                <View style={{ alignItems: "center" }}>
                  <Text style={{ color: "#555" }}>
                    Character data not found.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Body + Outline */}
          <View style={styles.bodyContainer}>
            <View style={styles.body_outline} />

            <View style={styles.body}>
              <View style={styles.usernameRow}>
                <Text style={styles.username}>{displayName}</Text>
              </View>

              <Text style={styles.label}>Greeting:</Text>
              <ReadOnlyField value={greeting} />

              <Text style={styles.label}>Bio:</Text>
              <ReadOnlyField value={bio} multiline />

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => router.push("/(tabs)/ProfileTab")}
              >
                <MaterialIcons
                  name="edit"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.editBtnText}>Edit Details</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryBtn}>
                <MaterialIcons
                  name="people"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.primaryBtnText}>Your Passlings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryBtn}>
                <MaterialIcons
                  name="settings"
                  size={18}
                  color="#555"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.secondaryBtnText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const CREAM = "#F5F0E8";
const ORANGE = "#C4611A";
const BLACK = "#000000";
const AVATAR_SIZE = 170;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  screen: { flex: 1, backgroundColor: "transparent" },
  scrollContent: { flexGrow: 1 },
  header: {
    backgroundColor: "transparent",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    top: Platform.OS === "android" ? 12 : 8,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 6,
    borderColor: BLACK,
    position: "absolute",
    bottom: -AVATAR_SIZE / 8,
    alignSelf: "center",
    zIndex: 10,
    overflow: "hidden",
  },
  avatar: { width: "100%", height: "100%", borderRadius: AVATAR_SIZE / 2 },
  bodyContainer: { position: "relative", marginTop: -60, zIndex: 2 },
  body_outline: {
    position: "absolute",
    top: -18,
    left: -10,
    right: -10,
    zIndex: 1,
    backgroundColor: BLACK,
    borderTopLeftRadius: 1000,
    borderTopRightRadius: 1000,
    transform: [{ scaleX: 1.55 }, { scaleY: 0.95 }],
    height: 220,
  },
  body: {
    position: "relative",
    zIndex: 2,
    backgroundColor: CREAM,
    borderTopLeftRadius: 1000,
    borderTopRightRadius: 1000,
    transform: [{ scaleX: 1.5 }],
    paddingTop: 100,
    paddingHorizontal: 40,
    paddingBottom: 140,
  },
  usernameRow: {
    transform: [{ scaleX: 0.66 }],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  username: { fontSize: 22, fontWeight: "700", color: "#222" },
  label: {
    transform: [{ scaleX: 0.66 }],
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
    marginTop: 4,
  },
  fieldBox: {
    transform: [{ scaleX: 0.66 }],
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fcf7ed",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#ddd",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  fieldBoxMulti: { alignItems: "flex-start", paddingVertical: 12 },
  fieldInput: { flex: 1, fontSize: 15, color: "#333" },
  fieldInputMulti: { minHeight: 80, textAlignVertical: "top" },
  primaryBtn: {
    transform: [{ scaleX: 0.66 }],
    flexDirection: "row",
    backgroundColor: ORANGE,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    transform: [{ scaleX: 0.66 }],
    flexDirection: "row",
    backgroundColor: "#E0DDD6",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: { color: "#444", fontSize: 16, fontWeight: "600" },
  editBtn: {
    transform: [{ scaleX: 0.66 }],
    flexDirection: "row",
    backgroundColor: "#443cd0",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  editBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
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
  },
});

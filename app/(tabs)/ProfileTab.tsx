import { AnimatedBackground } from "@/components/auth/animated-background";
import { MaterialIcons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect, useRouter } from "expo-router"; // Added useFocusEffect
import { useCallback, useState } from "react"; // Swapped useEffect for useCallback
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Passling from "../../components/passling";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const normalizeToRgba = (colorString: string, t: number) => {
  if (!colorString) return "rgba(255,255,255,1)";
  const values = colorString.replace(/[()]/g, "").split(",");
  const r = Math.round(parseFloat(values[0]) * 255);
  const g = Math.round(parseFloat(values[1]) * 255);
  const b = Math.round(parseFloat(values[2]) * 255);
  const a = values[3] ? values[3].trim() : "1.0";
  const i = (r + g + b) / 3;
  const r2 = Math.round(r + (i - r) * t);
  const g2 = Math.round(g + (i - g) * t);
  const b2 = Math.round(b + (i - b) * t);
  return `rgba(${r2}, ${g2}, ${b2}, ${a})`;
};

// ---------------------------------------------------------------------------
// Editable Field Component
// ---------------------------------------------------------------------------
interface EditableFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  placeholder: string;
}

function EditableField({
  value,
  onChangeText,
  multiline = false,
  placeholder,
}: EditableFieldProps) {
  return (
    <View style={[styles.fieldBox, multiline && styles.fieldBoxMulti]}>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldInputMulti]}
        value={value}
        onChangeText={onChangeText}
        editable={true}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
      />
    </View>
  );
}

export default function EditProfileScreen() {
  const router = useRouter();
  const user = auth().currentUser;

  const [username, setUsername] = useState(user?.displayName || "");
  const [greeting, setGreeting] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [passlingData, setPasslingData] = useState<any>(null);
  const [loadingPassling, setLoadingPassling] = useState(true);

  // ---------------------------------------------------------------------------
  // SMART REFRESH LOGIC
  // ---------------------------------------------------------------------------
  useFocusEffect(
    useCallback(() => {
      const loadInitialData = async () => {
        if (!user) return;
        if (!passlingData) setLoadingPassling(true);

        try {
          const passSnap = await firestore()
            .collection("Passlings")
            .doc(user.uid)
            .get();
          if (passSnap.exists) setPasslingData(passSnap.data()); // ✅ .exists not .exists()

          const userSnap = await firestore()
            .collection("Users")
            .doc(user.uid)
            .get();
          if (userSnap.exists) {
            const uData = userSnap.data();
            setGreeting(uData?.greeting || "");
            setBio(uData?.bio || "");
          }
        } catch (err) {
          console.error("Load error:", err);
        } finally {
          setLoadingPassling(false);
        }
      };

      loadInitialData();
    }, [user, passlingData]), // Monitors passlingData to decide if spinner is needed
  );

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    setLoading(true);
    try {
      if (user) {
        await user.updateProfile({ displayName: username });

        await firestore().collection("Users").doc(user.uid).update({
          displayName: username,
          greeting,
          bio,
        });
      }
      Alert.alert("Success", "Profile updated!", [
        { text: "OK", onPress: () => router.push("/(tabs)/MyProfile") },
      ]);
    } catch (error: any) {
      Alert.alert("Update Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const bgColor = passlingData
    ? normalizeToRgba(passlingData.outfit_color, 0.3)
    : "#f0b4e2";
  const squareColor = passlingData
    ? normalizeToRgba(passlingData.outfit_color, 0.5)
    : "#f3c4e8";

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <View style={styles.patternContainer} pointerEvents="none">
        {Array.from({ length: 450 }).map((_, i) => (
          <View
            key={i}
            style={[styles.square, { backgroundColor: squareColor }]}
          />
        ))}
      </View>

      <SafeAreaView style={styles.safe}>
      <AnimatedBackground backgroundColor= {bgColor} patternColor={squareColor} />
          <View style={styles.header}>
            <View style={[styles.avatarWrap, { backgroundColor: "#FFFFFF" }]}>
              {/* Conditional Spinner: Only shows on true initial load */}
              {loadingPassling && !passlingData ? (
                <ActivityIndicator color={ORANGE} style={{ marginTop: 70 }} />
              ) : passlingData ? (
                <View
                  style={{
                    transform: [{ translateX: -72 }, { translateY: -20 }],
                  }}
                >
                  <Passling data={passlingData} size={340} />
                </View>
              ) : (
                <Text
                  style={{ fontSize: 10, textAlign: "center", marginTop: 70 }}
                >
                  No Passling Found
                </Text>
              )}
            </View>
          </View>

          <View style={styles.bodyContainer}>
            <View style={styles.body_outline} />
            <View style={styles.body}>
              <Text style={styles.label}>Username:</Text>
              <EditableField
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
              />

              <Text style={styles.label}>Greeting:</Text>
              <EditableField
                value={greeting}
                onChangeText={setGreeting}
                placeholder="How do you say hello?"
              />

              <Text style={styles.label}>Bio:</Text>
              <EditableField
                value={bio}
                onChangeText={setBio}
                multiline
                placeholder="Tell us about yourself..."
              />

              <TouchableOpacity
                style={[styles.saveBtn, loading && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={loading}
              >
                <MaterialIcons
                  name="check"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.saveBtnText}>
                  {loading ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => router.back()}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
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
const GREEN = "#2D6A4F";
const ORANGE = "#C4611A";
const BLACK = "#000000";
const AVATAR_SIZE = 170;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: {
    height: 180,
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
    overflow: "hidden", // Crucial for the Passling component preview
  },
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
    zIndex: 2,
    backgroundColor: CREAM,
    borderTopLeftRadius: 1000,
    borderTopRightRadius: 1000,
    transform: [{ scaleX: 1.5 }],
    paddingTop: 100,
    paddingHorizontal: 40,
    paddingBottom: 140,
  },
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
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#443cd0",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  fieldBoxMulti: { alignItems: "flex-start", paddingVertical: 12 },
  fieldInput: { flex: 1, fontSize: 15, color: "#333" },
  fieldInputMulti: { minHeight: 80, textAlignVertical: "top" },
  saveBtn: {
    transform: [{ scaleX: 0.66 }],
    flexDirection: "row",
    backgroundColor: GREEN,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  saveBtnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  cancelBtn: {
    transform: [{ scaleX: 0.66 }],
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  cancelBtnText: { color: "#666", fontSize: 14, fontWeight: "500" },
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

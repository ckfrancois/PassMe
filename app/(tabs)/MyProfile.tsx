import { Feather, MaterialIcons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { useFocusEffect, useRouter } from "expo-router"; // useFocusEffect is key
import { useCallback, useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
  const auth = getAuth();

  // We use state so the UI re-renders when the data changes
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || "Unknown User");
  
  // NOTE: Greeting and Bio should eventually be fetched from your Database (Firestore/Realtime DB)
  const [greeting, setGreeting] = useState("Hello there!"); 
  const [bio, setBio] = useState("This is my bio.");

  // This hook runs EVERY time you navigate back to this screen
  useFocusEffect(
    useCallback(() => {
      const refreshUser = async () => {
        const user = auth.currentUser;
        if (user) {
          try {
            // Force Firebase to fetch the latest profile data from the server
            await user.reload();
            // Update our local state with the fresh name
            setDisplayName(auth.currentUser?.displayName || "Unknown User");
            
            // TODO: If you have a database for Bio/Greeting, fetch it here:
            // const doc = await getDoc(doc(db, "users", user.uid));
            // setBio(doc.data().bio);
          } catch (error) {
            console.error("Failed to reload user:", error);
          }
        }
      };

      refreshUser();
    }, [auth.currentUser])
  );

  const avatarUri = {
    uri: "https://media.discordapp.net/attachments/1469031532055363756/1480043671570092052/PasslingConceptNewRend1.png?ex=69dfadd5&is=69de5c55&hm=6448705b8e6328a3a0acb7e35732f0e3fab3c7383bb996e925b619d1437827fd&=&format=webp&quality=lossless&width=800&height=1200",
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f0b4e2" }}>
      {/* Background Pattern */}
      <View style={styles.patternContainer} pointerEvents="none">
        {Array.from({ length: 450 }).map((_, i) => (
          <View key={i} style={styles.square} />
        ))}
      </View>

      <SafeAreaView style={styles.safe}>
        <View style={[styles.screen, styles.scrollContent]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Feather name="chevron-left" size={22} color="#555" />
            </TouchableOpacity>

            <View style={styles.avatarWrap}>
              <Image source={avatarUri} style={styles.avatar} />
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

              {/* This button should link to your EDIT page */}
              <TouchableOpacity 
                style={styles.editBtn} 
                onPress={() => router.push("/(tabs)/ProfileTab")}
              >
                <MaterialIcons name="edit" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.editBtnText}>Edit Details</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.primaryBtn}>
                <MaterialIcons name="people" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>Your Passlings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryBtn}>
                <MaterialIcons name="settings" size={18} color="#555" style={{ marginRight: 8 }} />
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
const PINK = "#F4B4D3";
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
  },
  avatar: { width: "100%", height: "100%", borderRadius: AVATAR_SIZE / 2 },
  bodyContainer: { position: "relative", marginTop: -60, zIndex: 2 },
  body_outline: {
    position: "absolute",
    top: -18, left: -10, right: -10,
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
    fontSize: 14, fontWeight: "600", color: "#444",
    marginBottom: 6, marginTop: 4,
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
    width: "100%", height: "100%",
    flexDirection: "column", flexWrap: 'wrap',
    zIndex: 0,
  },
  square: {
    width: 70, height: 70,
    backgroundColor: "#f3c4e8",
    borderRadius: 20, margin: 10,
  },
});
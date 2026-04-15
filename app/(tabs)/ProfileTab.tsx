import { MaterialIcons } from "@expo/vector-icons";
import { getAuth, updateProfile } from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// ---------------------------------------------------------------------------
// Editable Field Component
// ---------------------------------------------------------------------------
interface EditableFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  placeholder: string;
}

function EditableField({ value, onChangeText, multiline = false, placeholder }: EditableFieldProps) {
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

// ---------------------------------------------------------------------------
// EditProfileScreen
// ---------------------------------------------------------------------------
export default function EditProfileScreen() {
  const router = useRouter();
  const user = getAuth().currentUser;

  // Local State for Form
  const [username, setUsername] = useState(user?.displayName || "");
  const [greeting, setGreeting] = useState(""); // Replace with your actual DB field logic
  const [bio, setBio] = useState(""); // Replace with your actual DB field logic
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    setLoading(true);
    try {
      // 1. Update Firebase Auth Profile
      if (user) {
        await updateProfile(user, { displayName: username });
      }

      // 2. TODO: Update your Firestore/Database for Greeting and Bio here
      // await updateDoc(doc(db, "users", user.uid), { greeting, bio });

      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => router.push("/(tabs)/MyProfile") }
      ]);
    } catch (error: any) {
      Alert.alert("Update Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const avatarUri = {
    uri: "https://media.discordapp.net/attachments/1469031532055363756/1480043671570092052/PasslingConceptNewRend1.png?ex=69dfadd5&is=69de5c55&hm=6448705b8e6328a3a0acb7e35732f0e3fab3c7383bb996e925b619d1437827fd&=&format=webp&quality=lossless&width=800&height=1200",
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f0b4e2" }}>
      <View style={styles.patternContainer} pointerEvents="none">
        {Array.from({ length: 450 }).map((_, i) => (
          <View key={i} style={styles.square} />
        ))}
      </View>

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
          {/* Header */}
          <View style={styles.header}>
          

            <View style={styles.avatarWrap}>
              <Image source={avatarUri} style={styles.avatar} />
              
            </View>
          </View>

          {/* Body */}
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
                <MaterialIcons name="check" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveBtnText}>{loading ? "Saving..." : "Save Changes"}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={() => router.push("/(tabs)/MyProfile")}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles (Matches your UI logic)
// ---------------------------------------------------------------------------
const PINK = "#F4B4D3";
const CREAM = "#F5F0E8";
const GREEN = "#2D6A4F"; // A solid "Success" color for saving
const BLACK = "#000000";
const AVATAR_SIZE = 170;

const styles = StyleSheet.create({
  // ... (Your previous styles remain the same for safe, screen, pattern, etc)
  safe: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    top: 12,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
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
  avatarEditBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#443cd0',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff'
  },
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
    fontSize: 14, fontWeight: "600", color: "#444",
    marginBottom: 6, marginTop: 4,
  },
  fieldBox: {
    transform: [{ scaleX: 0.66 }],
    flexDirection: "row",
    backgroundColor: "#fff", // White background for editable fields
    borderRadius: 16,
    borderWidth: 2, // Slightly thicker border for focus-feel
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
    position: "absolute", width: "100%", height: "100%",
    flexDirection: "column", flexWrap: 'wrap', zIndex: 0,
  },
  square: {
    width: 70, height: 70, backgroundColor: "#f3c4e8",
    borderRadius: 20, margin: 10,
  },
});
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
} from "@react-native-firebase/auth";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider as WebGoogleAuthProvider,
  getAuth as getWebAuth,
  signInWithCredential as webSignInWithCredential,
} from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";

  const [loginMessage, setLoginMessage] = useState("");

  const auth = getAuth();
  console.log("🔵 Auth initialized:", !!auth);
  console.log("🔵 Current user:", auth.currentUser?.displayName);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/(tabs)/BLETab");
    });
    return unsubscribe;
  }, []);

  const createUserIfNotExists = async (user: any) => {
    try {
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          usersPassed: [],
          usersPassedCount: 0,
          favoriteColor: "",
          passCoins: 0,
          createdAt: new Date().toISOString(),
        });
        console.log("✅ Created new user document in Firestore");
      } else {
        console.log("ℹ️ User document already exists");
      }
    } catch (err) {
      console.error("❌ Firestore error:", err);
    }
  };

  async function onGoogleButtonPress() {
    try {
      console.log("🔵 Starting sign in...");
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      console.log("🔵 Has play services, signing in...");
      const signInResult = await GoogleSignin.signIn();
      console.log("🔵 Sign in result:", JSON.stringify(signInResult));

      const idToken =
        signInResult?.data?.idToken || (signInResult as any)?.idToken;
      console.log("🔵 ID token exists:", !!idToken);

      if (!idToken) throw new Error("No ID token found");

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      console.log("🔵 Firebase user:", userCredential.user.uid);

      const webCredential = WebGoogleAuthProvider.credential(idToken);
      await webSignInWithCredential(getWebAuth(), webCredential);
      console.log("🔵 Web auth done");

      await createUserIfNotExists(userCredential.user);

      setLoginMessage(`Welcome, ${userCredential.user.displayName}!`);
    } catch (error: any) {
      console.error("❌ Code:", error.code);
      console.error("❌ Message:", error.message);
    }
  }

  const completeLogout = async () => {
    try {
      // 1. Sign out from Google (to clear the account selector state)
      await GoogleSignin.signOut();

      // 2. Sign out from Firebase
      await getAuth().signOut();

      console.log("Complete logout successful");
    } catch (error) {
      console.error("Error during complete logout:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>
        Welcome to PassMe
      </Text>
      <Text style={[styles.loginMessage, { color: textColor }]}>
        {"Hello, " +
          (auth.currentUser?.displayName ||
            "Guest. Please sign in to continue.") +
          "!"}
      </Text>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={onGoogleButtonPress}
        disabled={false}
      />
      <TouchableOpacity
        style={[styles.button, getAuth().currentUser && styles.buttonActive]}
        onPress={completeLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  title: { fontSize: 28, fontWeight: "bold" },
  loginMessage: { fontSize: 16, textAlign: "center" },
  button: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  buttonActive: {
    backgroundColor: "#0F9D58",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

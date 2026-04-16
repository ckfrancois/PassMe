import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
  type FirebaseAuthTypes,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { Platform } from "react-native";

type AuthContextValue = {
  currentUser: FirebaseAuthTypes.User | null;
  initializing: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(
    null,
  );
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setCurrentUser(user);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (Platform.OS === "web") {
      throw new Error("Google sign-in is only configured for native builds.");
    }

    setLoading(true);

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();
      const idToken =
        signInResult?.data?.idToken ||
        (signInResult as { idToken?: string }).idToken;

      if (!idToken) {
        throw new Error("Google sign-in did not return an ID token.");
      }

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(getAuth(), credential);

      setCurrentUser(userCredential.user);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);

    try {
      await GoogleSignin.signOut().catch(() => null);
      await getAuth().signOut();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      initializing,
      loading,
      isAuthenticated: Boolean(currentUser),
      signInWithGoogle,
      signOut,
    }),
    [currentUser, initializing, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return value;
}

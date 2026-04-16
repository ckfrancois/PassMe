import { AnimatedBackground } from "@/components/auth/animated-background";
import { AuthHill } from "@/components/auth/auth-hill";
import {
  BirthDateScreen,
  UsernameScreen,
  WelcomeScreen,
} from "@/components/auth/auth-screens";
import { useAuth } from "@/hooks/use-auth";
import { MaterialIcons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Passling from "../../components/passling";

type OnboardingStep = "birthDate" | "username" | "complete";

const BROWN = "#5C2A00";
const PLAY_ORANGE = "#C4611A";

function HomeScreenContent() {
  const { currentUser, signOut } = useAuth();
  const [passlingData, setPasslingData] = useState<any>(null);
  const [loadingPassling, setLoadingPassling] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-300)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      if (!currentUser) return;
      const fetch = async () => {
        try {
          const snap = await firestore()
            .collection("Passlings")
            .doc(currentUser.uid)
            .get();
          const data = snap.data();
          if (data) setPasslingData(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingPassling(false);
        }
      };
      fetch();
    }, [currentUser]),
  );

  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.parallel([
      Animated.timing(sidebarAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0.45,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSidebar = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(sidebarAnim, {
        toValue: -300,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSidebarOpen(false);
      callback?.();
    });
  };

  const navigateTo = (path: string) => {
    closeSidebar(() => router.navigate(path as any));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#B9E4FF" }}>
      <AnimatedBackground />
      <AuthHill
        style={{ height: "47%" }}
        hillStyle={{ borderTopLeftRadius: 600, borderTopRightRadius: 600 }}
      />

      <SafeAreaView style={hStyles.safe}>
        {/* Hamburger button */}
        <TouchableOpacity
          style={hStyles.hamburger}
          onPress={openSidebar}
          activeOpacity={0.8}
        >
          <MaterialIcons name="menu" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Passling card */}
        <View style={hStyles.passlingCard}>
          {loadingPassling && !passlingData ? (
            <ActivityIndicator color="#888" size="large" />
          ) : passlingData ? (
            <Passling data={passlingData} size={500} />
          ) : (
            <Text style={hStyles.noPasslingText}>No Passling found</Text>
          )}
        </View>

        {/* Play button */}
        <TouchableOpacity
          style={hStyles.playBtn}
          onPress={() => router.navigate("/(tabs)/game" as any)}
          activeOpacity={0.85}
        >
          <Text style={hStyles.playText}>PLAY »</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Sidebar overlay + panel */}
      {sidebarOpen && (
        <>
          <Animated.View style={[hStyles.overlay, { opacity: overlayAnim }]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={() => closeSidebar()}
              activeOpacity={1}
            />
          </Animated.View>

          <Animated.View
            style={[
              hStyles.sidebar,
              { transform: [{ translateX: sidebarAnim }] },
            ]}
          >
            <SafeAreaView style={hStyles.sidebarSafe}>
              <Text style={hStyles.sidebarTitle}>Menu</Text>

              <TouchableOpacity
                style={hStyles.sidebarItem}
                onPress={() => navigateTo("/(tabs)/MyProfile")}
              >
                <MaterialIcons
                  name="person"
                  size={22}
                  color={PLAY_ORANGE}
                  style={hStyles.sidebarIcon}
                />
                <Text style={hStyles.sidebarItemText}>My Profile</Text>
                <MaterialIcons name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity
                style={hStyles.sidebarItem}
                onPress={() => navigateTo("/(tabs)/PasslingList")}
              >
                <MaterialIcons
                  name="people"
                  size={22}
                  color={PLAY_ORANGE}
                  style={hStyles.sidebarIcon}
                />
                <Text style={hStyles.sidebarItemText}>Passling List</Text>
                <MaterialIcons name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity
                style={hStyles.sidebarItem}
                onPress={() => navigateTo("/(tabs)/godot")}
              >
                <MaterialIcons
                  name="edit"
                  size={22}
                  color={PLAY_ORANGE}
                  style={hStyles.sidebarIcon}
                />
                <Text style={hStyles.sidebarItemText}>Edit Passling</Text>
                <MaterialIcons name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>

              <View style={hStyles.sidebarSpacer} />

              <TouchableOpacity
                style={hStyles.signOutItem}
                onPress={() => closeSidebar(signOut)}
              >
                <MaterialIcons
                  name="logout"
                  size={22}
                  color="#e53935"
                  style={hStyles.sidebarIcon}
                />
                <Text style={hStyles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </Animated.View>
        </>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const { initializing, isAuthenticated, loading, signInWithGoogle, signOut } =
    useAuth();
  const [activeStep, setActiveStep] = useState<OnboardingStep>("complete");
  const [testingFromHome, setTestingFromHome] = useState(false);

  if (initializing) {
    return (
      <View style={styles.loadingScreen}>
        <AnimatedBackground />
        <ActivityIndicator color="#FFFFFF" size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <WelcomeScreen loading={loading} onGooglePress={signInWithGoogle} />;
  }

  if (activeStep === "birthDate") {
    return (
      <BirthDateScreen
        defaultValue=""
        loading={loading}
        onBack={() => {
          if (testingFromHome) {
            setActiveStep("complete");
            setTestingFromHome(false);
            return;
          }
          signOut();
        }}
        onSubmit={async () => {
          setActiveStep("username");
        }}
      />
    );
  }

  if (activeStep === "username") {
    return (
      <UsernameScreen
        defaultValue=""
        loading={loading}
        onBack={() => {
          if (testingFromHome) {
            setActiveStep("complete");
            setTestingFromHome(false);
            return;
          }
          setActiveStep("birthDate");
        }}
        onSubmit={async () => {
          setActiveStep("complete");
          setTestingFromHome(false);
        }}
      />
    );
  }

  return <HomeScreenContent />;
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B9E4FF",
  },
});

const hStyles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  hamburger: {
    marginTop: 16,
    marginLeft: 16,
    alignSelf: "flex-start",
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: PLAY_ORANGE,
    borderWidth: 3,
    borderColor: BROWN,
    alignItems: "center",
    justifyContent: "center",
  },
  passlingCard: {
    flex: 1,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noPasslingText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Fredoka_400Regular",
  },
  playBtn: {
    marginBottom: 20,
    marginInline: 20,
    backgroundColor: PLAY_ORANGE,
    borderRadius: 24,
    borderWidth: 6,
    borderColor: BROWN,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  playText: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "Fredoka_500Medium",
    letterSpacing: 2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 50,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingLeft: 24,
    bottom: 0,
    width: 280,
    backgroundColor: "#fff",
    zIndex: 51,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 15,
  },
  sidebarSafe: {
    flex: 1,
    paddingLeft: 28,
    paddingRight: 20,
  },
  sidebarTitle: {
    fontSize: 24,
    fontFamily: "Fredoka_700Bold",
    color: "#222",
    marginBottom: 20,
    marginTop: 16,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  sidebarIcon: {
    marginRight: 14,
  },
  sidebarItemText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Fredoka_500Medium",
    color: "#333",
  },
  sidebarSpacer: {
    flex: 1,
  },
  signOutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
    marginBottom: 8,
  },
  signOutText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Fredoka_500Medium",
    color: "#e53935",
  },
});

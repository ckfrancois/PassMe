import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import {
  BirthDateScreen,
  SignedInHome,
  UsernameScreen,
  WelcomeScreen,
} from "@/components/auth/auth-screens";
import { AnimatedBackground } from "@/components/auth/animated-background";
import { useAuth } from "@/hooks/use-auth";

type OnboardingStep = "birthDate" | "username" | "complete";

export default function HomeScreen() {
  const {
    currentUser,
    initializing,
    isAuthenticated,
    loading,
    signInWithGoogle,
    signOut,
  } = useAuth();
  const [activeStep, setActiveStep] = useState<OnboardingStep>("birthDate");
  const [simulatedUsername, setSimulatedUsername] = useState<string | null>(null);

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
        onBack={signOut}
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
        onBack={() => setActiveStep("birthDate")}
        onSubmit={async (username) => {
          setSimulatedUsername(username);
          setActiveStep("complete");
        }}
      />
    );
  }

  return (
    <SignedInHome
      displayName={
        simulatedUsername ||
        currentUser?.displayName ||
        "friend"
      }
      onGoToBle={() => router.navigate("/(tabs)/BLETab")}
      onGoToExplore={() => router.navigate("/(tabs)/explore")}
      onSignOut={signOut}
    />
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B9E4FF",
  },
});

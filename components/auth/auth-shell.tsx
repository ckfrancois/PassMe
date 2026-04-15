import { Image } from "expo-image";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AnimatedBackground } from "@/components/auth/animated-background";
import { AuthHill } from "@/components/auth/auth-hill";

type AuthShellProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
  logoVisible?: boolean;
  showWordmark?: boolean;
  subtitle?: string;
};

export function AuthShell({
  children,
  footer,
  logoVisible = true,
  showWordmark = false,
  subtitle,
}: AuthShellProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AnimatedBackground />
      <AuthHill />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.heroBlock}>
            {showWordmark ? (
              <Text style={styles.wordmark}>
                <Text style={styles.wordmarkPass}>Pass</Text>
                <Text style={styles.wordmarkMe}>Me</Text>
              </Text>
            ) : null}
            {logoVisible ? (
              <Image
                contentFit="contain"
                source={require("@/assets/images/home-screen-logo.png")}
                style={styles.logo}
              />
            ) : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          <View style={styles.panel}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#B9E4FF",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 24,
  },
  heroBlock: {
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 12,
    zIndex: 2,
  },
  logo: {
    width: "100%",
    maxWidth: 280,
    height: 168,
    alignSelf: "center",
    marginBottom: 40,
  },
  wordmark: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 72,
    marginBottom: 36,
    textAlign: "center",
  },
  wordmarkPass: {
    color: "#23180F",
  },
  wordmarkMe: {
    color: "#D97800",
    textShadowColor: "#6B3200",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },
  panel: {
    alignItems: "stretch",
    gap: 18,
    marginBottom: 28,
    zIndex: 2,
  },
  subtitle: {
    color: "#FFFFFF",
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 28,
    lineHeight: 32,
    textAlign: "center",
    textShadowColor: "#275327",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
    maxWidth: 300,
  },
  footer: {
    gap: 8,
    alignItems: "center",
    zIndex: 2,
    marginBottom: 36,
  },
});

import { AnimatedBackground } from "@/components/auth/animated-background";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function GameScreen() {
  return (
    <View style={styles.container}>
      <AnimatedBackground backgroundColor="#a8d89a" patternColor="#8ec87e" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Text style={styles.title}>Game</Text>
          <Text style={styles.subtitle}>Coming Soon</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 36, fontWeight: "800", color: "#fff", marginBottom: 8 },
  subtitle: { fontSize: 18, color: "rgba(255,255,255,0.8)" },
});

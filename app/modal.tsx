import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms of Service</Text>
      <Text style={styles.body}>
        This is a placeholder terms screen for the auth flow. Replace this copy
        with your production terms before shipping.
      </Text>
      <Text style={styles.body}>
        The important part of this pass is that the onboarding flow now has a
        real destination for the terms link instead of a generic Expo starter
        modal.
      </Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text style={styles.linkText}>Back to home</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F6F2E9",
    gap: 16,
  },
  title: {
    color: "#221D17",
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 28,
  },
  body: {
    color: "#4A433B",
    fontFamily: "Fredoka_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    color: "#0E6111",
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

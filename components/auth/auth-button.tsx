import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type AuthButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: "apple" | "google" | "chevron-right";
  variant?: "primary" | "secondary";
};

export function AuthButton({
  label,
  onPress,
  disabled = false,
  icon,
  variant = "primary",
}: AuthButtonProps) {
  const isSecondary = variant === "secondary";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        isSecondary ? styles.secondaryButton : styles.primaryButton,
        disabled && styles.disabledButton,
      ]}
    >
      <View style={styles.content}>
        {icon ? (
          <MaterialCommunityIcons
            color="#FFFFFF"
            name={icon}
            size={20}
            style={styles.icon}
          />
        ) : null}
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 4,
    justifyContent: "center",
    paddingHorizontal: 18,
    shadowColor: "#10220E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: "#D06B00",
    borderColor: "#824200",
  },
  secondaryButton: {
    backgroundColor: "#4A40D3",
    borderColor: "#19108A",
  },
  disabledButton: {
    opacity: 0.6,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  icon: {
    marginTop: 1,
  },
  label: {
    color: "#FFFFFF",
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 18,
  },
});

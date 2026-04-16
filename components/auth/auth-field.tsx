import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

type AuthFieldProps = TextInputProps & {
  helperText?: string;
  label?: string;
};

export function AuthField({ helperText, label, style, ...props }: AuthFieldProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor="#67765F"
        style={[styles.input, style]}
        {...props}
      />
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    color: "#FFFFFF",
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 18,
    textAlign: "center",
  },
  input: {
    minHeight: 54,
    borderRadius: 12,
    borderColor: "#0B6A10",
    borderWidth: 4,
    backgroundColor: "#FFFFFF",
    color: "#1C1B1A",
    fontFamily: "Fredoka_500Medium",
    fontSize: 18,
    paddingHorizontal: 18,
    textAlign: "center",
  },
  helper: {
    borderRadius: 12,
    borderWidth: 4,
    borderColor: "#0B6A10",
    backgroundColor: "#D5F2C9",
    color: "#13230F",
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    lineHeight: 18,
    padding: 14,
  },
});

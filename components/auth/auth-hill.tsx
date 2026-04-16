import { StyleSheet, View, type ViewStyle } from "react-native";

type AuthHillProps = {
  color?: string;
  ridgeColor?: string;
  style?: ViewStyle;
};

export function AuthHill({
  color = "#58A650",
  ridgeColor = "#0C6A0D",
  style,
}: AuthHillProps) {
  return (
    <View pointerEvents="none" style={[styles.container, style]}>
      <View
        style={[
          styles.hill,
          {
            backgroundColor: color,
            borderColor: ridgeColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "58%",
    overflow: "hidden",
  },
  hill: {
    position: "absolute",
    left: -40,
    right: -40,
    bottom: -8,
    height: "90%",
    borderWidth: 8,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    overflow: "hidden",
  },
});

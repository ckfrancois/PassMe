import { RTNGodot, runOnGodotThread } from "@borndotcom/react-native-godot";
import * as FileSystem from "expo-file-system/legacy";
import { Platform, StyleSheet } from "react-native";

function initGodot() {
  runOnGodotThread(() => {
    "worklet";
    console.log("Initializing Godot");

    if (Platform.OS === "android") {
      RTNGodot.createInstance([
        "--verbose",
        "--path",
        "/main",
        "--rendering-driver",
        "opengl3",
        "--rendering-method",
        "gl_compatibility",
        "--display-driver",
        "embedded",
      ]);
    } else {
      RTNGodot.createInstance([
        "--verbose",
        "--main-pack",
        FileSystem.bundleDirectory + "main.pck",
        "--rendering-driver",
        "opengl3",
        "--rendering-method",
        "gl_compatibility",
        "--display-driver",
        "embedded",
      ]);
    }
  });
}

const GodotGameTest = () => {

  return (
      <View style={styles.container}></View>
        );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
});

export default GodotGameTest;

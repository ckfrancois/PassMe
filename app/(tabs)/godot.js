import {
  RTNGodot,
  RTNGodotView,
  runOnGodotThread,
} from "@borndotcom/react-native-godot";
import { getAuth } from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import { useCallback, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

const ACTION_JUMP = "ui_accept";
const ACTION_MOVE_LEFT = "ui_left";
const ACTION_MOVE_RIGHT = "ui_right";

// Capture these outside the worklet
const platform = Platform.OS;
const bundleDirectory = FileSystem.bundleDirectory;

function destroyGodot() {
  runOnGodotThread(() => {
    "worklet";
    RTNGodot.destroyInstance();
  });
}

function initGodot() {
  runOnGodotThread(() => {
    "worklet";
    RTNGodot.destroyInstance();
    console.log("Initializing Godot");

    if (platform === "android") {
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
        bundleDirectory + "main.pck",
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

function pressAction(action) {
  runOnGodotThread(() => {
    "worklet";
    try {
      const Godot = RTNGodot.API();
      const Input = Godot.Input;
      Input.action_press(action);
    } catch (error) {
      console.error("Error pressing action:", error);
    }
  });
}

function releaseAction(action) {
  runOnGodotThread(() => {
    "worklet";
    try {
      const Godot = RTNGodot.API();
      const Input = Godot.Input;
      Input.action_release(action);
    } catch (error) {
      console.error("Error releasing action:", error);
    }
  });
}

export default function GodotScreen() {
  const [isPaused, setIsPaused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Tab is focused — start Godot
      const start = async () => {
        initGodot();

        const user = getAuth().currentUser;
        if (!user) return;

        const token = await user.getIdToken(true);
        const user_uid = user.uid;

        RTNGodot.runOnGodotThread(() => {
          "worklet";
          const Godot = RTNGodot.API();
          const engine = Godot.Engine;
          const sceneTree = engine.get_main_loop();
          const root = sceneTree.get_root();

          const auth = root.find_child("AuthManager", true, false);
          auth.set_project_id(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID);
          auth.set_uid(user_uid);
          auth.set_token(token);
        });
      };

      start();

      // Tab is blurred — stop Godot
      return () => {
        console.log("Destroying Godot instance");
        destroyGodot();
      };
    }, []),
  );

  const handlePlayPause = () => {
    if (isPaused) {
      RTNGodot.resume();
      setIsPaused(false);
    } else {
      RTNGodot.pause();
      setIsPaused(true);
    }
  };

  return (
    <View style={styles.container}>
      <RTNGodotView style={styles.gameView} />

      {/* <View style={styles.topControls}>
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={handlePlayPause}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isPaused ? "play" : "pause"}
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View> */}

      {/* <View style={styles.leftControls}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={() => pressAction(ACTION_MOVE_LEFT)}
          onPressOut={() => releaseAction(ACTION_MOVE_LEFT)}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPressIn={() => pressAction(ACTION_MOVE_RIGHT)}
          onPressOut={() => releaseAction(ACTION_MOVE_RIGHT)}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.rightControls}>
        <TouchableOpacity
          style={[styles.button, styles.jumpButton]}
          onPressIn={() => pressAction(ACTION_JUMP)}
          onPressOut={() => releaseAction(ACTION_JUMP)}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-up" size={36} color="white" />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gameView: { flex: 1 },
  topControls: { position: "absolute", top: 40, right: 30 },
  playPauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  leftControls: {
    position: "absolute",
    bottom: 40,
    left: 30,
    flexDirection: "row",
    gap: 20,
  },
  rightControls: { position: "absolute", bottom: 40, right: 30 },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  jumpButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(220, 38, 38, 0.7)",
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
});

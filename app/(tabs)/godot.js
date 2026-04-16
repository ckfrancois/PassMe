import {
  RTNGodot,
  RTNGodotView,
  runOnGodotThread,
} from "@borndotcom/react-native-godot";
import { getAuth } from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { Ionicons } from "@expo/vector-icons"; // Uncomment if using icons

const ACTION_JUMP = "ui_accept";
const ACTION_MOVE_LEFT = "ui_left";
const ACTION_MOVE_RIGHT = "ui_right";

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
  const router = useRouter();
  const { flow } = useLocalSearchParams();

  useFocusEffect(
    useCallback(() => {
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
          if (auth) {
            auth.set_project_id(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID);
            auth.set_uid(user_uid);
            auth.set_token(token);
          }
        });
      };

      start();

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

  const handleNextPress = () => {
    if (flow === "creation") {
      router.push("/initialEdit");
    } else {
      router.push("/MyProfile");
    }
  };

  return (
    <View style={styles.container}>
      <RTNGodotView style={styles.gameView} />

      {/* Navigation "Next" Button from Version 2 */}
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Optional: Play/Pause Button from Version 1 */}
      {/* <View style={styles.topRightControls}>
        <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause}>
           <Text style={{color: 'white'}}>{isPaused ? "PLAY" : "PAUSE"}</Text>
        </TouchableOpacity>
      </View> 
      */}

      {/* Optional: Game Controls from Version 1 (Commented out) */}
      {/* <View style={styles.leftControls}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={() => pressAction(ACTION_MOVE_LEFT)}
          onPressOut={() => releaseAction(ACTION_MOVE_LEFT)}
        >
          <Text style={{color: 'white'}}>L</Text>
        </TouchableOpacity>
      </View> 
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gameView: { flex: 1 },
  navContainer: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  nextButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  topRightControls: { 
    position: "absolute", 
    top: 40, 
    right: 30 
  },
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
});
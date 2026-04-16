import { useNotification } from "@/contexts/NotificationContext";
import { useAuth } from "@/hooks/use-auth";
import firestore from "@react-native-firebase/firestore";
import { Buffer } from "buffer";
import {
  setServices,
  startAdvertising,
  stopAdvertising,
} from "munim-bluetooth";
import React, { useEffect, useRef, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";

const APP_SERVICE_UUID = "0000ABCD-0000-1000-8000-00805F9B34FB";
const USERNAME_CHARACTERISTIC_UUID = "0000DCBA-0000-1000-8000-00805F9B34FB";

const bleManager = new BleManager();

const stringToHex = (str: string): string =>
  Array.from(new TextEncoder().encode(str))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

const BleNearbyUsers: React.FC = () => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();

  const lastSeen = useRef<Map<string, number>>(new Map());

  const [scanning, setScanning] = useState(false);
  const [username, setUsername] = useState("");
  const [nearbyUsers, setNearbyUsers] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

  const connectingDevices = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (currentUser) {
      // runs whenever currentUser becomes non-null or changes
      console.log("User logged in:", currentUser);
    } else {
      // runs when user logs out
      console.log("User logged out");
    }
  }, [currentUser]);

  const savePassedUser = async (foundUser: string) => {
    try {
      if (!currentUser) {
        console.warn("No logged in user, skipping Firestore save");
        return;
      }

      await firestore()
        .collection("Users")
        .doc(currentUser.uid)
        .set(
          {
            usersPassed: firestore.FieldValue.arrayUnion(foundUser),
            email: currentUser.email,
            displayName: currentUser.displayName,
          },
          { merge: true },
        );

      console.log("Saved passed user to Firestore:", foundUser);
    } catch (err) {
      console.error("Failed to save to Firestore:", err);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === "ios") {
      const currentStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (currentStatus === RESULTS.DENIED) {
        const whenInUse = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (whenInUse === RESULTS.GRANTED) {
          await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
        }
      } else if (currentStatus === RESULTS.BLOCKED) {
        setStatusMessage("❌ Location permission blocked. Enable in Settings.");
        return false;
      }
    }

    if (Platform.OS === "android" && Platform.Version >= 31) {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      ]);

      const allGranted = Object.values(results).every(
        (r) => r === PermissionsAndroid.RESULTS.GRANTED,
      );

      if (!allGranted) {
        setStatusMessage("❌ Missing Bluetooth permissions.");
        return false;
      }
    }

    return true;
  };

  const handleDiscoveredDevice = async (device: Device) => {
    const deviceId = device.id;
    const now = Date.now();
    const last = lastSeen.current.get(deviceId) || 0;

    if (now - last < 10000) return;
    lastSeen.current.set(deviceId, now);

    if (Platform.OS === "android" && (device.rssi ?? -100) < -85) return;
    if (connectingDevices.current.has(deviceId)) return;
    connectingDevices.current.add(deviceId);

    try {
      const connected = await device.connect({
        timeout: 20000,
        requestMTU: 512,
      });
      if (Platform.OS === "android")
        await connected.requestConnectionPriority(0);
      await new Promise((res) => setTimeout(res, 500));
      const discovered =
        await connected.discoverAllServicesAndCharacteristics();

      const characteristic = await discovered.readCharacteristicForService(
        APP_SERVICE_UUID,
        USERNAME_CHARACTERISTIC_UUID,
      );

      if (!characteristic.value) return;

      const decoded = Buffer.from(characteristic.value, "base64").toString(
        "utf-8",
      );

      if (decoded.startsWith("PM:")) {
        const foundUser = decoded.slice(3);
        const foundUserID = foundUser;
        console.log(Platform.OS + ": 🔵 Found user:", foundUser);

        const foundData = (
          await firestore().collection("Users").doc(foundUser).get()
        ).data();
       
     
        // Fetch passling data from the Passlings collection
        const passlingSnap = await firestore()
          .collection("Passlings")
          .doc(foundUser)
          .get();
        const passlingData = passlingSnap.exists() ? passlingSnap.data() : null;

        console.log("Firestore lookup for", foundUser, "result:", foundData);
        const displayName =
          foundData?.username || foundData?.displayName || foundUser;
          const greeting =
         foundData?.greeting || "just passed you!"; // 👈 NEW


        setNearbyUsers((prev) =>
          prev.includes(displayName) ? prev : [...prev, displayName],
        );

        // Pass passlingData as second argument to showNotification
        showNotification(displayName, passlingData, greeting);

        if (!nearbyUsers.includes(foundUserID)) {
          await savePassedUser(foundUserID);
        }
      }
    } catch (err) {
      console.log(Platform.OS + ": ⏭️ Skipping discovery error.");
    } finally {
      try {
        await bleManager.cancelDeviceConnection(deviceId);
      } catch {}
      connectingDevices.current.delete(deviceId);
    }
  };

  const stopBLE = () => {
    bleManager.stopDeviceScan();
    stopAdvertising();
    setScanning(false);
    connectingDevices.current.clear();
    setStatusMessage("");
  };

  const startBLE = async (name: string) => {
    const granted = await requestPermissions();
    if (!granted) return;

    stopBLE();
    setNearbyUsers([]);

    const localName = `PM:${currentUser?.uid || "Unknown"}`;
    console.log("📡 Advertising as:", localName, "on", Platform.OS);
    setScanning(true);
    setStatusMessage("📡 Starting...");

    try {
      await setServices([
        {
          uuid: APP_SERVICE_UUID,
          characteristics: [
            {
              uuid: USERNAME_CHARACTERISTIC_UUID,
              properties: ["read"],
              value: stringToHex(localName),
            },
          ],
        },
      ]);

      await startAdvertising({ serviceUUIDs: [APP_SERVICE_UUID] });
      setStatusMessage(`✅ Advertising as "${localName}"`);
    } catch (err) {
      setStatusMessage("❌ Advertising failed.");
      setScanning(false);
      return;
    }

    bleManager.startDeviceScan(
      Platform.OS === "android" ? null : [APP_SERVICE_UUID],
      { allowDuplicates: true },
      (error, device) => {
        if (error) return;
        if (device) handleDiscoveredDevice(device);
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>BLE Nearby</Text>
      <Text style={[styles.status, { color: textColor }]}>{statusMessage}</Text>

      <View style={styles.buttonGrid}>
        {currentUser === null && (
          <Text style={{ color: textColor, width: "100%" }}>
            You need to sign in to use the BLE features. Please go to the Home
            tab and sign in with Google.
          </Text>
        )}
        {currentUser !== null && (
          <Text style={{ color: textColor, width: "100%" }}>
            You're signed in as {currentUser?.displayName || "Unknown User"}.
          </Text>
        )}

        <TouchableOpacity
          style={[styles.button, currentUser && styles.buttonActive]}
          onPress={() => startBLE(username)}
        >
          <Text style={styles.buttonText}>Start BLE</Text>
        </TouchableOpacity>
      </View>

      {scanning && (
        <TouchableOpacity style={styles.stopButton} onPress={stopBLE}>
          <Text style={styles.stopButtonText}>Stop BLE</Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.scannerTitle, { color: textColor }]}>
        👥 Nearby Users ({nearbyUsers.length})
      </Text>

      {nearbyUsers.length === 0 ? (
        <Text style={[styles.empty, { color: textColor }]}>
          {scanning ? "Scanning…" : "Start BLE to scan"}
        </Text>
      ) : (
        nearbyUsers.map((user) => (
          <View key={user} style={styles.userRow}>
            <Text style={[styles.userName, { color: textColor }]}>{user}</Text>
          </View>
        ))
      )}
    </View>
  );
};

export default BleNearbyUsers;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  status: { fontSize: 14, color: "#666", marginBottom: 16 },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
    justifyContent: "center",
  },
  button: {
    width: "47%",
    backgroundColor: "#555",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "#005BBB",
    borderWidth: 2,
    borderColor: "#00CFFF",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  stopButton: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  stopButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  scannerTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  empty: { color: "#999", fontStyle: "italic" },
  userRow: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    borderRadius: 6,
    marginBottom: 4,
  },
  userName: { fontSize: 16 },
});

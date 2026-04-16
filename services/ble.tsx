import { Buffer } from "buffer";
import {
  setServices,
  startAdvertising,
  stopAdvertising,
} from "munim-bluetooth";
import React, { useRef, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { BleManager, Device } from "react-native-ble-plx";

import { getAuth } from "@react-native-firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import {
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";

const APP_SERVICE_UUID = "0000ABCD-0000-1000-8000-00805F9B34FB";
const USERNAME_CHARACTERISTIC_UUID = "0000DCBA-0000-1000-8000-00805F9B34FB";

const bleManager = new BleManager();

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const stringToHex = (str: string): string =>
  Array.from(new TextEncoder().encode(str))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

// ─── Component ───────────────────────────────────────────────────────────────

const BleNearbyUsers: React.FC = () => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";

  const lastSeen = useRef<Map<string, number>>(new Map());

  const [scanning, setScanning] = useState(false);
  const [username, setUsername] = useState("");
  const [nearbyUsers, setNearbyUsers] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  
  
  const connectingDevices = useRef<Set<string>>(new Set());

  // ─── Lifecycle & Data Fetching ─────────────────────────────────────────────

  

 
  // ─── Save passed user to Firestore ─────────────────────────────────────────

  const savePassedUser = async (foundUser: string) => {
    try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) return;

      const userRef = doc(db, "Users", currentUser.uid);

      await setDoc(
        userRef,
        {
          usersPassed: arrayUnion(foundUser),
          email: currentUser.email,
          displayName: currentUser.displayName,
        },
        { merge: true },
      );

      console.log("Saved passed user to Firestore:", foundUser);
    } catch (err) {
      console.error(" Failed to save to Firestore:", err);
    }
  };

  // ─── Permissions ───────────────────────────────────────────────────────────

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

  // ─── Device Discovery ──────────────────────────────────────────────────────

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
      const connected = await device.connect({ timeout: 20000, requestMTU: 512 });
      if (Platform.OS === "android") await connected.requestConnectionPriority(0);
      await new Promise((res) => setTimeout(res, 500));
      const discovered = await connected.discoverAllServicesAndCharacteristics();

      const characteristic = await discovered.readCharacteristicForService(
        APP_SERVICE_UUID,
        USERNAME_CHARACTERISTIC_UUID,
      );

      if (!characteristic.value) return;

      const decoded = Buffer.from(characteristic.value, "base64").toString("utf-8");

      if (decoded.startsWith("PM:")) {
        const foundUserID = decoded.slice(3);
        const docRef = doc(db, "Users", foundUserID);
        const foundData = (await getDoc(docRef)).data();
        const displayName = foundData?.displayName || foundUserID;

        setNearbyUsers((prev) =>
          prev.includes(displayName) ? prev : [...prev, displayName],
        );

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

  // ─── BLE Control ───────────────────────────────────────────────────────────

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

    const localName = `PM:${getAuth().currentUser?.uid || "Unknown"}`;
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

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>BLE Nearby</Text>
      <Text style={[styles.status, { color: textColor }]}>{statusMessage}</Text>

      <View style={styles.buttonGrid}>
        {getAuth().currentUser === null ? (
          <Text style={{ color: textColor, width: "100%" }}>
            You need to sign in to use the BLE features.
          </Text>
        ) : (
          <View style={{ width: "100%", alignItems: "center", marginBottom: 10 }}>
            <Text style={{ color: textColor, marginBottom: 10 }}>
              You're signed in as {getAuth().currentUser?.displayName || "User"}.
            </Text>
            
           
            { (
              <Text style={{ color: textColor }}>Character data not found.</Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, getAuth().currentUser && styles.buttonActive]}
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
    justifyContent: "center"
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
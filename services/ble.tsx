import React, { useEffect, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import {
  addDeviceFoundListener,
  removeListeners,
  setServices,
  startAdvertising,
  startScan,
  stopAdvertising,
  stopScan,
} from "munim-bluetooth";

import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
// Full 128-bit UUID — munim requires this format.
// The 128-bit form takes ~18 bytes in the packet, so we drop localName
// to stay within Android's 31-byte advertisement limit.
const APP_SERVICE_UUID = "0000ABCD-0000-1000-8000-00805F9B34FB";

const TEST_NAMES = ["T1", "T2", "T3", "T4"];

/** Convert a UTF-8 string to a hex string (e.g. "PM:T1" → "504D3A5431") */
const stringToHex = (str: string): string => {
  return Array.from(new TextEncoder().encode(str))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
};

/** Convert a hex string back to a UTF-8 string */
const hexToString = (hex: string): string => {
  const bytes = hex.match(/.{1,2}/g) ?? [];
  return bytes.map((b) => String.fromCharCode(parseInt(b, 16))).join("");
};

const BleNearbyUsers: React.FC = () => {
  const colorScheme = useColorScheme();

  // Define dynamic colors based on the theme
  const textColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";
  const backgroundColor = colorScheme === "dark" ? "#121212" : "#FFFFFF";

  const [scanning, setScanning] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [nearbyUsers, setNearbyUsers] = useState<string[]>([]);
  const [scanSubscription, setScanSubscription] = useState<(() => void) | null>(
    null,
  );

  const requestPermissions = async (): Promise<boolean> => {
    // Commented out until can figure out how to properly activate location services on iOS
    if (Platform.OS === "ios") {
      // 1. Check current status first
      const currentStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (currentStatus === RESULTS.DENIED) {
        // 2. Only request if not yet asked
        const whenInUseResult = await request(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );

        if (whenInUseResult === RESULTS.GRANTED) {
          // 3. Only request ALWAYS after WHEN_IN_USE is granted
          const alwaysResult = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
          console.log("Always permission:", alwaysResult);
        }
      } else if (currentStatus === RESULTS.BLOCKED) {
        // Permission was denied — prompt user to go to Settings
        console.log("Permission blocked, open Settings");
      } else {
        console.log("Current status:", currentStatus);
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
        console.warn("❌ Missing BLE permissions:", results);
        return false;
      }
    }
    return true;
  };

  const stopBLE = () => {
    stopScan();
    stopAdvertising();

    // Deactivate Scanning Flag
    setScanning(false);

    removeListeners(1);
    if (scanSubscription) {
      scanSubscription();
      setScanSubscription(null);
    }
    setUsername("");
  };

  const startBLE = async (name: string) => {
    const granted = await requestPermissions();
    if (!granted) return;

    stopBLE();

    setUsername(name);
    setNearbyUsers([]);

    const localName = `PM:${name}`;
    const localNameHex = stringToHex(localName);
    console.log("📡 Advertising as:", localName, "→ hex:", localNameHex);

    // Activate Scanning Flag
    setScanning(true);

    try {
      setServices([{ uuid: APP_SERVICE_UUID, characteristics: [] }]);

      // No localName here — dropping it saves ~8 bytes and keeps us
      // within the 31-byte BLE advertisement limit alongside the
      // 128-bit service UUID (~18 bytes) and manufacturerData (~7 bytes).
      if (Platform.OS === "android") {
        await startAdvertising({
          serviceUUIDs: [APP_SERVICE_UUID],
          manufacturerData: localNameHex,
        });
      } else {
        // iOS doesn't reliably broadcast manufacturerData, but it does broadcast localName — so we set that instead.
        await startAdvertising({
          serviceUUIDs: [APP_SERVICE_UUID],
          localName: localName,
        });
      }

      console.log("✅ Advertising started");
    } catch (err) {
      console.error("❌ Failed to start advertising:", err);
      return;
    }

    const subscription = addDeviceFoundListener((device: any) => {
      console.log("🔍 Raw device:", JSON.stringify(device));

      // --- Primary: manufacturerData (reliable on Android) ---
      const rawMfr: string | undefined =
        device.advertisingData?.manufacturerData ?? device.manufacturerData;

      console.log("🔍 RAW manufacturerData:", rawMfr);

      if (rawMfr && typeof rawMfr === "string") {
        try {
          const decoded = hexToString(rawMfr.slice(4));
          console.log("🔍 Decoded manufacturerData:", decoded);

          if (decoded.startsWith("PM:")) {
            const foundUser = decoded.slice(3);
            console.log("🔵 Found user via manufacturerData:", foundUser);
            if (foundUser) {
              setNearbyUsers((prev) =>
                prev.includes(foundUser) ? prev : [...prev, foundUser],
              );
              return; // Skip fallback
            }
          }
        } catch (e) {
          console.warn("⚠️ Failed to decode manufacturerData:", e);
        }
      }

      // --- Fallback: local name (reliable on iOS, not set on Android) ---
      const deviceName: string =
        device.name ??
        device.localName ??
        device.advertisingData?.completeLocalName ??
        device.advertisingData?.kCBAdvDataLocalName ??
        "";

      console.log("🔍 Device name (fallback):", deviceName);

      if (deviceName.startsWith("PM:")) {
        const foundUser = deviceName.slice(3);
        console.log("🔵 Found user via localName:", foundUser);
        if (foundUser) {
          setNearbyUsers((prev) =>
            prev.includes(foundUser) ? prev : [...prev, foundUser],
          );
        }
      }
    });

    try {
      await startScan({
        serviceUUIDs: [APP_SERVICE_UUID],
        allowDuplicates: false,
        scanMode: "balanced",
      });
      console.log("🔍 Scan started");
    } catch (err) {
      console.error("❌ Failed to start scan:", err);
    }

    setScanSubscription(() => subscription);
  };

  useEffect(() => {
    return () => stopBLE();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>BLE Nearby</Text>

      <Text style={[styles.status, { color: textColor }]}>
        {username ? `📡 Advertising as "${username}"` : "Not advertising"}
      </Text>

      {
        // Temporary way to allow custom usernames without hardcoding them as buttons.
      }
      <View style={{ marginBottom: 20 }}>
        <TextInput
          style={[{ color: textColor }]}
          placeholder="Type here..."
          // 2. Set the state variable into the input
          value={username}
          // 3. Update the variable as the user types
          onChangeText={setUsername}
        />
        <Text style={[{ color: textColor }]}>
          The variable currently holds: {username}
        </Text>
      </View>

      <View style={styles.buttonGrid}>
        <TouchableOpacity
          key={"start"}
          style={[styles.button, username && styles.buttonActive]}
          onPress={() => startBLE(username)}
        >
          <Text style={styles.buttonText}>Start BLE</Text>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.buttonGrid}>
        {TEST_NAMES.map((name) => (
          <TouchableOpacity
            key={name}
            style={[styles.button, username === name && styles.buttonActive]}
            onPress={() => startBLE(name)}
          >
            <Text style={styles.buttonText}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View> */}

      {username && scanning && (
        <TouchableOpacity style={styles.stopButton} onPress={stopBLE}>
          <Text style={styles.stopButtonText}>Stop BLE</Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.scannerTitle, { color: textColor }]}>
        👥 Nearby Users ({nearbyUsers.length})
      </Text>
      {nearbyUsers.length === 0 ? (
        <Text style={[styles.empty, { color: textColor }]}>
          {username ? "Scanning…" : "Start advertising to scan"}
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
  },
  button: {
    width: "47%",
    backgroundColor: "#007AFF",
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

import React, { useEffect, useRef, useState } from "react";
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

import { Buffer } from "buffer";
import { BleError, BleManager, Device } from "react-native-ble-plx";

import {
  setServices,
  startAdvertising,
  stopAdvertising,
} from "munim-bluetooth";

import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";

const APP_SERVICE_UUID = "0000ABCD-0000-1000-8000-00805F9B34FB";
const USERNAME_CHARACTERISTIC_UUID = "0000DCBA-0000-1000-8000-00805F9B34FB";

const bleManager = new BleManager();

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

    if (now - last < 10000) return; // 10s cooldown

    lastSeen.current.set(deviceId, now);

    // On Android (no UUID filter), skip weak signals to avoid
    // hammering every BLE device in range
    if (Platform.OS === "android" && (device.rssi ?? -100) < -85) {
      console.log("⏭️ Signal too weak, skipping:", deviceId, device.rssi);
      return;
    }

    if (connectingDevices.current.has(deviceId)) return;
    connectingDevices.current.add(deviceId);

    console.log(Platform.OS + ": 🔍 Discovered:", {
      id: deviceId,
      name: device.name ?? "unnamed",
      rssi: device.rssi,
    });

    try {
      // ── Connect ───────────────────────────────────────────────────
      // Android gets a longer timeout since backgrounded iOS is slower
      // to respond to incoming connections
      const connected = await device.connect({
        timeout: Platform.OS === "android" ? 20000 : 20000,
        requestMTU: 512,
      });
      console.log(Platform.OS + ": 🔗 Connected to:", deviceId);

      // Request high connection priority on Android to reduce
      // GATT latency with backgrounded iOS peripheral
      if (Platform.OS === "android") {
        await connected.requestConnectionPriority(0);
      }

      await new Promise((res) => setTimeout(res, 500));

      // ── Discover services and characteristics ─────────────────────
      const discovered =
        await connected.discoverAllServicesAndCharacteristics();
      console.log(Platform.OS + ": 🔎 Services discovered for:", deviceId);

      // ── Read characteristic ───────────────────────────────────────
      const characteristic = await discovered.readCharacteristicForService(
        APP_SERVICE_UUID,
        USERNAME_CHARACTERISTIC_UUID,
      );

      if (!characteristic.value) {
        console.warn(Platform.OS + ": ⚠️ Empty value from:", deviceId);
        return;
      }

      // ble-plx returns base64 on both platforms
      const decoded = Buffer.from(characteristic.value, "base64").toString(
        "utf-8",
      );
      console.log(Platform.OS + ": 📖 Decoded:", decoded, "from:", deviceId);

      if (decoded.startsWith("PM:")) {
        const foundUser = decoded.slice(3);
        console.log(Platform.OS + ": 🔵 Found user:", foundUser);
        setNearbyUsers((prev) =>
          prev.includes(foundUser) ? prev : [...prev, foundUser],
        );
      } else {
        console.log(
          Platform.OS + ": ⏭️ Not a PassMe device:",
          deviceId,
          "value:",
          decoded,
        );
      }
    } catch (err) {
      const bleErr = err as BleError;
      console.log(
        Platform.OS + ": ⏭️ Skipping",
        deviceId,
        "—",
        bleErr?.message ?? String(err),
      );
    } finally {
      try {
        await bleManager.cancelDeviceConnection(deviceId);
        console.log(Platform.OS + ": 🔌 Disconnected from:", deviceId);
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
    if (name.length < 2) {
      setStatusMessage("⚠️ Username must be at least 2 characters.");
      return;
    }

    const granted = await requestPermissions();
    if (!granted) return;

    stopBLE();
    setNearbyUsers([]);

    const localName = `PM:${name}`;
    console.log("📡 Advertising as:", localName, "on", Platform.OS);
    setScanning(true);
    setStatusMessage("📡 Starting...");

    // ── Peripheral: munim-bluetooth handles GATT server + advertising ──
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

      await startAdvertising({
        serviceUUIDs: [APP_SERVICE_UUID],
      });

      console.log("✅ Advertising started");
      setStatusMessage(`✅ Advertising as "${localName}"`);
    } catch (err) {
      console.error("❌ Failed to start advertising:", err);
      setStatusMessage("❌ Failed to start advertising. Please try again.");
      setScanning(false);
      return;
    }

    // ── Central: ble-plx handles scanning + service discovery + reading ──
    // iOS: filter by UUID since it can see other iOS overflow advertisements
    // Android: no UUID filter since it can't see backgrounded iOS overflow UUIDs
    bleManager.startDeviceScan(
      Platform.OS === "android" ? null : [APP_SERVICE_UUID],
      { allowDuplicates: true },
      (error, device) => {
        if (error) {
          console.error("❌ Scan error:", error);
          setStatusMessage("❌ Scan error: " + error.message);
          return;
        }
        if (device) {
          handleDiscoveredDevice(device);
        }
      },
    );

    console.log("🔍 Scan started");
  };

  useEffect(() => {
    return () => {
      stopBLE();
      bleManager.destroy();
    };
  }, []);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>BLE Nearby</Text>

      <Text style={[styles.status, { color: textColor }]}>{statusMessage}</Text>

      <View style={{ marginBottom: 20 }}>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: textColor }]}
          placeholder="Enter your name..."
          placeholderTextColor={colorScheme === "dark" ? "#888" : "#AAA"}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.buttonGrid}>
        <TouchableOpacity
          style={[styles.button, username.length >= 2 && styles.buttonActive]}
          onPress={() => startBLE(username)}
          disabled={username.length < 2}
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
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

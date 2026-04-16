import { useAuth } from "@/hooks/use-auth";
import { Buffer } from "buffer";
import {
  setServices,
  startAdvertising,
  stopAdvertising,
} from "munim-bluetooth";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";

const APP_SERVICE_UUID = "0000ABCD-0000-1000-8000-00805F9B34FB";
const USERNAME_CHARACTERISTIC_UUID = "0000DCBA-0000-1000-8000-00805F9B34FB";

const BleContext = createContext(null);

const bleManager = new BleManager();

const stringToHex = (str) =>
  Array.from(new TextEncoder().encode(str))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

export const BLEProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [scanning, setScanning] = useState(false);

  const connectingDevices = useRef(new Set());
  const lastSeen = useRef(new Map());

  // Permissions
  const requestPermissions = async () => {
    if (Platform.OS === "android" && Platform.Version >= 31) {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      ]);

      return Object.values(results).every(
        (r) => r === PermissionsAndroid.RESULTS.GRANTED,
      );
    }

    return true;
  };

  const stopBLE = () => {
    bleManager.stopDeviceScan();
    stopAdvertising();
    connectingDevices.current.clear();
    setScanning(false);
  };

  const handleDevice = async (device) => {
    const now = Date.now();
    const last = lastSeen.current.get(device.id) || 0;

    // Prevent processing same device too frequently
    if (now - last < 10000) return;
    lastSeen.current.set(device.id, now);

    if (connectingDevices.current.has(device.id)) return;
    connectingDevices.current.add(device.id);

    try {
      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();

      const characteristic = await connected.readCharacteristicForService(
        APP_SERVICE_UUID,
        USERNAME_CHARACTERISTIC_UUID,
      );

      if (!characteristic.value) return;

      const decoded = Buffer.from(characteristic.value, "base64").toString(
        "utf-8",
      );

      if (decoded.startsWith("PM:")) {
        const uid = decoded.slice(3);

        setNearbyUsers((prev) => (prev.includes(uid) ? prev : [...prev, uid]));
      }
      console.log(
        `Connected to ${device.name} (${device.id}), got UID: ${decoded}`,
      );
    } catch {
      // ignore
    } finally {
      try {
        await bleManager.cancelDeviceConnection(device.id);
      } catch {}
      connectingDevices.current.delete(device.id);
    }
  };

  const startBLE = async () => {
    if (!currentUser) return;

    const granted = await requestPermissions();
    if (!granted) return;

    const localName = `PM:${currentUser.uid}`;

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

      bleManager.startDeviceScan(
        Platform.OS === "android" ? null : [APP_SERVICE_UUID],
        { allowDuplicates: true },
        (_, device) => {
          if (device) handleDevice(device);
        },
      );

      setScanning(true);
    } catch (err) {
      console.log("BLE start failed", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      console.log("✅ BLE starting (user exists)");
      startBLE();
    } else {
      console.log("🛑 BLE stopping (user logged out)");
      stopBLE();
      setNearbyUsers([]);
    }

    return () => stopBLE();
  }, [currentUser]);

  return (
    <BleContext.Provider
      value={{
        nearbyUsers,
        scanning,
        stopBLE,
      }}
    >
      {children}
    </BleContext.Provider>
  );
};

export const useBLE = () => useContext(BleContext);

import { useBLE } from "@/components/ble-provider";
import { useNotification } from "@/contexts/NotificationContext";
import { useAuth } from "@/hooks/use-auth";
import firestore from "@react-native-firebase/firestore";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const NearbyUserContext = createContext(null);

export const NearbyUserProvider = ({ children }) => {
  const { nearbyUsers: discoveredUIDs } = useBLE();
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();

  const [users, setUsers] = useState([]);

  const processed = useRef(new Set());

  const savePassedUser = async (foundUser) => {
    if (!currentUser) return;

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
  };

  useEffect(() => {
    if (!currentUser) return;

    const processUser = async (uid) => {
      if (processed.current.has(uid)) return;
      processed.current.add(uid);

      try {
        const userSnap = await firestore().collection("Users").doc(uid).get();

        const userData = userSnap.data();

        const passlingSnap = await firestore()
          .collection("Passlings")
          .doc(uid)
          .get();

        const passlingData = passlingSnap.exists ? passlingSnap.data() : null;

        const passlingColor = passlingSnap.exists ? passlingSnap.data().outfit_color : null;

        const displayName = userData?.username || userData?.displayName || uid;

        const greeting =
         userData?.greeting || "just passed you!";
        

        setUsers((prev) => {
          if (prev.find((u) => u.uid === uid)) return prev;

          return [
            ...prev,
            {
              uid,
              displayName,
              data: userData,
              passling: passlingData,
            },
          ];
        });
        console.log(passlingColor)
        showNotification(displayName, passlingData, greeting, passlingColor );

        await savePassedUser(uid);

        console.log("✅ Processed nearby user:", uid);
      } catch (err) {
        console.error("❌ Failed processing user:", uid, err);
      }
    };

    discoveredUIDs.forEach(processUser);
  }, [discoveredUIDs, currentUser]);

  // Reset when user logs out
  useEffect(() => {
    if (!currentUser) {
      setUsers([]);
      processed.current.clear();
    }
  }, [currentUser]);

  return (
    <NearbyUserContext.Provider value={{ users }}>
      {children}
    </NearbyUserContext.Provider>
  );
};

export const useNearbyUsers = () => useContext(NearbyUserContext);

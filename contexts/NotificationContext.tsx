// context/NotificationContext.tsx
import Passling from "@/components/passling";
import React, { createContext, useCallback, useContext, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type Notification = {
  id: string;
  username: string;
  passlingData: any | null;  // ← added
  translateY: Animated.Value;
  opacity: Animated.Value;
};

type NotificationContextType = {
  showNotification: (username: string, passlingData?: any) => void;  // ← added param
};

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((username: string, passlingData: any = null) => {  // ← added param
    const id = Date.now().toString();
    const translateY = new Animated.Value(-80);
    const opacity = new Animated.Value(0);

    const newNotif: Notification = { id, username, passlingData, translateY, opacity };  // ← stored
    setNotifications((prev) => [...prev, newNotif]);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -80,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      });
    }, 3500);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <View style={styles.notifContainer} pointerEvents="none">
        {notifications.map((notif) => (
          <Animated.View
            key={notif.id}
            style={[
              styles.notifBanner,
              {
                transform: [{ translateY: notif.translateY }],
                opacity: notif.opacity,
              },
            ]}
          >
            {/* Passling avatar clipped to a circle, same approach as ProfileScreen */}
            <View style={styles.passlingWrap}>
  <View>
    {notif.passlingData ? (
      <View style={styles.passlingClip}>
        <Passling data={notif.passlingData} size={120} />
      </View>
    ) : (
      <Text style={styles.emoji}>👋</Text>
    )}
  </View>
</View>


            <View>
              <Text style={styles.notifUsername}>{notif.username}</Text>
              <Text style={styles.notifSubtext}>just passed you!</Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

const AVATAR_SIZE = 52;

const styles = StyleSheet.create({
  notifContainer: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  notifBanner: {
    backgroundColor: "#005BBB",
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#00CFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },


  // Replace passlingWrap and passlingClip:
  passlingWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#fff",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  passlingClip: {
    transform: [{ translateX: 6 }, { translateY: 30 }],  // ← tuned for size=120
  },
  emoji: {
    fontSize: 24,
  },
  notifUsername: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  notifSubtext: {
    color: "#A8D4FF",
    fontSize: 13,
    marginTop: 2,
  },
});
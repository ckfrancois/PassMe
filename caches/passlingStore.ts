import { doc, getFirestore, onSnapshot } from "firebase/firestore";

const db = getFirestore();

type PasslingData = any;

let cache: Record<string, PasslingData | null> = {};
let unsubscribers: Record<string, () => void> = {};

const listeners = new Set<(data: PasslingData | null) => void>();

export const PasslingStore = {
  // subscribe UI components
  subscribe(listener: (data: any) => void) {
    listeners.add(listener);
  
    return () => {
      listeners.delete(listener);
    };
  },

  get(uid: string) {
    return cache[uid] ?? null;
  },

  // 🔥 start live sync once per user
  start(uid: string) {
    if (unsubscribers[uid]) return;
  
    const ref = doc(db, "Passlings", uid);
  
    let initialized = false;
    let lastGoodData: any = null;
  
    unsubscribers[uid] = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;
  
      const data = snap.data();
  
      // 🚀 ALWAYS keep last known good value
      if (data) {
        lastGoodData = data;
        cache[uid] = data;
      }
  
      // 🚀 BLOCK FIRST TRANSITION FLICKER
      if (!initialized) {
        initialized = true;
        listeners.forEach((l) => l(lastGoodData));
        return;
      }
  
      // 🚀 ONLY UPDATE IF VALUE CHANGED
      const prev = cache[uid];
      if (JSON.stringify(prev) !== JSON.stringify(data)) {
        listeners.forEach((l) => l(data));
      }
    });
  },

  stop(uid: string) {
    if (unsubscribers[uid]) {
      unsubscribers[uid]();
      delete unsubscribers[uid];
    }
    delete cache[uid];
  }
};
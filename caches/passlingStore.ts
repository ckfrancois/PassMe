import { doc, getFirestore, onSnapshot } from "firebase/firestore";

type PasslingData = any;

let cache: Record<string, PasslingData | null> = {};
let unsubscribers: Record<string, () => void> = {};

const listeners = new Set<(data: PasslingData | null) => void>();

export const PasslingStore = {
  subscribe(listener: (data: any) => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  get(uid: string) {
    return cache[uid] ?? null;
  },

  start(uid: string) {
    if (unsubscribers[uid]) return;

    const db = getFirestore(); // lazy — Firebase is initialized by now
    const ref = doc(db, "Passlings", uid);

    let initialized = false;
    let lastGoodData: any = null;

    unsubscribers[uid] = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();

      if (data) {
        lastGoodData = data;
        cache[uid] = data;
      }

      if (!initialized) {
        initialized = true;
        listeners.forEach((l) => l(lastGoodData));
        return;
      }

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
  },
};

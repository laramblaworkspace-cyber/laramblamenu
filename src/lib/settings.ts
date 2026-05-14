import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DEFAULT_SETTINGS, type RestaurantSettings } from "@/lib/types";

const settingsRef = doc(db, "settings", "restaurant");

export function subscribeRestaurantSettings(
  onData: (s: RestaurantSettings) => void,
  onError?: (e: Error) => void,
) {
  return onSnapshot(
    settingsRef,
    (snap) => {
      if (!snap.exists()) {
        onData(DEFAULT_SETTINGS);
        return;
      }
      const d = snap.data();
      onData({
        name: String(d.name ?? DEFAULT_SETTINGS.name),
        tagline: String(d.tagline ?? DEFAULT_SETTINGS.tagline),
      });
    },
    (err) => onError?.(err as Error),
  );
}

export async function fetchRestaurantSettings(): Promise<RestaurantSettings> {
  const snap = await getDoc(settingsRef);
  if (!snap.exists()) return DEFAULT_SETTINGS;
  const d = snap.data();
  return {
    name: String(d.name ?? DEFAULT_SETTINGS.name),
    tagline: String(d.tagline ?? DEFAULT_SETTINGS.tagline),
  };
}

export async function saveRestaurantSettings(s: RestaurantSettings) {
  await setDoc(settingsRef, s, { merge: true });
}

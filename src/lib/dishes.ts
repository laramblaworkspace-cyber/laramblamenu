import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Dish } from "@/lib/types";

const dishesCol = collection(db, "dishes");

function parsePrice(data: Record<string, unknown>): number | null {
  const raw = data.price;
  if (raw === null || raw === undefined) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function subscribeDishes(
  onData: (dishes: Dish[]) => void,
  onError?: (e: Error) => void,
) {
  const q = query(dishesCol, orderBy("sortOrder", "asc"));
  return onSnapshot(
    q,
    (snap) => {
      const list: Dish[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: String(data.name ?? ""),
          description: String(data.description ?? ""),
          price: parsePrice(data),
          category: String(data.category ?? "Antipasti"),
          sortOrder: Number(data.sortOrder ?? 0),
          active: Boolean(data.active ?? true),
          createdAt: data.createdAt ?? null,
        };
      });
      onData(list);
    },
    (err) => onError?.(err as Error),
  );
}

export async function createDish(input: Omit<Dish, "id" | "createdAt">) {
  await addDoc(dishesCol, {
    name: input.name,
    description: input.description,
    price: input.price,
    category: input.category,
    sortOrder: input.sortOrder,
    active: input.active,
    createdAt: serverTimestamp(),
  });
}

export async function updateDish(
  id: string,
  patch: Partial<Omit<Dish, "id" | "createdAt">>,
) {
  await updateDoc(doc(db, "dishes", id), patch);
}

export async function removeDish(id: string) {
  await deleteDoc(doc(db, "dishes", id));
}

import type { Timestamp } from "firebase/firestore";

export type Dish = {
  id: string;
  name: string;
  description: string;
  /** `null` = nessun prezzo mostrato nel menu. */
  price: number | null;
  category: string;
  sortOrder: number;
  active: boolean;
  createdAt?: Timestamp | null;
};

export type RestaurantSettings = {
  name: string;
  tagline: string;
};

export const DEFAULT_SETTINGS: RestaurantSettings = {
  name: "La Rambla",
  tagline: "Pizzeria — Ristorante",
};

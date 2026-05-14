import { useSyncExternalStore } from "react";
import {
  getPublicMenuUrlClient,
  getPublicMenuUrlServer,
} from "@/lib/public-menu-url";

export function usePublicMenuUrl() {
  return useSyncExternalStore(
    () => () => {},
    getPublicMenuUrlClient,
    getPublicMenuUrlServer,
  );
}

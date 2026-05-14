import type { Metadata } from "next";
import { PublicMenuView } from "@/components/PublicMenuView";

export const metadata: Metadata = {
  title: "Menu",
  description: "Menu digitale del ristorante",
};

export default function MenuPage() {
  return (
    <main className="flex flex-1 flex-col py-6">
      <PublicMenuView />
    </main>
  );
}

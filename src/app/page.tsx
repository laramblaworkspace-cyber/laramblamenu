import type { Metadata } from "next";
import { PublicMenuView } from "@/components/PublicMenuView";

export const metadata: Metadata = {
  title: "Menu",
  description: "Menu digitale La Rambla",
};

export default function Home() {
  return (
    <main className="public-menu-root flex flex-1 flex-col py-6 sm:py-10">
      <PublicMenuView />
    </main>
  );
}

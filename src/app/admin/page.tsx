import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Amministrazione",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="flex flex-1 flex-col py-4">
      <AdminPanel />
    </main>
  );
}

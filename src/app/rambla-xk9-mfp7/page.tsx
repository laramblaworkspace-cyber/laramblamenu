import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Gestione menu",
  robots: { index: false, follow: false },
};

export default function HiddenAdminPage() {
  return (
    <main className="min-h-screen flex-1 bg-gradient-to-b from-[#f7f1e8] to-[#e8dcc8] py-4">
      <AdminPanel />
    </main>
  );
}

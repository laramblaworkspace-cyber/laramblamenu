import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export const metadata: Metadata = {
  title: "Accesso",
  robots: { index: false, follow: false },
};

export default function HiddenAdminLoginPage() {
  return (
    <main className="min-h-screen flex-1 bg-gradient-to-b from-[#f7f1e8] to-[#e8dcc8]">
      <AdminLoginForm />
    </main>
  );
}

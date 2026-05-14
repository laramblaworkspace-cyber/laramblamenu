import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AdminLoginForm />
    </main>
  );
}

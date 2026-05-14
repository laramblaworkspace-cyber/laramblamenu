import type { Metadata } from "next";
import { QrTableCard } from "@/components/QrTableCard";

export const metadata: Metadata = {
  title: "QR tavolo",
  description: "QR code per accedere al menu digitale",
};

export default function QrPage() {
  return (
    <main className="flex flex-1 flex-col py-6">
      <QrTableCard />
    </main>
  );
}

import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Larambla · Menu digitale",
    template: "%s · Larambla",
  },
  description: "Menu digitale rustico di montagna — funghi porcini e sapori di bosco.",
};

function Nav() {
  return (
    <header className="border-b border-[var(--edge)] bg-[rgba(255,252,246,0.85)] backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-lg tracking-wide text-[var(--ink)]">
          Larambla
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/menu"
            className="rounded-full px-3 py-1.5 text-[var(--muted)] hover:bg-white/80 hover:text-[var(--ink)]"
          >
            Menu
          </Link>
          <Link
            href="/qr"
            className="rounded-full px-3 py-1.5 text-[var(--muted)] hover:bg-white/80 hover:text-[var(--ink)]"
          >
            QR tavolo
          </Link>
          <Link
            href="/admin/login"
            className="rounded-full bg-[var(--wood)] px-3 py-1.5 text-[var(--cream)] hover:opacity-95"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}

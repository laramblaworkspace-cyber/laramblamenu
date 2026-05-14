import type { Metadata, Viewport } from "next";
import { Great_Vibes, Montserrat } from "next/font/google";
import "./globals.css";

const display = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});

const body = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "La Rambla · Menu",
    template: "%s · La Rambla",
  },
  description: "Menu digitale — Pizzeria Ristorante",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f6f0e8",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full min-h-dvh antialiased">{children}</body>
    </html>
  );
}

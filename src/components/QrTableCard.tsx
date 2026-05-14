"use client";

import { QRCodeSVG } from "qrcode.react";
import { useSyncExternalStore } from "react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { subscribeRestaurantSettings } from "@/lib/settings";
import type { RestaurantSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";

function getMenuUrlFromWindow() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) return `${fromEnv}/menu`;
  if (typeof window !== "undefined") return `${window.location.origin}/menu`;
  return "";
}

export function QrTableCard() {
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);

  const menuUrl = useSyncExternalStore(
    () => () => {},
    getMenuUrlFromWindow,
    () => {
      const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
      return fromEnv ? `${fromEnv}/menu` : "";
    },
  );

  useEffect(() => {
    const unsub = subscribeRestaurantSettings(setSettings);
    return () => unsub();
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="rounded-[2rem] border-2 border-[var(--edge)] bg-white/90 p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <BrandLogo restaurantName={settings.name} />
        </div>
        <p className="font-display text-lg text-[var(--muted)]">
          Scansiona per aprire il menu
        </p>
        <div className="mt-6 flex justify-center rounded-2xl bg-white p-4 ring-1 ring-[var(--edge)]">
          {menuUrl ? (
            <QRCodeSVG
              value={menuUrl}
              size={220}
              level="M"
              includeMargin
              fgColor="#3d2914"
              bgColor="#ffffff"
            />
          ) : (
            <div className="h-[220px] w-[220px] animate-pulse rounded-xl bg-[var(--cream)]" />
          )}
        </div>
        <p className="mt-4 break-all text-xs text-[var(--muted)]">{menuUrl}</p>
        <p className="mt-6 text-xs text-[var(--muted)]">
          Stampa questa pagina o salva il QR e posizionalo sui tavoli.
        </p>
      </div>
    </div>
  );
}

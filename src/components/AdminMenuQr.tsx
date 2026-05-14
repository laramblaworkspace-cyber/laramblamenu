"use client";

import { QRCodeSVG } from "qrcode.react";
import { usePublicMenuUrl } from "@/hooks/usePublicMenuUrl";

export function AdminMenuQr() {
  const menuUrl = usePublicMenuUrl();

  return (
    <section className="mb-10 rounded-2xl border border-[var(--edge)] bg-[#0a0a0a] p-6 text-center text-[var(--gold)] shadow-inner">
      <h2 className="font-display text-xl text-[var(--gold)]">QR per i tavoli</h2>
      <p className="mt-2 text-sm text-[var(--gold-soft)]">
        Punta alla homepage del menu (ciò che vede il cliente). Stampalo o invia
        l&apos;immagine al tipografo.
      </p>
      <div className="mt-6 flex justify-center rounded-2xl bg-white p-4">
        {menuUrl ? (
          <QRCodeSVG
            value={menuUrl}
            size={200}
            level="M"
            includeMargin
            fgColor="#0a0a0a"
            bgColor="#ffffff"
          />
        ) : (
          <div className="h-[200px] w-[200px] animate-pulse rounded-xl bg-neutral-200" />
        )}
      </div>
      {menuUrl ? (
        <p className="mt-4 break-all font-mono text-xs text-[var(--gold-soft)]">
          {menuUrl}
        </p>
      ) : null}
      <p className="mt-4 text-xs text-[var(--gold-soft)]">
        In produzione imposta <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_APP_URL</code>{" "}
        su Vercel con l&apos;URL definitivo (senza slash finale).
      </p>
    </section>
  );
}

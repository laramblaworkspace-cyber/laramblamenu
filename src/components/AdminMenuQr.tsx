"use client";

import { QRCodeSVG } from "qrcode.react";
import QRCode from "qrcode";
import { useCallback, useState } from "react";
import { usePublicMenuUrl } from "@/hooks/usePublicMenuUrl";

export function AdminMenuQr() {
  const menuUrl = usePublicMenuUrl();
  const [downloading, setDownloading] = useState(false);

  const downloadPng = useCallback(async () => {
    if (!menuUrl) return;
    setDownloading(true);
    try {
      const dataUrl = await QRCode.toDataURL(menuUrl, {
        width: 640,
        margin: 2,
        color: { dark: "#2a2118", light: "#ffffff" },
        errorCorrectionLevel: "M",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "la-rambla-qr-menu.png";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setDownloading(false);
    }
  }, [menuUrl]);

  return (
    <section className="mb-8 rounded-2xl border border-[var(--edge)] bg-white p-4 shadow-sm sm:mb-10 sm:p-6">
      <h2 className="font-display text-xl text-[var(--ink)] sm:text-2xl">QR menu</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
        Da inviare al tipografo o al cliente: punta alla pagina del menu.
      </p>
      <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center sm:gap-8">
        <div className="flex justify-center rounded-2xl bg-[#fafafa] p-4 ring-1 ring-[var(--edge)]">
          {menuUrl ? (
            <QRCodeSVG
              value={menuUrl}
              size={200}
              level="M"
              includeMargin
              fgColor="#2a2118"
              bgColor="#ffffff"
              className="h-auto w-full max-w-[200px]"
            />
          ) : (
            <div className="h-[200px] w-[200px] animate-pulse rounded-xl bg-neutral-200" />
          )}
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:pt-2">
          <button
            type="button"
            onClick={downloadPng}
            disabled={!menuUrl || downloading}
            className="min-h-12 w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-base font-semibold text-white active:opacity-90 disabled:opacity-50 sm:min-h-11"
          >
            {downloading ? "Preparo…" : "Scarica QR (PNG)"}
          </button>
          <p className="break-all text-center font-mono text-[11px] text-[var(--muted)] sm:text-left sm:text-xs">
            {menuUrl || "—"}
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
        Su Vercel imposta <code className="rounded bg-[var(--cream)] px-1 py-0.5 text-[var(--ink)]">NEXT_PUBLIC_APP_URL</code>{" "}
        con l&apos;URL del sito (senza slash finale) così il link è sempre corretto.
      </p>
    </section>
  );
}

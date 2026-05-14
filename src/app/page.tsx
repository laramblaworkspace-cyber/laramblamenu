import Link from "next/link";
import { MushroomMark } from "@/components/MushroomMark";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-24 -top-16 h-64 w-64 rounded-full bg-[rgba(160,82,45,0.12)] blur-3xl"
          aria-hidden
        />
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-16 sm:flex-row sm:items-center sm:px-6 sm:py-20">
          <div className="flex-1 space-y-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
              Montagna · Bosco · Porcini
            </p>
            <h1 className="font-display text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
              Il menu digitale del tuo rifugio, sempre aggiornato.
            </h1>
            <p className="max-w-xl text-lg text-[var(--muted)]">
              I clienti scansionano il QR sul tavolo e leggono il menu dal telefono. Tu
              modifichi piatti e prezzi dall&apos;area riservata, in tempo reale su
              Firestore.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
              >
                Apri il menu
              </Link>
              <Link
                href="/qr"
                className="inline-flex items-center justify-center rounded-full border border-[var(--edge)] bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-white"
              >
                Scarica QR tavolo
              </Link>
            </div>
            <p className="text-sm text-[var(--muted)]">
              Logo: aggiungi il file{" "}
              <code className="rounded bg-white/60 px-1.5 py-0.5 text-[var(--ink)]">
                public/logo.png
              </code>{" "}
              (PNG o JPG rinominato) per sostituire il simbolo fungo provvisorio.
            </p>
          </div>
          <div className="flex flex-1 justify-center sm:justify-end">
            <div className="relative rounded-[2rem] border border-[var(--edge)] bg-white/80 p-10 shadow-xl">
              <MushroomMark className="mx-auto h-28 w-28 sm:h-32 sm:w-32" />
              <p className="mt-6 text-center font-display text-xl text-[var(--ink)]">
                Prodotto di montagna
              </p>
              <p className="mt-2 text-center text-sm italic text-[var(--muted)]">
                Funghi porcini, erbe di bosco, sapori rustici.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

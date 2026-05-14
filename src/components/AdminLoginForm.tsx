"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN_BASE_PATH } from "@/lib/admin-route";
import { auth } from "@/lib/firebase";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace(`/${ADMIN_BASE_PATH}`);
    } catch {
      setError("Credenziali non valide o errore di rete.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:py-16">
      <div className="rounded-2xl border border-[var(--edge)] bg-white p-6 shadow-lg sm:p-8">
        <h1 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
          Area riservata
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Accedi per modificare il menu.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Email</span>
            <input
              type="email"
              autoComplete="username"
              required
              className="mt-1.5 min-h-12 w-full rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2 text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              className="mt-1.5 min-h-12 w-full rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2 text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full rounded-xl bg-[var(--accent)] text-base font-semibold text-white disabled:opacity-50 sm:rounded-full"
          >
            {loading ? "Accesso…" : "Entra"}
          </button>
        </form>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex min-h-12 items-center justify-center text-center text-sm font-medium text-[var(--muted)] active:text-[var(--ink)]"
        >
          Apri menu cliente
        </Link>
      </div>
    </div>
  );
}

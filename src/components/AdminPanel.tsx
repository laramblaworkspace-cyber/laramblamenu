"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import {
  createDish,
  removeDish,
  subscribeDishes,
  updateDish,
} from "@/lib/dishes";
import { auth } from "@/lib/firebase";
import {
  saveRestaurantSettings,
  subscribeRestaurantSettings,
} from "@/lib/settings";
import type { Dish, RestaurantSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "Antipasti",
  sortOrder: "0",
  active: true,
};

export function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubSettings = subscribeRestaurantSettings(setSettings);
    const unsubDishes = subscribeDishes(setDishes);
    return () => {
      unsubSettings();
      unsubDishes();
    };
  }, [user]);

  const categories = useMemo(() => {
    const s = new Set<string>();
    dishes.forEach((d) => s.add(d.category || "Generale"));
    ["Antipasti", "Primi", "Secondi", "Contorni", "Dolci", "Bevande"].forEach(
      (c) => s.add(c),
    );
    return Array.from(s).sort((a, b) => a.localeCompare(b, "it"));
  }, [dishes]);

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      await saveRestaurantSettings(settings);
      setMessage("Impostazioni salvate.");
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmitDish(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const price = Number(form.price.replace(",", "."));
    if (!form.name.trim() || Number.isNaN(price)) {
      setMessage("Nome e prezzo validi sono obbligatori.");
      setBusy(false);
      return;
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      category: form.category.trim() || "Generale",
      sortOrder: Number(form.sortOrder) || 0,
      active: form.active,
    };
    try {
      if (editingId) {
        await updateDish(editingId, payload);
        setMessage("Piatto aggiornato.");
      } else {
        await createDish(payload);
        setMessage("Piatto aggiunto.");
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function startEdit(d: Dish) {
    setEditingId(d.id);
    setForm({
      name: d.name,
      description: d.description,
      price: String(d.price),
      category: d.category,
      sortOrder: String(d.sortOrder),
      active: d.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminare questo piatto?")) return;
    setBusy(true);
    setMessage(null);
    try {
      await removeDish(id);
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      setMessage("Piatto eliminato.");
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-[var(--muted)]">Accesso richiesto.</p>
        <Link
          href="/admin/login"
          className="mt-4 inline-block rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-medium text-white hover:opacity-95"
        >
          Vai al login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <BrandLogo restaurantName={settings.name} />
        <div className="flex flex-wrap gap-2">
          <Link
            href="/menu"
            className="rounded-full border border-[var(--edge)] bg-white/70 px-4 py-2 text-sm text-[var(--ink)] hover:bg-white"
          >
            Anteprima menu
          </Link>
          <Link
            href="/qr"
            className="rounded-full border border-[var(--edge)] bg-white/70 px-4 py-2 text-sm text-[var(--ink)] hover:bg-white"
          >
            QR tavolo
          </Link>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-[var(--cream)] hover:opacity-90"
          >
            Esci
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSaveSettings}
        className="mb-10 rounded-2xl border border-[var(--edge)] bg-white/60 p-5 shadow-inner"
      >
        <h2 className="font-display text-xl text-[var(--ink)]">Insegna</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Nome e tagline mostrati in cima al menu pubblico.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Nome locale</span>
            <input
              className="mt-1 w-full rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2"
              value={settings.name}
              onChange={(e) =>
                setSettings((s) => ({ ...s, name: e.target.value }))
              }
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Tagline</span>
            <input
              className="mt-1 w-full rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2"
              value={settings.tagline}
              onChange={(e) =>
                setSettings((s) => ({ ...s, tagline: e.target.value }))
              }
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="mt-4 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Salva insegna
        </button>
      </form>

      <form
        onSubmit={handleSubmitDish}
        className="mb-10 rounded-2xl border border-[var(--edge)] bg-white/80 p-5"
      >
        <h2 className="font-display text-xl text-[var(--ink)]">
          {editingId ? "Modifica piatto" : "Nuovo piatto"}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="text-[var(--muted)]">Nome</span>
            <input
              required
              className="mt-1 w-full rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="text-[var(--muted)]">Descrizione</span>
            <textarea
              rows={2}
              className="mt-1 w-full rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Prezzo (€)</span>
            <input
              required
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Ordine</span>
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2"
              value={form.sortOrder}
              onChange={(e) =>
                setForm((f) => ({ ...f, sortOrder: e.target.value }))
              }
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="text-[var(--muted)]">Categoria</span>
            <input
              list="categories"
              className="mt-1 w-full rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            />
            <datalist id="categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm((f) => ({ ...f, active: e.target.checked }))
              }
            />
            <span className="text-[var(--muted)]">Visibile nel menu</span>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {editingId ? "Aggiorna" : "Aggiungi"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="rounded-full border border-[var(--edge)] px-5 py-2 text-sm"
            >
              Annulla modifica
            </button>
          ) : null}
        </div>
      </form>

      {message ? (
        <p className="mb-6 rounded-xl bg-[var(--cream)] px-4 py-2 text-sm text-[var(--ink)]">
          {message}
        </p>
      ) : null}

      <section>
        <h2 className="font-display text-xl text-[var(--ink)]">Piatti</h2>
        <ul className="mt-4 space-y-3">
          {dishes.map((d) => (
            <li
              key={d.id}
              className="flex flex-col gap-2 rounded-xl border border-[var(--edge)] bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-[var(--ink)]">
                  {d.name}{" "}
                  {!d.active ? (
                    <span className="text-xs text-amber-700">(nascosto)</span>
                  ) : null}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {d.category} · €{d.price} · ordine {d.sortOrder}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(d)}
                  className="rounded-full border border-[var(--edge)] px-3 py-1 text-sm"
                >
                  Modifica
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(d.id)}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-800"
                >
                  Elimina
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

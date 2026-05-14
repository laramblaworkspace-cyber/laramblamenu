"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminMenuQr } from "@/components/AdminMenuQr";
import { BrandLogo } from "@/components/BrandLogo";
import {
  createDish,
  removeDish,
  subscribeDishes,
  updateDish,
} from "@/lib/dishes";
import { MENU_CATEGORY_ORDER } from "@/lib/categories";
import { ADMIN_BASE_PATH } from "@/lib/admin-route";
import { auth } from "@/lib/firebase";
import {
  saveRestaurantSettings,
  subscribeRestaurantSettings,
} from "@/lib/settings";
import type { Dish, RestaurantSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";

const CATEGORY_OTHER = "__altro__";
const presetSet = new Set<string>(MENU_CATEGORY_ORDER);

const emptyForm: {
  name: string;
  description: string;
  price: string;
  hasPrice: boolean;
  category: string;
  sortOrder: string;
  active: boolean;
} = {
  name: "",
  description: "",
  price: "",
  hasPrice: false,
  category: MENU_CATEGORY_ORDER[0],
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

  const loginHref = `/${ADMIN_BASE_PATH}/login`;

  const categorySelectValue = useMemo(
    () => (presetSet.has(form.category) ? form.category : CATEGORY_OTHER),
    [form.category],
  );

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

    const catTrim = form.category.trim();
    if (!form.name.trim()) {
      setMessage("Il nome del piatto è obbligatorio.");
      setBusy(false);
      return;
    }
    if (categorySelectValue === CATEGORY_OTHER && !catTrim) {
      setMessage("Scrivi il nome della categoria oppure scegline una dall’elenco.");
      setBusy(false);
      return;
    }

    let price: number | null = null;
    if (form.hasPrice) {
      const raw = form.price.replace(",", ".").trim();
      if (!raw) {
        setMessage(
          "Hai scelto di indicare il prezzo: inserisci un importo oppure disattiva l’opzione.",
        );
        setBusy(false);
        return;
      }
      const n = Number(raw);
      if (Number.isNaN(n)) {
        setMessage("Prezzo non valido.");
        setBusy(false);
        return;
      }
      price = n;
    }

    const category = catTrim || MENU_CATEGORY_ORDER[0];
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      category,
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
    const rawCat = d.category.trim();
    const category = rawCat || MENU_CATEGORY_ORDER[0];
    setForm({
      name: d.name,
      description: d.description,
      price: d.price !== null ? String(d.price) : "",
      hasPrice: d.price !== null,
      category,
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
      <div className="mx-auto max-w-md px-4 py-16 pb-[max(4rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[var(--muted)]">Accesso richiesto.</p>
        <Link
          href={loginHref}
          className="mt-6 inline-flex min-h-12 min-w-[10rem] items-center justify-center rounded-full bg-[var(--accent)] px-6 text-base font-semibold text-white active:opacity-90"
        >
          Vai al login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-3 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <BrandLogo restaurantName={settings.name} />
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 min-w-[10rem] flex-1 items-center justify-center rounded-xl border border-[var(--edge)] bg-white px-4 text-center text-sm font-semibold text-[var(--ink)] active:bg-[var(--cream)] sm:flex-none sm:rounded-full"
          >
            Menu cliente
          </Link>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-[var(--ink)] px-4 text-sm font-semibold text-[var(--cream)] active:opacity-90 sm:flex-none sm:rounded-full sm:px-5"
          >
            Esci
          </button>
        </div>
      </div>

      <AdminMenuQr />

      <form
        onSubmit={handleSaveSettings}
        className="mb-8 rounded-2xl border border-[var(--edge)] bg-white/90 p-4 shadow-sm sm:mb-10 sm:p-5"
      >
        <h2 className="font-display text-xl text-[var(--ink)] sm:text-2xl">Insegna</h2>
        <p className="mb-4 text-sm leading-relaxed text-[var(--muted)]">
          Nome e sottotitolo sotto il logo nel menu pubblico.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Nome locale</span>
            <input
              className="mt-1.5 min-h-12 w-full rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2 text-base text-[var(--ink)]"
              value={settings.name}
              onChange={(e) =>
                setSettings((s) => ({ ...s, name: e.target.value }))
              }
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Tagline</span>
            <input
              className="mt-1.5 min-h-12 w-full rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2 text-base text-[var(--ink)]"
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
          className="mt-5 min-h-12 rounded-xl bg-[var(--accent)] px-6 text-base font-semibold text-white disabled:opacity-50 sm:rounded-full"
        >
          Salva insegna
        </button>
      </form>

      <form
        onSubmit={handleSubmitDish}
        className="mb-8 rounded-2xl border border-[var(--edge)] bg-white p-4 shadow-sm sm:mb-10 sm:p-5"
      >
        <h2 className="font-display text-xl text-[var(--ink)] sm:text-2xl">
          {editingId ? "Modifica piatto" : "Nuovo piatto"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="text-[var(--muted)]">Nome</span>
            <input
              required
              className="mt-1.5 min-h-12 w-full rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2 text-base"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="text-[var(--muted)]">Descrizione (facoltativa)</span>
            <textarea
              rows={3}
              className="mt-1.5 w-full resize-y rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2 text-base leading-relaxed"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-3 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.hasPrice}
              onChange={(e) =>
                setForm((f) => ({ ...f, hasPrice: e.target.checked }))
              }
              className="h-5 w-5 shrink-0 accent-[var(--accent)]"
            />
            <span className="text-sm font-medium text-[var(--ink)]">
              Mostra prezzo sul menu
            </span>
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="text-[var(--muted)]">Prezzo (€)</span>
            <input
              inputMode="decimal"
              disabled={!form.hasPrice}
              placeholder={form.hasPrice ? "es. 12,50" : "—"}
              className="mt-1.5 min-h-12 w-full rounded-xl border border-[var(--edge)] bg-white px-3 py-2 text-base disabled:bg-neutral-100 disabled:text-neutral-400"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
            />
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="text-[var(--muted)]">Categoria</span>
            <select
              className="mt-1.5 min-h-12 w-full rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2 text-base"
              value={categorySelectValue}
              onChange={(e) => {
                const v = e.target.value;
                if (v === CATEGORY_OTHER) {
                  setForm((f) => ({
                    ...f,
                    category:
                      f.category && !presetSet.has(f.category)
                        ? f.category
                        : "",
                  }));
                } else {
                  setForm((f) => ({ ...f, category: v }));
                }
              }}
            >
              {MENU_CATEGORY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value={CATEGORY_OTHER}>Altro…</option>
            </select>
            {categorySelectValue === CATEGORY_OTHER ? (
              <input
                className="mt-2 min-h-12 w-full rounded-xl border border-[var(--edge)] bg-white px-3 py-2 text-base"
                placeholder="Nome categoria personalizzata"
                value={presetSet.has(form.category) ? "" : form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              />
            ) : null}
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="text-[var(--muted)]">Ordine nella lista</span>
            <input
              type="number"
              className="mt-1.5 min-h-12 w-full max-w-[12rem] rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-2 text-base"
              value={form.sortOrder}
              onChange={(e) =>
                setForm((f) => ({ ...f, sortOrder: e.target.value }))
              }
            />
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-3 py-3 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm((f) => ({ ...f, active: e.target.checked }))
              }
              className="h-5 w-5 shrink-0 accent-[var(--accent)]"
            />
            <span className="text-sm font-medium text-[var(--ink)]">
              Visibile nel menu
            </span>
          </label>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="submit"
            disabled={busy}
            className="min-h-12 flex-1 rounded-xl bg-[var(--accent)] px-5 text-base font-semibold text-white disabled:opacity-50 sm:flex-none sm:rounded-full"
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
              className="min-h-12 rounded-xl border border-[var(--edge)] px-5 text-base font-medium sm:rounded-full"
            >
              Annulla
            </button>
          ) : null}
        </div>
      </form>

      {message ? (
        <p className="mb-6 rounded-xl border border-[var(--edge)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--ink)]">
          {message}
        </p>
      ) : null}

      <section>
        <h2 className="font-display text-xl text-[var(--ink)] sm:text-2xl">Piatti</h2>
        <ul className="mt-4 space-y-3">
          {dishes.map((d) => (
            <li
              key={d.id}
              className="flex flex-col gap-3 rounded-2xl border border-[var(--edge)] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-semibold text-[var(--ink)]">
                  {d.name}{" "}
                  {!d.active ? (
                    <span className="text-xs font-normal text-amber-800">
                      (nascosto)
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {d.category}
                  {" · "}
                  {d.price !== null
                    ? new Intl.NumberFormat("it-IT", {
                        style: "currency",
                        currency: "EUR",
                      }).format(d.price)
                    : "senza prezzo"}
                  {" · ordine "}
                  {d.sortOrder}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(d)}
                  className="min-h-11 flex-1 rounded-xl border border-[var(--edge)] px-4 text-sm font-semibold active:bg-[var(--cream)] sm:min-h-10 sm:flex-none sm:rounded-full"
                >
                  Modifica
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(d.id)}
                  className="min-h-11 flex-1 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-900 active:bg-red-100 sm:min-h-10 sm:flex-none sm:rounded-full"
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

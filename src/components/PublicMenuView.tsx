"use client";

import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { subscribeDishes } from "@/lib/dishes";
import { subscribeRestaurantSettings } from "@/lib/settings";
import type { Dish, RestaurantSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";

function formatPrice(n: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

export function PublicMenuView() {
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubSettings = subscribeRestaurantSettings(setSettings, (e) =>
      setError(e.message),
    );
    const unsubDishes = subscribeDishes(setDishes, (e) => setError(e.message));
    return () => {
      unsubSettings();
      unsubDishes();
    };
  }, []);

  const grouped = useMemo(() => {
    const visible = dishes.filter((d) => d.active);
    const map = new Map<string, Dish[]>();
    for (const d of visible) {
      const key = d.category.trim() || "Generale";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    }
    return Array.from(map.entries());
  }, [dishes]);

  return (
    <div className="menu-paper relative mx-auto max-w-2xl px-4 py-10 sm:px-8 sm:py-12">
      <div
        className="pointer-events-none absolute inset-3 rounded-[2rem] border border-[var(--edge)] opacity-70"
        aria-hidden
      />
      <header className="relative mb-10 text-center">
        <div className="mb-6 flex justify-center">
          <BrandLogo restaurantName={settings.name} size="lg" />
        </div>
        <p className="font-display text-lg italic text-[var(--muted)]">
          {settings.tagline}
        </p>
        <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
      </header>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {grouped.length === 0 && !error ? (
        <p className="text-center text-[var(--muted)]">
          Il menu è in allestimento. Torna tra poco.
        </p>
      ) : null}

      <div className="relative space-y-10">
        {grouped.map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl text-[var(--ink)]">
              <span className="h-px flex-1 bg-[var(--edge)]" />
              <span className="shrink-0">{category}</span>
              <span className="h-px flex-1 bg-[var(--edge)]" />
            </h2>
            <ul className="space-y-5">
              {items.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-col gap-1 border-b border-dashed border-[var(--edge)] pb-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <div>
                    <p className="font-display text-lg text-[var(--ink)]">
                      {d.name}
                    </p>
                    {d.description ? (
                      <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                        {d.description}
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0 font-display text-xl text-[var(--accent-dark)] sm:text-right">
                    {formatPrice(d.price)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="relative mt-14 text-center text-xs text-[var(--muted)]">
        <p>Chiedi al personale per allergeni e intolleranze.</p>
      </footer>
    </div>
  );
}

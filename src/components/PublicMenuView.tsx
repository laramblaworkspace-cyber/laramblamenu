"use client";

import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { sortCategoryEntries } from "@/lib/categories";
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
      const key = d.category.trim() || "Antipasti";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    }
    return sortCategoryEntries(Array.from(map.entries()));
  }, [dishes]);

  return (
    <div className="menu-paper relative mx-auto w-full max-w-lg px-4 py-8 sm:max-w-2xl sm:px-8 sm:py-10">
      <div
        className="pointer-events-none absolute inset-2 rounded-2xl border border-[var(--menu-line)] sm:inset-3 sm:rounded-[1.75rem]"
        aria-hidden
      />
      <header className="relative mb-8 text-center sm:mb-10">
        <div className="mb-3 flex justify-center sm:mb-4">
          <BrandLogo restaurantName={settings.name} size="lg" variant="emblem" />
        </div>
        <p className="font-body px-2 text-[11px] font-semibold uppercase leading-snug tracking-[0.2em] text-[var(--menu-muted)] sm:text-xs sm:tracking-[0.28em]">
          {settings.tagline}
        </p>
        <div className="mx-auto mt-5 h-px w-36 bg-gradient-to-r from-transparent via-[var(--menu-line)] to-transparent sm:mt-6 sm:w-44" />
      </header>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-900">
          {error}
        </p>
      ) : null}

      {grouped.length === 0 && !error ? (
        <p className="text-center text-base text-[var(--menu-muted)]">
          Il menu è in allestimento. Torna tra poco.
        </p>
      ) : null}

      <div className="relative space-y-8 sm:space-y-10">
        {grouped.map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-normal leading-tight text-[var(--menu-accent)] sm:mb-5 sm:gap-3 sm:text-3xl">
              <span className="h-px min-w-[1rem] flex-1 bg-[var(--menu-line)]" />
              <span className="max-w-[85%] shrink-0 text-center">{category}</span>
              <span className="h-px min-w-[1rem] flex-1 bg-[var(--menu-line)]" />
            </h2>
            <ul className="space-y-4 sm:space-y-5">
              {items.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-col gap-1 border-b border-dashed border-[var(--menu-line)] pb-4 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-5 sm:pb-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-base font-semibold leading-snug text-[var(--menu-ink)] sm:text-lg">
                      {d.name}
                    </p>
                    {d.description ? (
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--menu-muted)] sm:text-[15px]">
                        {d.description}
                      </p>
                    ) : null}
                  </div>
                  {d.price !== null ? (
                    <p className="shrink-0 pt-0.5 text-right font-display text-xl text-[var(--menu-accent-soft)] sm:min-w-[5.5rem] sm:text-2xl">
                      {formatPrice(d.price)}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="relative mt-10 px-1 text-center text-[11px] leading-relaxed text-[var(--menu-muted)] sm:mt-14 sm:text-xs">
        <p>Chiedi al personale per allergeni e intolleranze.</p>
      </footer>
    </div>
  );
}

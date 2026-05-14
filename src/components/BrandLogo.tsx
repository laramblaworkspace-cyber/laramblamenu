"use client";

import { useCallback, useState } from "react";
import { MushroomMark } from "./MushroomMark";

type Props = {
  restaurantName: string;
  size?: "sm" | "md" | "lg";
};

export function BrandLogo({ restaurantName, size = "md" }: Props) {
  const [useFallback, setUseFallback] = useState(false);

  const icon =
    size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";

  const imgClass =
    size === "lg"
      ? "max-h-20 w-auto"
      : size === "sm"
        ? "max-h-12 w-auto"
        : "max-h-16 w-auto";

  const onImgError = useCallback(() => setUseFallback(true), []);

  return (
    <div className="flex items-center gap-3">
      {!useFallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt=""
          className={`${imgClass} object-contain drop-shadow-sm`}
          onError={onImgError}
        />
      ) : (
        <MushroomMark className={`${icon} shrink-0`} />
      )}
      <div className="leading-tight">
        <p className="font-display text-xl tracking-wide text-[var(--ink)] sm:text-2xl">
          {restaurantName}
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          Menu digitale
        </p>
      </div>
    </div>
  );
}

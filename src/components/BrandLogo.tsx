"use client";

import { useCallback, useState } from "react";
import { MushroomMark } from "./MushroomMark";

type Props = {
  restaurantName: string;
  size?: "sm" | "md" | "lg";
  /** Solo marchio (il PNG contiene già il nome del locale). */
  variant?: "full" | "emblem";
};

export function BrandLogo({
  restaurantName,
  size = "md",
  variant = "full",
}: Props) {
  const [useFallback, setUseFallback] = useState(false);

  const icon =
    size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";

  const imgClassEmblem =
    size === "lg"
      ? "max-h-32 w-auto sm:max-h-40"
      : size === "sm"
        ? "max-h-16 w-auto"
        : "max-h-24 w-auto";

  const imgClassFull =
    size === "lg"
      ? "max-h-20 w-auto"
      : size === "sm"
        ? "max-h-12 w-auto"
        : "max-h-16 w-auto";

  const onImgError = useCallback(() => setUseFallback(true), []);

  if (variant === "emblem") {
    return (
      <div className="flex flex-col items-center gap-2">
        {!useFallback ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/logo.png"
            alt={restaurantName}
            className={`${imgClassEmblem} object-contain`}
            onError={onImgError}
          />
        ) : (
          <>
            <MushroomMark className={`${icon} shrink-0 text-[var(--gold)]`} />
            <p className="font-display text-2xl text-[var(--gold)] sm:text-3xl">
              {restaurantName}
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {!useFallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt=""
          className={`${imgClassFull} object-contain drop-shadow-sm`}
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
          Pannello
        </p>
      </div>
    </div>
  );
}

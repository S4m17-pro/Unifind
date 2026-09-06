"use client";

import { useEffect, useId, useState } from "react";
import ClaimForm, { type ClaimFormDefaults } from "@/components/public/ClaimForm";
import type { PublicCatalogItem } from "@/lib/public-catalog";

interface Props {
  item: Pick<PublicCatalogItem, "id" | "category" | "foundLocation" | "custodyStation">;
  defaults?: ClaimFormDefaults;
  autoOpen?: boolean;
  triggerLabel?: string;
}

export default function ClaimFormModal({
  item,
  defaults,
  autoOpen = false,
  triggerLabel = "Reclamar objeto",
}: Props) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full rounded-md bg-brand px-4 py-2.5 font-semibold text-white transition-colors hover:bg-brand-hover"
      >
        {triggerLabel}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-lg rounded-lg border border-line bg-paper p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-lg text-ink-subtle hover:text-ink"
              aria-label="Cerrar formulario"
            >
              ✕
            </button>

            <h3 id={titleId} className="mb-1 font-serif text-xl font-semibold text-ink">
              Formulario de reclamo
            </h3>
            <p className="mb-4 text-sm text-ink-muted">
              Pertenencia:{" "}
              <span className="font-semibold text-brand">{item.category}</span> hallada en{" "}
              {item.foundLocation}. Custodia: {item.custodyStation}.
            </p>

            <ClaimForm item={item} defaults={defaults} />

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full rounded-md border border-line bg-bar px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

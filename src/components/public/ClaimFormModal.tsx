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
        className="w-full rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500"
      >
        {triggerLabel}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-lg text-slate-400 hover:text-white"
              aria-label="Cerrar formulario"
            >
              ✕
            </button>

            <h3 id={titleId} className="mb-1 text-xl font-bold text-slate-100">
              Formulario de reclamo
            </h3>
            <p className="mb-4 text-sm text-slate-400">
              Pertenencia:{" "}
              <span className="font-semibold text-blue-400">{item.category}</span> hallada en{" "}
              {item.foundLocation}. Custodia: {item.custodyStation}.
            </p>

            <ClaimForm item={item} defaults={defaults} />

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

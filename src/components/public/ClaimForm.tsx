"use client";

import { useState } from "react";
import { submitClaimAction } from "@/actions/claim.actions";
import { isActionFailure } from "@/lib/action-result";
import type { PublicItem } from "@/lib/public-catalog";

export type ClaimFormDefaults = {
  email?: string;
  name?: string;
};

type ClaimFormProps = {
  item: Pick<PublicItem, "id" | "category" | "foundLocation" | "custodyStation">;
  defaults?: ClaimFormDefaults;
  onSuccess?: () => void;
  submitLabel?: string;
};

/**
 * Formulario de reclamo cableado a `submitClaimAction` (Back).
 * Campos: itemId, studentName, studentEmail, description.
 * Prefill: `defaults` desde query (?email, ?nombre) o sesión Auth.js.
 */
export default function ClaimForm({
  item,
  defaults,
  onSuccess,
  submitLabel = "Enviar reclamo",
}: ClaimFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.append("itemId", item.id);

    const result = await submitClaimAction(formData);
    setLoading(false);

    if (isActionFailure(result)) {
      setMessage({ type: "error", text: result.error });
      return;
    }

    setMessage({
      type: "success",
      text: "Reclamo enviado. Portería recibió el aviso por correo. Acércate con tu carnet para la entrega.",
    });
    onSuccess?.();
  };

  return (
    <div>
      {message && (
        <div
          role="status"
          className={`mb-4 rounded-md p-4 text-sm ${
            message.type === "success"
              ? "border border-success/20 bg-success-soft text-success"
              : "border border-danger/20 bg-danger-soft text-danger"
          }`}
        >
          {message.text}
        </div>
      )}

      {message?.type !== "success" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="studentName" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Nombre completo
            </label>
            <input
              id="studentName"
              type="text"
              name="studentName"
              required
              defaultValue={defaults?.name ?? ""}
              autoComplete="name"
              placeholder="Ej. Juan Pérez"
              className="w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="studentEmail" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Correo institucional
            </label>
            <input
              id="studentEmail"
              type="email"
              name="studentEmail"
              required
              defaultValue={defaults?.email ?? ""}
              autoComplete="email"
              placeholder="estudiante@unilibre.edu.co"
              className="w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              ¿Cómo lo reconoces?
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Marca, color, stickers, rasguños u otro detalle que solo tú conozcas."
              className="w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-ink-subtle">
              No publiques datos sensibles. Portería usa esto para verificar que te pertenece.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
          >
            {loading ? "Enviando..." : submitLabel}
          </button>
        </form>
      )}
    </div>
  );
}

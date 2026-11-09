"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { submitClaimAction } from "@/actions/claim.actions";
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

    if (result.error) {
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
          className={`mb-4 rounded-xl p-4 text-sm ${
            message.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {message?.type !== "success" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="studentName" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="studentEmail" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              ¿Cómo lo reconoces?
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Marca, color, stickers, rasguños u otro detalle que solo tú conozcas."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              No publiques datos sensibles. Portería usa esto para verificar que te pertenece.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Enviando...
              </span>
            ) : (
              submitLabel
            )}
          </button>
        </form>
      )}
    </div>
  );
}

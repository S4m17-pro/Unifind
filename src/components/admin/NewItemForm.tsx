"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { createItemAction } from "@/actions/item.actions";
import { ITEM_CATEGORIES } from "@/lib/constants";
import PrivatePhotoField, { validateSelectedPhoto } from "./PrivatePhotoField";

export default function NewItemForm({
  photoNotice,
  cloudinaryReady = false,
}: {
  photoNotice?: string;
  cloudinaryReady?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [createdItem, setCreatedItem] = useState<{
    id: string;
    qrCode: string;
    category: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setWarning(null);

    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("image");
    if (imageFile instanceof File && imageFile.size > 0) {
      const photoError = validateSelectedPhoto(imageFile);
      if (photoError) {
        setLoading(false);
        setError(photoError);
        return;
      }
    }

    const res = await createItemAction(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.item) {
      setCreatedItem({
        id: res.item.id,
        qrCode: res.item.qrCode,
        category: res.item.category,
      });
      setWarning(res.warning ?? null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_26px_60px_-40px_rgba(15,23,42,0.45)] sm:p-8">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900">
        Registrar objeto encontrado
      </h2>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {createdItem ? (
        <div className="space-y-6 py-8 text-center">
          <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 className="animate-icon-pop h-5 w-5" aria-hidden />
            ¡Objeto registrado con éxito en bodega!
          </div>
          {warning ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {warning}
            </div>
          ) : null}

          <div className="inline-block rounded-2xl bg-white p-4 shadow-xl">
            <QRCodeSVG value={createdItem.qrCode} size={200} />
          </div>

          <p className="font-mono text-sm text-slate-700">
            Código QR: <strong className="text-teal-700">{createdItem.qrCode}</strong>
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/admin/objetos/${createdItem.id}`}
              className="rounded-xl bg-slate-100 px-6 py-2.5 font-medium text-slate-900 transition-colors hover:bg-slate-200"
            >
              Ver ficha privada
            </Link>
            <button
              type="button"
              onClick={() => {
                setCreatedItem(null);
                setWarning(null);
              }}
              className="rounded-xl bg-teal-700 px-6 py-2.5 font-medium text-white transition-colors hover:bg-teal-600"
            >
              Registrar otro objeto
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Categoría genérica
              </label>
              <select
                name="category"
                required
                defaultValue=""
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-teal-600 focus:outline-none"
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {ITEM_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Fecha y hora del hallazgo
              </label>
              <input
                type="datetime-local"
                name="foundDate"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Bloque / salón
              </label>
              <input
                type="text"
                name="foundLocation"
                required
                placeholder="Ej. Bloque B - Salón 302"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Portería / bodega de custodia
              </label>
              <input
                type="text"
                name="custodyStation"
                required
                placeholder="Ej. Portería Principal"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Ubicación en bodega
            </label>
            <input
              type="text"
              name="shelfLocation"
              required
              placeholder="Ej. Estante 2 - Casillero B"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-teal-600 focus:outline-none"
            />
          </div>

          <PrivatePhotoField
            photoNotice={photoNotice}
            cloudinaryReady={cloudinaryReady}
            onError={setError}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 py-3 font-medium text-white shadow-lg shadow-teal-700/25 transition-colors hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Guardando y generando QR...
              </span>
            ) : (
              "Guardar objeto y generar su QR"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

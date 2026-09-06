"use client";

import { useState } from "react";
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
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-100">
        Registro privado de objeto perdido
      </h2>

      {error && (
        <div className="mb-6 rounded-xl border border-red-800 bg-red-950/80 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {createdItem ? (
        <div className="space-y-6 py-8 text-center">
          <div className="rounded-xl border border-emerald-800 bg-emerald-950/60 p-4 text-emerald-300">
            ¡Objeto registrado con éxito en bodega!
          </div>
          {warning ? (
            <div className="rounded-xl border border-amber-800 bg-amber-950/60 p-4 text-sm text-amber-300">
              {warning}
            </div>
          ) : null}

          <div className="inline-block rounded-2xl bg-white p-4 shadow-xl">
            <QRCodeSVG value={createdItem.qrCode} size={200} />
          </div>

          <p className="font-mono text-sm text-slate-300">
            Código QR: <strong className="text-blue-400">{createdItem.qrCode}</strong>
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/admin/objetos/${createdItem.id}`}
              className="rounded-xl bg-slate-800 px-6 py-2.5 font-medium text-slate-100 transition-colors hover:bg-slate-700"
            >
              Ver ficha privada
            </Link>
            <button
              type="button"
              onClick={() => {
                setCreatedItem(null);
                setWarning(null);
              }}
              className="rounded-xl bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-500"
            >
              Registrar otro objeto
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Categoría genérica
              </label>
              <select
                name="category"
                required
                defaultValue=""
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
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
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Fecha y hora del hallazgo
              </label>
              <input
                type="datetime-local"
                name="foundDate"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Bloque / salón
              </label>
              <input
                type="text"
                name="foundLocation"
                required
                placeholder="Ej. Bloque B - Salón 302"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Portería / bodega de custodia
              </label>
              <input
                type="text"
                name="custodyStation"
                required
                placeholder="Ej. Portería Principal"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ubicación física en bodega (privada)
            </label>
            <input
              type="text"
              name="shelfLocation"
              required
              placeholder="Ej. Estante 2 - Casillero B"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
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
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-medium text-white shadow-lg shadow-blue-600/25 transition-colors hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
          >
            {loading ? "Procesando y generando QR..." : "Guardar en bodega y generar QR"}
          </button>
        </form>
      )}
    </div>
  );
}

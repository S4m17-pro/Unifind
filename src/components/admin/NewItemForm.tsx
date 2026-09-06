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
    <div className="mx-auto max-w-2xl rounded-lg border border-line bg-paper p-6 shadow-sm sm:p-8">
      <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-semibold text-ink">
        Registro privado de objeto perdido
      </h2>

      {error && (
        <div className="mb-6 rounded-md border border-danger/20 bg-danger-soft p-4 text-sm text-danger">
          {error}
        </div>
      )}

      {createdItem ? (
        <div className="space-y-6 py-8 text-center">
          <div className="rounded-md border border-success/20 bg-success-soft p-4 text-success">
            ¡Objeto registrado con éxito en bodega!
          </div>
          {warning ? (
            <div className="rounded-md border border-gold/40 bg-gold-soft p-4 text-sm text-gold-ink">
              {warning}
            </div>
          ) : null}

          <div className="inline-block rounded-lg bg-white p-4 shadow-sm">
            <QRCodeSVG value={createdItem.qrCode} size={200} />
          </div>

          <p className="font-mono text-sm text-ink-muted">
            Código QR: <strong className="text-brand">{createdItem.qrCode}</strong>
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/admin/objetos/${createdItem.id}`}
              className="rounded-md border border-line px-6 py-2.5 font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              Ver ficha privada
            </Link>
            <button
              type="button"
              onClick={() => {
                setCreatedItem(null);
                setWarning(null);
              }}
              className="rounded-md bg-brand px-6 py-2.5 font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Registrar otro objeto
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Categoría genérica
              </label>
              <select
                name="category"
                required
                defaultValue=""
                className="w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
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
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Fecha y hora del hallazgo
              </label>
              <input
                type="datetime-local"
                name="foundDate"
                required
                className="w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Bloque / salón
              </label>
              <input
                type="text"
                name="foundLocation"
                required
                placeholder="Ej. Bloque B - Salón 302"
                className="w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Portería / bodega de custodia
              </label>
              <input
                type="text"
                name="custodyStation"
                required
                placeholder="Ej. Portería Principal"
                className="w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Ubicación física en bodega (privada)
            </label>
            <input
              type="text"
              name="shelfLocation"
              required
              placeholder="Ej. Estante 2 - Casillero B"
              className="w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
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
            className="mt-4 w-full rounded-md bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
          >
            {loading ? "Procesando y generando QR..." : "Guardar en bodega y generar QR"}
          </button>
        </form>
      )}
    </div>
  );
}

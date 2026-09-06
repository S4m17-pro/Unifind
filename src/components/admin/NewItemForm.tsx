"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { createItemAction } from "@/actions/item.actions";
import { ITEM_CATEGORIES } from "@/lib/constants";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

function validateSelectedPhoto(file: File): string | null {
  if (file.size <= 0) return "La foto adjunta está vacía.";
  if (file.size > MAX_PHOTO_BYTES) return "La foto supera el límite de 5 MB.";
  const mime = file.type.trim().toLowerCase();
  if (mime && !ALLOWED_PHOTO_TYPES.has(mime)) {
    return "Formato de foto no permitido. Usa JPG, PNG, WEBP o GIF.";
  }
  return null;
}

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
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const clearPhotoPreview = () => {
    setPhotoPreview(null);
    setPhotoName(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      clearPhotoPreview();
      return;
    }

    const photoError = validateSelectedPhoto(file);
    if (photoError) {
      e.target.value = "";
      clearPhotoPreview();
      setError(photoError);
      return;
    }

    setPhotoPreview(URL.createObjectURL(file));
    setPhotoName(file.name);
  };

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
      clearPhotoPreview();
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
              className="rounded-xl bg-slate-800 px-6 py-2.5 font-medium text-slate-100 transition-all hover:bg-slate-700"
            >
              Ver ficha privada
            </Link>
            <button
              type="button"
              onClick={() => {
                setCreatedItem(null);
                setWarning(null);
              }}
              className="rounded-xl bg-blue-600 px-6 py-2.5 font-medium text-white transition-all hover:bg-blue-500"
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

          <div>
            <label
              htmlFor="item-image"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Foto privada (Cloudinary autenticado)
            </label>
            <input
              id="item-image"
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
              onChange={handlePhotoChange}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-950 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-blue-400 hover:file:bg-blue-900 focus:border-blue-500 focus:outline-none"
            />
            {photoPreview ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                <img
                  src={photoPreview}
                  alt={photoName ? `Vista previa de ${photoName}` : "Vista previa de la foto privada"}
                  className="max-h-48 w-full object-contain"
                />
              </div>
            ) : null}
            <p className={`mt-2 text-xs ${cloudinaryReady ? "text-slate-500" : "text-amber-400"}`}>
              {photoNotice ??
                (cloudinaryReady
                  ? "Opcional. Campo image, máx. 5 MB (JPG, PNG, WEBP o GIF). Se sube authenticated y solo se firma en la ficha privada."
                  : "Opcional. Sin Cloudinary la foto se omite y el objeto igual se registra.")}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-medium text-white shadow-lg shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
          >
            {loading ? "Procesando y generando QR..." : "Guardar en bodega y generar QR"}
          </button>
        </form>
      )}
    </div>
  );
}

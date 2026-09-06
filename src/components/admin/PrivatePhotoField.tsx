"use client";

import { useEffect, useRef, useState } from "react";

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

export function validateSelectedPhoto(file: File): string | null {
  if (file.size <= 0) return "La foto adjunta está vacía.";
  if (file.size > MAX_PHOTO_BYTES) return "La foto supera el límite de 5 MB.";
  const mime = file.type.trim().toLowerCase();
  if (mime && !ALLOWED_PHOTO_TYPES.has(mime)) {
    return "Formato de foto no permitido. Usa JPG, PNG, WEBP o GIF.";
  }
  return null;
}

export default function PrivatePhotoField({
  photoNotice,
  cloudinaryReady,
  onError,
}: {
  photoNotice?: string;
  cloudinaryReady: boolean;
  onError: (message: string | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  const replacePreview = (nextUrl: string | null, nextName: string | null) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = nextUrl;
    setPreview(nextUrl);
    setPhotoName(nextName);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onError(null);

    if (!file) {
      replacePreview(null, null);
      return;
    }

    const photoError = validateSelectedPhoto(file);
    if (photoError) {
      e.target.value = "";
      replacePreview(null, null);
      onError(photoError);
      return;
    }

    replacePreview(URL.createObjectURL(file), file.name);
  };

  return (
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
      {preview ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <img
            src={preview}
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
  );
}

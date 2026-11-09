"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-2">
      <Label
        htmlFor="item-image"
        className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted"
      >
        Foto del objeto (opcional)
      </Label>
      <Input
        id="item-image"
        type="file"
        name="image"
        accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
        onChange={handlePhotoChange}
        className="h-auto py-2 text-ink-muted file:mr-3 file:rounded-md file:bg-brand-soft file:px-3 file:py-1 file:text-xs file:font-semibold file:text-brand hover:file:bg-gold-soft"
      />
      {preview ? (
        <div className="overflow-hidden rounded-md border border-line bg-canvas">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={photoName ? `Vista previa de ${photoName}` : "Vista previa de la foto privada"}
            className="max-h-48 w-full object-contain"
          />
        </div>
      ) : null}
      <p className={`text-xs ${cloudinaryReady ? "text-ink-subtle" : "text-gold-ink"}`}>
        {photoNotice ??
          (cloudinaryReady
            ? "Opcional · máximo 5 MB (JPG, PNG, WEBP o GIF). Solo la verá el personal."
            : "Opcional. Si no se puede subir la foto, el objeto se registra igual.")}
      </p>
    </div>
  );
}

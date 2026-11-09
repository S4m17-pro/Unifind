"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { createItemAction } from "@/actions/item.actions";
import { isActionFailure } from "@/lib/action-result";
import { ITEM_CATEGORIES } from "@/lib/constants";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import PrivatePhotoField, { validateSelectedPhoto } from "./PrivatePhotoField";

const fieldLabel = "text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted";

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

    if (isActionFailure(res)) {
      setError(res.error);
    } else {
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
      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {createdItem ? (
        <div className="space-y-6 py-8 text-center">
          <Alert variant="success">
            <AlertDescription>¡Objeto registrado con éxito en bodega!</AlertDescription>
          </Alert>
          {warning ? (
            <Alert variant="gold">
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          ) : null}

          <div className="inline-block rounded-lg bg-white p-4 shadow-sm">
            <QRCodeSVG value={createdItem.qrCode} size={200} />
          </div>

          <p className="font-mono text-sm text-ink-muted">
            Código QR: <strong className="text-brand">{createdItem.qrCode}</strong>
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="outline" className="px-6">
              <Link href={`/admin/objetos/${createdItem.id}`}>Ver ficha privada</Link>
            </Button>
            <Button
              type="button"
              className="px-6"
              onClick={() => {
                setCreatedItem(null);
                setWarning(null);
              }}
            >
              Registrar otro objeto
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category" className={fieldLabel}>
                Categoría genérica
              </Label>
              <Select id="category" name="category" required defaultValue="">
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {ITEM_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundDate" className={fieldLabel}>
                Fecha y hora del hallazgo
              </Label>
              <Input id="foundDate" type="datetime-local" name="foundDate" required />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="foundLocation" className={fieldLabel}>
                Bloque / salón
              </Label>
              <Input
                id="foundLocation"
                type="text"
                name="foundLocation"
                required
                placeholder="Ej. Bloque B - Salón 302"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custodyStation" className={fieldLabel}>
                Portería / bodega de custodia
              </Label>
              <Input
                id="custodyStation"
                type="text"
                name="custodyStation"
                required
                placeholder="Ej. Portería Principal"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shelfLocation" className={fieldLabel}>
              Ubicación física en bodega (privada)
            </Label>
            <Input
              id="shelfLocation"
              type="text"
              name="shelfLocation"
              required
              placeholder="Ej. Estante 2 - Casillero B"
            />
          </div>

          <PrivatePhotoField
            photoNotice={photoNotice}
            cloudinaryReady={cloudinaryReady}
            onError={setError}
          />

          <Button type="submit" disabled={loading} className="mt-4 h-11 w-full font-semibold">
            {loading ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Guardando y generando QR...
              </>
            ) : (
              "Guardar objeto y generar su QR"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

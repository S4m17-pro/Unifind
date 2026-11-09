"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { submitClaimAction } from "@/actions/claim.actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
      {message ? (
        <Alert
          variant={message.type === "success" ? "success" : "destructive"}
          className="mb-4"
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      ) : null}

      {message?.type !== "success" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="studentName"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted"
            >
              Nombre completo
            </Label>
            <Input
              id="studentName"
              type="text"
              name="studentName"
              required
              defaultValue={defaults?.name ?? ""}
              autoComplete="name"
              placeholder="Ej. Juan Pérez"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="studentEmail"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted"
            >
              Correo institucional
            </Label>
            <Input
              id="studentEmail"
              type="email"
              name="studentEmail"
              required
              defaultValue={defaults?.email ?? ""}
              autoComplete="email"
              placeholder="estudiante@unilibre.edu.co"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted"
            >
              ¿Cómo lo reconoces?
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Marca, color, stickers, rasguños u otro detalle que solo tú conozcas."
            />
            <p className="text-xs text-ink-subtle">
              No publiques datos sensibles. Portería usa esto para verificar que te pertenece.
            </p>
          </div>

          <Button type="submit" disabled={loading} className="h-11 w-full font-semibold">
            {loading ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Enviando...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

"use client";

import { useActionState, useId } from "react";
import { LoaderCircle } from "lucide-react";
import { microsoftSignInAction } from "@/actions/auth.actions";
import { setAuthFlash } from "@/components/auth/auth-flash";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function MicrosoftMark() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none">
      <rect x="1" y="1" width="6.4" height="6.4" fill="#F25022" />
      <rect x="8.6" y="1" width="6.4" height="6.4" fill="#7FBA00" />
      <rect x="1" y="8.6" width="6.4" height="6.4" fill="#00A4EF" />
      <rect x="8.6" y="8.6" width="6.4" height="6.4" fill="#FFB900" />
    </svg>
  );
}

/**
 * Hook para Front: server action `microsoftSignInAction`,
 * provider id `microsoft-entra-id`, campo `callbackUrl`.
 * Solo montar cuando `isMicrosoftEntraConfigured()` sea true (server).
 */
export default function MicrosoftSignInButton({
  callbackUrl,
  disabled = false,
}: {
  callbackUrl: string;
  disabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState(microsoftSignInAction, undefined);
  const pendingId = useId();
  const hintId = useId();
  const errorId = useId();
  const busy = disabled || pending;

  const describedBy = [
    hintId,
    pending ? pendingId : null,
    state?.error ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <form
      action={formAction}
      onSubmit={() => setAuthFlash("ingreso")}
      aria-busy={pending}
      className="space-y-2"
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <p id={pendingId} className="sr-only" aria-live="polite">
        {pending ? "Conectando con tu cuenta Microsoft de UniLibre…" : ""}
      </p>
      <Button
        type="submit"
        variant="outline"
        disabled={busy}
        aria-busy={pending}
        aria-label="Entrar con Microsoft, cuenta estudiantil UniLibre"
        aria-describedby={describedBy}
        className={cn(
          "h-auto min-h-12 w-full justify-start gap-3 whitespace-normal border-2 border-gold/55 bg-gold-soft px-3 py-2.5 text-left shadow-none",
          "hover:border-brand hover:bg-brand-soft hover:text-ink",
          "focus-visible:border-brand focus-visible:ring-brand/35",
          "disabled:opacity-60",
        )}
      >
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-paper"
        >
          {pending ? (
            <LoaderCircle className="size-4 animate-spin text-brand" />
          ) : (
            <MicrosoftMark />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-ink">
            {pending ? "Conectando con Microsoft…" : "Entrar con Microsoft"}
          </span>
          <span className="mt-0.5 block text-xs font-medium text-gold-ink">
            Cuenta estudiantil UniLibre
          </span>
        </span>
      </Button>
      <p id={hintId} className="text-xs text-ink-subtle">
        Usa el correo institucional de Universidad Libre (Microsoft 365 Educación).
      </p>
      {state?.error ? (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

"use client";

import { useActionState, useId } from "react";
import { LoaderCircle } from "lucide-react";
import { microsoftSignInAction } from "@/actions/auth.actions";
import { setAuthFlash } from "@/components/auth/auth-flash";
import { Button } from "@/components/ui/button";

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
  const errorId = useId();

  return (
    <form
      action={formAction}
      onSubmit={() => setAuthFlash("ingreso")}
      className="space-y-3"
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <p id={pendingId} className="sr-only" aria-live="polite">
        {pending ? "Redirigiendo a Microsoft…" : ""}
      </p>
      <Button
        type="submit"
        variant="outline"
        disabled={disabled || pending}
        aria-describedby={pending ? pendingId : state?.error ? errorId : undefined}
        className="h-11 w-full text-sm font-semibold"
      >
        {pending ? (
          <>
            <LoaderCircle className="animate-spin" aria-hidden />
            Redirigiendo a Microsoft…
          </>
        ) : (
          <>
            <MicrosoftMark />
            Continuar con Microsoft
          </>
        )}
      </Button>
      {state?.error ? (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

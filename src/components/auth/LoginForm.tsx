"use client";

import {
  startTransition,
  useActionState,
  useId,
  useState,
  type ComponentProps,
  type FormEvent,
} from "react";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { loginAction } from "@/actions/auth.actions";
import { setAuthFlash } from "@/components/auth/auth-flash";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidEmail } from "@/lib/validation";

type FieldErrors = {
  email?: string;
  password?: string;
};

function validateLogin(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};

  if (!email.trim()) {
    errors.email = "Escribe tu correo institucional. Sin eso no abrimos el panel.";
  } else if (!isValidEmail(email)) {
    errors.email = "Ese correo no se ve válido. Usa el institucional de Unilibre.";
  }

  if (!password) {
    errors.password = "Escribe tu contraseña de turno.";
  }

  return errors;
}

function friendlyAuthError(error: string) {
  if (/incorrectos|credentials/i.test(error)) {
    return "Ese correo o la contraseña no coinciden. Esta puerta es solo para vigilancia y Bienestar, no para estudiantes.";
  }
  if (/falta el correo/i.test(error)) {
    return "Falta el correo o la contraseña. Completa ambos para abrir el panel.";
  }
  return error;
}

function LoginField({
  id,
  label,
  error,
  hint,
  errorId,
  hintId,
  ...inputProps
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  errorId: string;
  hintId?: string;
} & ComponentProps<typeof Input>) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted"
      >
        {label}
      </Label>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hintId}
        className="h-11 bg-paper text-ink"
        {...inputProps}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-ink-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default function LoginForm({
  callbackUrl,
  initialError,
}: {
  callbackUrl: string;
  initialError?: string;
}) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailId = useId();
  const passwordId = useId();
  const emailErrorId = useId();
  const emailHintId = useId();
  const passwordErrorId = useId();
  const passwordHintId = useId();
  const formErrorId = useId();
  const pendingId = useId();

  const serverError = state?.error ? friendlyAuthError(state.error) : initialError;
  const canSubmit = !pending;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = validateLogin(
      String(data.get("email") ?? ""),
      String(data.get("password") ?? ""),
    );
    setFieldErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      const fieldName = nextErrors.email ? "email" : "password";
      const firstInvalid = form.elements.namedItem(fieldName);
      if (firstInvalid instanceof HTMLInputElement) firstInvalid.focus();
      return;
    }

    setAuthFlash("ingreso");
    startTransition(() => {
      formAction(data);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={pending}
      className="space-y-5"
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {serverError && !fieldErrors.email && !fieldErrors.password ? (
        <Alert id={formErrorId} variant="destructive">
          <CircleAlert />
          <AlertTitle>No pudimos abrir el panel</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}

      <LoginField
        id={emailId}
        label="Correo institucional"
        type="email"
        name="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="vigilancia@unilibre.edu.co"
        value={email}
        disabled={pending}
        error={fieldErrors.email}
        errorId={emailErrorId}
        hintId={emailHintId}
        hint="El de Unilibre que usa portería o Bienestar, no el personal de un estudiante."
        onChange={(event) => {
          setEmail(event.target.value);
          if (fieldErrors.email) setFieldErrors((current) => ({ ...current, email: undefined }));
        }}
      />

      <LoginField
        id={passwordId}
        label="Contraseña"
        type="password"
        name="password"
        required
        autoComplete="current-password"
        value={password}
        disabled={pending}
        error={fieldErrors.password}
        errorId={passwordErrorId}
        hintId={passwordHintId}
        hint="La misma clave de tu turno en portería o Bienestar."
        onChange={(event) => {
          setPassword(event.target.value);
          if (fieldErrors.password) {
            setFieldErrors((current) => ({ ...current, password: undefined }));
          }
        }}
      />

      <p id={pendingId} className="sr-only" aria-live="polite">
        {pending ? "Comprobando tu acceso…" : ""}
      </p>
      <Button
        type="submit"
        disabled={!canSubmit}
        aria-describedby={pending ? pendingId : undefined}
        className="h-11 w-full text-sm font-semibold"
      >
        {pending ? (
          <>
            <LoaderCircle className="animate-spin" aria-hidden />
            Comprobando tu acceso…
          </>
        ) : (
          "Entrar al panel"
        )}
      </Button>
    </form>
  );
}

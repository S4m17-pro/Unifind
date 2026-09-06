"use client";

import { useActionState, useId, useState, type FormEvent } from "react";
import { loginAction } from "@/actions/auth.actions";
import { setAuthFlash } from "@/components/auth/auth-flash";
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
  const formErrorId = useId();
  const pendingId = useId();

  const serverError = state?.error
    ? friendlyAuthError(state.error)
    : initialError;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const nextErrors = validateLogin(email, password);
    setFieldErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      event.preventDefault();
      const fieldName = nextErrors.email ? "email" : "password";
      const firstInvalid = form.elements.namedItem(fieldName);
      if (firstInvalid instanceof HTMLInputElement) {
        firstInvalid.focus();
      }
      return;
    }

    setAuthFlash("ingreso");
  };

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={pending}
      className="space-y-4"
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {serverError && !fieldErrors.email && !fieldErrors.password ? (
        <div
          id={formErrorId}
          role="alert"
          className="rounded-md border border-danger/20 bg-danger-soft p-4 text-sm text-danger"
        >
          {serverError}
        </div>
      ) : null}

      <div>
        <label
          htmlFor={emailId}
          className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted"
        >
          Correo institucional
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="vigilancia@unilibre.edu.co"
          value={email}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? emailErrorId : emailHintId}
          disabled={pending}
          onChange={(event) => {
            setEmail(event.target.value);
            if (fieldErrors.email) setFieldErrors((current) => ({ ...current, email: undefined }));
          }}
          className="w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none disabled:opacity-60"
        />
        {fieldErrors.email ? (
          <p id={emailErrorId} role="alert" className="mt-1.5 text-xs text-danger">
            {fieldErrors.email}
          </p>
        ) : (
          <p id={emailHintId} className="mt-1.5 text-xs text-ink-subtle">
            El de Unilibre que usa portería o Bienestar, no el personal de un estudiante.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={passwordId}
          className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted"
        >
          Contraseña
        </label>
        <input
          id={passwordId}
          type="password"
          name="password"
          required
          autoComplete="current-password"
          value={password}
          aria-invalid={fieldErrors.password ? true : undefined}
          aria-describedby={fieldErrors.password ? passwordErrorId : undefined}
          disabled={pending}
          onChange={(event) => {
            setPassword(event.target.value);
            if (fieldErrors.password) {
              setFieldErrors((current) => ({ ...current, password: undefined }));
            }
          }}
          className="w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none disabled:opacity-60"
        />
        {fieldErrors.password ? (
          <p id={passwordErrorId} role="alert" className="mt-1.5 text-xs text-danger">
            {fieldErrors.password}
          </p>
        ) : null}
      </div>

      <p id={pendingId} className="sr-only" aria-live="polite">
        {pending ? "Comprobando tu acceso..." : ""}
      </p>
      <button
        type="submit"
        disabled={pending}
        aria-describedby={pending ? pendingId : undefined}
        className="w-full rounded-md bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
      >
        {pending ? "Comprobando tu acceso..." : "Entrar al panel"}
      </button>
    </form>
  );
}

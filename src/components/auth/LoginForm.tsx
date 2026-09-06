"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth.actions";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {state?.error ? (
        <div className="rounded-md border border-danger/20 bg-danger-soft p-4 text-sm text-danger">
          {state.error}
        </div>
      ) : null}

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
          Correo institucional
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="vigilancia@unilibre.edu.co"
          className="w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
      >
        {pending ? "Verificando..." : "Entrar al panel"}
      </button>
    </form>
  );
}

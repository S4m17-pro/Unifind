"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth.actions";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {state?.error ? (
        <div className="rounded-xl border border-red-800 bg-red-950/80 p-4 text-sm text-red-300">
          {state.error}
        </div>
      ) : null}

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Correo institucional
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="vigilancia@unilibre.edu.co"
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:opacity-50"
      >
        {pending ? "Verificando..." : "Entrar al panel"}
      </button>
    </form>
  );
}

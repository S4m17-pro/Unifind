"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AUTH_FLASH, type AuthFlashKey } from "@/components/auth/auth-flash";
import { cn } from "@/lib/cn";

type AuthFlashProps = {
  storageKey: AuthFlashKey;
  children: ReactNode;
  className?: string;
  dismissLabel?: string;
};

export default function AuthFlash({
  storageKey,
  children,
  className,
  dismissLabel = "Entendido",
}: AuthFlashProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === "1") {
        sessionStorage.removeItem(storageKey);
        setVisible(true);
      }
    } catch {
      setVisible(false);
    }
  }, [storageKey]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className={cn(
        "flex flex-col gap-3 rounded-md border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p>{children}</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="shrink-0 self-start text-xs font-semibold uppercase tracking-[0.14em] underline-offset-2 hover:underline sm:self-auto"
      >
        {dismissLabel}
      </button>
    </div>
  );
}

export function IngresoFlash({ name, roleLabel }: { name: string; roleLabel: string }) {
  const firstName = name.split(/\s+/)[0] || name;

  return (
    <AuthFlash
      storageKey={AUTH_FLASH.ingreso}
      className="border-success/25 bg-success-soft text-success"
    >
      Entraste bien, {firstName}. Esta es tu sesión de {roleLabel} en UniFind ·
      Barranquilla. Queda abierta en este navegador hasta que la cierres.
    </AuthFlash>
  );
}

export function SesionCerradaFlash() {
  return (
    <AuthFlash
      storageKey={AUTH_FLASH.sesionCerrada}
      className="mx-4 my-4 max-w-7xl border-gold/40 bg-gold-soft text-gold-ink sm:mx-6 lg:mx-auto lg:w-full"
    >
      Cerraste la sesión del panel. El catálogo sigue abierto: no necesitas
      cuenta para buscar un objeto en custodia.
    </AuthFlash>
  );
}

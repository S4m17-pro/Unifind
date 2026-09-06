"use client";

import { useCallback, useState, useSyncExternalStore, type ReactNode } from "react";
import { CircleCheck, LogOut } from "lucide-react";
import { AUTH_FLASH, type AuthFlashKey } from "@/components/auth/auth-flash";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function subscribeNoop() {
  return () => {};
}

function readFlash(storageKey: AuthFlashKey) {
  try {
    return sessionStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

type AuthFlashProps = {
  storageKey: AuthFlashKey;
  children: ReactNode;
  className?: string;
  dismissLabel?: string;
  variant?: "success" | "gold";
  icon?: ReactNode;
};

export default function AuthFlash({
  storageKey,
  children,
  className,
  dismissLabel = "Entendido",
  variant = "gold",
  icon,
}: AuthFlashProps) {
  const stored = useSyncExternalStore(
    subscribeNoop,
    () => readFlash(storageKey),
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);
  const dismiss = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // Ignore blocked storage.
    }
    setDismissed(true);
  }, [storageKey]);

  if (!stored || dismissed) return null;

  return (
    <Alert variant={variant} className={cn(className)}>
      {icon}
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>{children}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={dismiss}
          className="h-auto self-start px-0 text-xs font-semibold uppercase tracking-[0.14em] underline-offset-2 hover:bg-transparent hover:underline sm:self-auto"
        >
          {dismissLabel}
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export function IngresoFlash({ name, roleLabel }: { name: string; roleLabel: string }) {
  const firstName = name.split(/\s+/)[0] || name;

  return (
    <AuthFlash storageKey={AUTH_FLASH.ingreso} variant="success" icon={<CircleCheck />}>
      Entraste bien, {firstName}. Esta es tu sesión de {roleLabel} en UniFind ·
      Barranquilla. Queda abierta en este navegador hasta que la cierres.
    </AuthFlash>
  );
}

export function SesionCerradaFlash() {
  return (
    <AuthFlash
      storageKey={AUTH_FLASH.sesionCerrada}
      variant="gold"
      icon={<LogOut />}
      className="mx-4 my-4 max-w-7xl sm:mx-6 lg:mx-auto lg:w-full"
    >
      Cerraste la sesión del panel. El catálogo sigue abierto: no necesitas
      cuenta para buscar un objeto en custodia.
    </AuthFlash>
  );
}

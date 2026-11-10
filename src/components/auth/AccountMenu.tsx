"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Role } from "@prisma/client";
import SignOutDialog from "@/components/auth/SignOutDialog";
import { Button } from "@/components/ui/button";
import { accountInitials, roleDuty, roleLabel, staffHomePath } from "@/lib/labels";
import { cn } from "@/lib/cn";

type AccountMenuProps = {
  name?: string | null;
  email?: string | null;
  role?: Role | string | null;
  /**
   * "header": chip del header móvil (el panel abre hacia abajo).
   * "nav": pie del rail lateral de escritorio (el panel abre hacia arriba,
   * porque el trigger está pegado al borde inferior de la pantalla).
   */
  placement?: "header" | "nav";
};

export default function AccountMenu({
  name,
  email,
  role,
  placement = "header",
}: AccountMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const displayName = name?.trim() || email || "Cuenta Unilibre";
  const label = roleLabel(role);
  const homePath = staffHomePath(role);
  const initials = accountInitials(name, email);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div ref={rootRef} className="relative">
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="sm"
        aria-expanded={menuOpen}
        aria-haspopup="true"
        aria-controls={menuOpen ? panelId : undefined}
        aria-label={menuOpen ? "Cerrar menú de cuenta" : "Abrir menú de cuenta"}
        onClick={() => setMenuOpen((open) => !open)}
        className="h-auto w-full max-w-full justify-start gap-2 px-2 py-1.5 text-ink-muted hover:bg-bar hover:text-ink group-hover/sidebar:max-w-[16rem] group-hover/sidebar:justify-between"
      >
        <span
          aria-hidden
          className="flex size-7 shrink-0 items-center justify-center rounded-md bg-bar font-serif text-xs font-semibold text-ink"
        >
          {initials}
        </span>
        <span className="min-w-0 flex-1 text-left leading-tight">
          <span className="block truncate text-xs font-medium text-ink">{displayName}</span>
          <span className="block truncate text-[9px] uppercase tracking-[0.18em] text-ink-subtle">
            {label}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-all",
            placement === "nav"
              ? "opacity-0 group-hover/sidebar:opacity-100"
              : "opacity-100",
            menuOpen && "rotate-180",
          )}
          aria-hidden
        />
      </Button>

      {menuOpen ? (
        <div
          id={panelId}
          className={cn(
            "absolute z-50 w-72 rounded-lg border border-line bg-paper p-3 text-ink shadow-lg",
            placement === "nav"
              ? "bottom-full left-0 mb-2 max-h-[calc(100dvh-6rem)] overflow-y-auto"
              : "right-0 mt-2",
          )}
        >
          <p className="text-sm font-semibold text-ink">{displayName}</p>
          {email ? <p className="mt-0.5 truncate text-xs text-ink-muted">{email}</p> : null}
          <p className="mt-2 text-xs text-ink-subtle">
            {label} · {roleDuty(role)}
          </p>

          {role === "ADMIN" || role === "SUPERUSER" ? (
            <Button asChild variant="outline" className="mt-3 w-full">
              <Link href={homePath} onClick={() => setMenuOpen(false)}>
                {role === "SUPERUSER" ? "Ir a Bienestar" : "Ir a vigilancia"}
              </Link>
            </Button>
          ) : null}

          <Button
            type="button"
            variant="gold"
            className="mt-2 w-full"
            onClick={() => {
              setMenuOpen(false);
              setSignOutOpen(true);
            }}
          >
            Cerrar sesión
          </Button>
        </div>
      ) : null}

      <SignOutDialog
        open={signOutOpen}
        onCancel={() => setSignOutOpen(false)}
        restoreFocusRef={triggerRef}
      />
    </div>
  );
}

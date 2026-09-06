"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Role } from "@prisma/client";
import SignOutDialog from "@/components/auth/SignOutDialog";
import { accountInitials, roleDuty, roleLabel, staffHomePath } from "@/lib/labels";
import { cn } from "@/lib/cn";

type AccountMenuProps = {
  name?: string | null;
  email?: string | null;
  role?: Role | string | null;
};

export default function AccountMenu({ name, email, role }: AccountMenuProps) {
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
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={menuOpen}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={() => setMenuOpen((open) => !open)}
        className="inline-flex max-w-[16rem] items-center gap-2 rounded-md bg-gold-ink px-2.5 py-1.5 text-white hover:bg-ink"
      >
        <span
          aria-hidden
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-white/15 font-serif text-[10px] font-semibold"
        >
          {initials}
        </span>
        <span className="min-w-0 text-left leading-tight">
          <span className="block truncate text-xs font-semibold">{displayName}</span>
          <span className="block truncate text-[10px] text-white/75">{label}</span>
        </span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 shrink-0 transition-transform", menuOpen && "rotate-180")}
          aria-hidden
        />
      </button>

      {menuOpen ? (
        <div
          id={panelId}
          className="absolute right-0 z-50 mt-2 w-72 rounded-lg border border-line bg-paper p-3 text-ink shadow-lg"
        >
          <p className="text-sm font-semibold text-ink">{displayName}</p>
          {email ? <p className="mt-0.5 truncate text-xs text-ink-muted">{email}</p> : null}
          <p className="mt-2 text-xs text-ink-subtle">
            {label} · {roleDuty(role)}
          </p>

          {role === "ADMIN" || role === "SUPERUSER" ? (
            <Link
              href={homePath}
              onClick={() => setMenuOpen(false)}
              className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-line bg-bar px-3 py-2 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
            >
              {role === "SUPERUSER" ? "Ir a Bienestar" : "Ir a vigilancia"}
            </Link>
          ) : null}

          {role === "SUPERUSER" ? (
            <Link
              href="/admin/dashboard"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-ink-muted hover:bg-bar hover:text-brand"
            >
              Panel de portería
            </Link>
          ) : null}

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setSignOutOpen(true);
            }}
            className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-gold-ink px-3 py-2 text-sm font-semibold text-white hover:bg-ink"
          >
            Cerrar sesión
          </button>
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

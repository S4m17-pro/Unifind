"use client";

import { useMemo, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Boxes,
  ClipboardCheck,
  LayoutDashboard,
  PackagePlus,
  ScanLine,
  Search,
  ShieldCheck,
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import SignOutControl from "@/components/auth/SignOutControl";
import { accountInitials, roleDuty, roleLabel } from "@/lib/labels";
import { cn } from "@/lib/cn";

type Role = "ADMIN" | "SUPERUSER" | string;

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function getHashSnapshot() {
  return window.location.hash;
}

type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: typeof LayoutDashboard;
  badge?: number;
};

function navFor(role: Role, pendingClaims = 0): NavItem[] {
  if (role === "SUPERUSER") {
    return [
      { href: "/bienestar#resumen", label: "Resumen", shortLabel: "Resumen", icon: LayoutDashboard },
      { href: "/bienestar#donacion", label: "Donación", shortLabel: "Donación", icon: Boxes },
      { href: "/objetos", label: "Catálogo público", shortLabel: "Catálogo", icon: Search },
    ];
  }

  return [
    { href: "/admin/dashboard?tab=resumen", label: "Resumen del turno", shortLabel: "Resumen", icon: LayoutDashboard },
    { href: "/admin/dashboard?tab=registro", label: "Registrar objeto", shortLabel: "Registrar", icon: PackagePlus },
    {
      href: "/admin/dashboard?tab=reclamos",
      label: "Revisar reclamos",
      shortLabel: "Reclamos",
      icon: ClipboardCheck,
      badge: pendingClaims || undefined,
    },
    { href: "/admin/dashboard?tab=entregas", label: "Entrega con firma", shortLabel: "Entregas", icon: ScanLine },
    { href: "/admin/dashboard?tab=inventario", label: "Inventario privado", shortLabel: "Inventario", icon: Boxes },
    { href: "/objetos", label: "Catálogo público", shortLabel: "Catálogo", icon: Search },
  ];
}

export default function StaffWorkspace({
  role,
  name,
  email,
  pendingClaims = 0,
  children,
}: {
  role: Role;
  name?: string | null;
  email?: string | null;
  pendingClaims?: number;
  children: ReactNode;
}) {
  const items = useMemo(() => navFor(role, pendingClaims), [role, pendingClaims]);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "resumen";
  const hash = useSyncExternalStore(subscribeToHash, getHashSnapshot, () => "");
  const displayName = name?.trim() || email || "Personal Unilibre";
  const initials = accountInitials(name, email);

  const isActive = (href: string) => {
    if (href.includes("?tab=")) {
      return pathname === "/admin/dashboard" && href.endsWith(`tab=${activeTab}`);
    }
    if (href.includes("#")) {
      if (!hash) {
        // Sin hash navegado, la primera sección es la activa por defecto.
        return href === items.find((item) => item.href.includes("#"))?.href;
      }
      return hash === href.slice(href.indexOf("#"));
    }
    return pathname === href;
  };

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.includes("#")) return;

    // Anclas internas sin remount: actualiza el hash, el resaltado y el scroll.
    event.preventDefault();
    const id = href.split("#")[1];
    const target = `#${id}`;

    if (window.location.hash !== target) {
      window.history.replaceState(null, "", target);
    }
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex items-start gap-8">
        <aside data-workspace-nav className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-[calc(var(--app-header-offset)+0.5rem)] space-y-4">
            <Link
              href="/"
              aria-label="Volver al inicio de UniFind"
              className="flex items-center gap-2 rounded-md px-1 py-1 transition-colors hover:text-brand"
            >
              <BrandLogo className="h-8 w-auto" />
            </Link>

            <div className="rounded-lg border border-line bg-paper p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-soft font-serif text-sm font-semibold text-brand">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
                  <p className="truncate text-xs text-ink-muted">{email}</p>
                </div>
              </div>
              <div className="mt-3 rounded-md border border-gold/30 bg-gold-soft px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-ink">
                  {roleLabel(role)}
                </p>
                <p className="mt-1 text-xs text-gold-ink/90">{roleDuty(role)}</p>
              </div>
            </div>

            <nav
              aria-label="Secciones del panel"
              className="rounded-lg border border-line bg-paper p-2"
            >
              {items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={(event) => handleNavClick(event, item.href)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-brand-soft text-brand"
                        : "text-ink-muted hover:bg-bar hover:text-ink",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge ? (
                      <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <div className="rounded-lg border border-line bg-paper p-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                <ShieldCheck className="size-4 text-success" aria-hidden />
                Datos privados
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink-subtle">
                Fotos, QR y estante solo se muestran aquí. El catálogo público no recibe
                esa información.
              </p>
            </div>

            <SignOutControl className="w-full" />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div
            data-workspace-nav
            className="sticky top-[calc(var(--app-header-offset)-1rem)] z-30 -mx-4 mb-6 border-y border-line bg-canvas px-4 py-2 sm:-mx-6 sm:px-6 lg:hidden"
          >
            <nav aria-label="Secciones del panel" className="no-scrollbar flex gap-1 overflow-x-auto">
              {items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={(event) => handleNavClick(event, item.href)}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors",
                      active
                        ? "bg-brand text-white"
                        : "bg-paper text-ink-muted hover:text-ink",
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden />
                    {item.shortLabel}
                    {item.badge ? (
                      <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-gold-ink px-1 text-[10px] text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}

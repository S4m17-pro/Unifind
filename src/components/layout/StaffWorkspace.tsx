"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  BarChart3,
  Boxes,
  ClipboardCheck,
  LayoutDashboard,
  PackagePlus,
  ScanLine,
  Search,
  ShieldCheck,
} from "lucide-react";
import SignOutControl from "@/components/auth/SignOutControl";
import { accountInitials, roleDuty, roleLabel } from "@/lib/labels";
import { cn } from "@/lib/cn";

type Role = "ADMIN" | "SUPERUSER" | string;

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
      { href: "/bienestar#indicadores", label: "Indicadores", shortLabel: "KPIs", icon: BarChart3 },
      { href: "/bienestar#reporte", label: "Reporte de donación", shortLabel: "Reporte", icon: Boxes },
      { href: "/admin/dashboard", label: "Panel de portería", shortLabel: "Portería", icon: ScanLine },
      { href: "/objetos", label: "Catálogo público", shortLabel: "Catálogo", icon: Search },
    ];
  }

  return [
    { href: "/admin/dashboard#resumen", label: "Resumen del turno", shortLabel: "Resumen", icon: LayoutDashboard },
    { href: "/admin/dashboard#registro", label: "Registrar objeto", shortLabel: "Registrar", icon: PackagePlus },
    {
      href: "/admin/dashboard#reclamos",
      label: "Revisar reclamos",
      shortLabel: "Reclamos",
      icon: ClipboardCheck,
      badge: pendingClaims || undefined,
    },
    { href: "/admin/dashboard#entregas", label: "Entrega con firma", shortLabel: "Entregas", icon: ScanLine },
    { href: "/admin/dashboard#inventario", label: "Inventario privado", shortLabel: "Inventario", icon: Boxes },
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
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "");
  const displayName = name?.trim() || email || "Personal Unilibre";
  const initials = accountInitials(name, email);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-workspace-section]"),
    );
    if (sections.length === 0) return;

    const syncFromScroll = () => {
      const offset = 180;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top - offset <= 0) {
          current = section;
        }
      }
      const match = items.find((item) => item.href.endsWith(`#${current.id}`));
      if (match) setActiveHref(match.href);
    };

    syncFromScroll();
    window.addEventListener("scroll", syncFromScroll, { passive: true });
    return () => window.removeEventListener("scroll", syncFromScroll);
  }, [items]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex items-start gap-8">
        <aside data-workspace-nav className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-[calc(var(--app-header-offset)+0.5rem)] space-y-4">
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
                const active = item.href === activeHref;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
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
                const active = item.href === activeHref;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
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

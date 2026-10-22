"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, Home, LayoutDashboard, LogIn, Search, Shield } from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";
import { brand } from "@/lib/brand";
import AccountMenu from "@/components/auth/AccountMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Role = "ADMIN" | "SUPERUSER" | "STUDENT" | string | null | undefined;

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
};

export default function AppSidebar({
  role,
  isAuthed,
  name,
  email,
}: {
  role: Role;
  isAuthed: boolean;
  name?: string | null;
  email?: string | null;
}) {
  const pathname = usePathname();

  const items: NavItem[] = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/objetos", label: "Catálogo", icon: Search },
    { href: "/como-funciona", label: "Cómo funciona", icon: HelpCircle },
  ];

  if (role === "ADMIN" || role === "SUPERUSER") {
    items.push({ href: "/admin/dashboard", label: "Vigilancia", icon: Shield });
  }
  if (role === "SUPERUSER") {
    items.push({ href: "/bienestar", label: "Bienestar", icon: LayoutDashboard });
  }

  return (
    <aside
      data-app-sidebar
      className="sticky top-0 hidden h-screen max-h-[100dvh] self-start lg:flex"
    >
      <div
        className={cn(
          "group/sidebar relative flex h-full flex-col border-r border-line bg-transparent text-ink transition-[width] duration-300 ease-out",
          "w-[4.25rem] hover:w-72",
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" aria-hidden />
        <div className="relative flex h-full flex-col justify-between">
          <div>
            <div className="flex h-16 items-center gap-2.5 border-b border-line px-2.5">
              <Link
                href="/"
                aria-label="Ir al inicio"
                className="flex size-11 shrink-0 items-center justify-center rounded-md p-1 transition-colors hover:bg-bar"
              >
                <BrandMark className="size-9" />
              </Link>
              <div className="min-w-0 translate-x-[-0.5rem] opacity-0 transition-all duration-300 group-hover/sidebar:translate-x-0 group-hover/sidebar:opacity-100">
                <p className="truncate font-serif text-sm font-bold leading-tight text-ink">
                  {brand.product}
                </p>
                <p className="truncate text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
                  {brand.seccional}
                </p>
              </div>
            </div>

            <nav className="mt-2 flex flex-col gap-1 px-2">
              {items.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group/item relative flex h-11 items-center gap-3 rounded-md px-2.5 transition-all duration-200",
                      active
                        ? "bg-brand-soft text-brand font-semibold"
                        : "text-ink hover:bg-bar hover:text-brand",
                    )}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center">
                      <Icon
                        className={cn(
                          "size-5 transition-colors",
                          active ? "text-brand" : "text-ink group-hover/item:text-brand",
                        )}
                        aria-hidden
                      />
                    </span>
                    <span className="truncate text-sm font-medium translate-x-[-0.25rem] opacity-0 transition-all duration-300 group-hover/sidebar:translate-x-0 group-hover/sidebar:opacity-100">
                      {item.label}
                    </span>
                    {active ? (
                      <span className="absolute left-0 h-5 w-0.5 rounded-r-full bg-brand" aria-hidden />
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-1.5 px-2 pb-3">
            {isAuthed ? (
              <div className="overflow-hidden rounded-md">
                <AccountMenu name={name} email={email} role={role} />
              </div>
            ) : (
              <Button
                asChild
                variant="ghost"
                className="h-11 w-full justify-start gap-3 px-2.5 text-ink hover:bg-bar hover:text-brand"
              >
                <Link href="/login">
                  <span className="flex size-7 shrink-0 items-center justify-center">
                    <LogIn className="size-5 text-ink group-hover:text-brand" aria-hidden />
                  </span>
                  <span className="truncate text-sm font-medium translate-x-[-0.25rem] opacity-0 transition-all duration-300 group-hover/sidebar:translate-x-0 group-hover/sidebar:opacity-100">
                    Iniciar sesión
                  </span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

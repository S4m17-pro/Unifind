import Link from "next/link";
import { auth } from "@/auth";
import AccountMenu from "@/components/auth/AccountMenu";
import BrandLogo from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";

export default async function AppHeader() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <header data-app-header className="sticky top-0 z-40 isolate bg-paper lg:hidden">
      <div className="border-b border-line bg-bar">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
            {brand.seccional}
          </p>
          {session ? (
            <AccountMenu
              name={session.user.name}
              email={session.user.email}
              role={role}
            />
          ) : (
            <Button asChild size="sm" className="text-xs font-semibold">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="border-b-[3px] border-brand bg-paper">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label={`${brand.product} — ${brand.institution}`}
            className="flex min-w-0 items-center"
          >
            <BrandLogo priority className="h-9 sm:h-10" />
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-1 text-sm sm:gap-2">
            <Link
              href="/objetos"
              className="rounded-md px-3 py-1.5 font-medium text-ink hover:bg-bar hover:text-brand"
            >
              Catálogo
            </Link>
            <Link
              href="/como-funciona"
              className="hidden rounded-md px-3 py-1.5 font-medium text-ink hover:bg-bar hover:text-brand sm:inline-flex"
            >
              Cómo funciona
            </Link>

            {role === "ADMIN" || role === "SUPERUSER" ? (
              <Link
                href="/admin/dashboard"
                className="rounded-md px-3 py-1.5 font-medium text-ink hover:bg-bar hover:text-brand"
              >
                Vigilancia
              </Link>
            ) : null}

            {role === "SUPERUSER" ? (
              <Link
                href="/bienestar"
                className="rounded-md px-3 py-1.5 font-medium text-ink hover:bg-bar hover:text-brand"
              >
                Bienestar
              </Link>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}

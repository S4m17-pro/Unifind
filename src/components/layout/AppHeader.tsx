import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "@/actions/auth.actions";

export default async function AppHeader() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400 px-2 py-1 text-xs font-bold tracking-wide text-slate-950">
            UL
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-slate-900 group-hover:text-slate-900 sm:text-base">
              UniFind
            </span>
            <span className="hidden text-[11px] text-slate-600 sm:block">
              U. Libre · Barranquilla
            </span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-1 text-sm sm:gap-2">
          <Link
            href="/objetos"
            className="rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          >
            Catálogo
          </Link>

          {role === "ADMIN" || role === "SUPERUSER" ? (
            <Link
              href="/admin/dashboard"
              className="rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              Vigilancia
            </Link>
          ) : null}

          {role === "SUPERUSER" ? (
            <Link
              href="/bienestar"
              className="rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              Bienestar
            </Link>
          ) : null}

          {session ? (
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-slate-800 hover:bg-slate-200"
              >
                Cerrar sesión
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-500"
            >
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

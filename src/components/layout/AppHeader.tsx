import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "@/actions/auth.actions";

export default async function AppHeader() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-lg bg-blue-600 px-2 py-1 text-xs font-bold tracking-wide text-white">
            UL
          </span>
          <span className="text-sm font-semibold text-slate-100 sm:text-base">
            UniFind
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm sm:gap-3">
          <Link href="/" className="rounded-lg px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white">
            Catálogo
          </Link>

          {role === "ADMIN" || role === "SUPERUSER" ? (
            <Link
              href="/admin/dashboard"
              className="rounded-lg px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Vigilancia
            </Link>
          ) : null}

          {role === "SUPERUSER" ? (
            <Link
              href="/bienestar"
              className="rounded-lg px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Bienestar
            </Link>
          ) : null}

          {session ? (
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-slate-200 hover:bg-slate-700"
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

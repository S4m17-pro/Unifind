import Link from "next/link";

export default function RootNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-400">
        404
      </p>
      <h1 className="mb-3 text-2xl font-bold text-slate-100">Página no encontrada</h1>
      <p className="mb-6 max-w-md text-sm text-slate-400">
        Revisa el enlace o vuelve al catálogo público de UniFind.
      </p>
      <Link
        href="/objetos"
        className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
      >
        Ir al catálogo
      </Link>
    </main>
  );
}

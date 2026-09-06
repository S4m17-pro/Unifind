import Link from "next/link";

export default function RootNotFound() {
  return (
    <main className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
        404
      </p>
      <h1 className="mb-3 font-serif text-2xl font-semibold text-ink">Página no encontrada</h1>
      <p className="mb-6 max-w-md text-sm text-ink-muted">
        Revisa el enlace o vuelve al catálogo público de UniFind.
      </p>
      <Link
        href="/objetos"
        className="inline-flex rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
      >
        Ir al catálogo
      </Link>
    </main>
  );
}

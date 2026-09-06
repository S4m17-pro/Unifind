import Link from "next/link";

export default function ItemNotFound() {
  return (
    <main className="px-4 py-20 text-center sm:px-6">
      <h1 className="mb-3 font-serif text-2xl font-semibold text-ink">Objeto no encontrado</h1>
      <p className="mb-6 text-sm text-ink-muted">
        Puede que ya se haya entregado o que el enlace no sea válido.
      </p>
      <Link
        href="/objetos"
        className="inline-flex rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
      >
        Volver al catálogo
      </Link>
    </main>
  );
}

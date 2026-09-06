import Link from "next/link";

export default function AdminItemNotFound() {
  return (
    <main className="px-4 py-20 text-center sm:px-6">
      <h1 className="mb-3 font-serif text-2xl font-semibold text-ink">Objeto no encontrado</h1>
      <p className="mb-6 text-sm text-ink-muted">
        No hay una ficha privada con ese identificador, o ya no está en inventario.
      </p>
      <Link
        href="/admin/dashboard"
        className="inline-flex rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
      >
        Volver al panel de vigilancia
      </Link>
    </main>
  );
}

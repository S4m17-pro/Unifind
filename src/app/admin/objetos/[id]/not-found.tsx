import Link from "next/link";

export default function AdminItemNotFound() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-20 text-center text-slate-100 sm:px-6">
      <h1 className="mb-3 text-2xl font-bold">Objeto no encontrado</h1>
      <p className="mb-6 text-sm text-slate-400">
        No hay una ficha privada con ese identificador, o ya no está en inventario.
      </p>
      <Link
        href="/admin/dashboard"
        className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
      >
        Volver al panel de vigilancia
      </Link>
    </main>
  );
}

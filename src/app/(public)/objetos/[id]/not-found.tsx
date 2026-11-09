import Link from "next/link";

export default function ItemNotFound() {
  return (
    <main className="px-4 py-20 text-center sm:px-6">
      <h1 className="mb-3 text-2xl font-bold text-slate-900">Objeto no encontrado</h1>
      <p className="mb-6 text-sm text-slate-600">
        Puede que ya se haya entregado o que el enlace no sea válido.
      </p>
      <Link
        href="/objetos"
        className="inline-flex rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-600"
      >
        Volver al catálogo
      </Link>
    </main>
  );
}

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
        <h1 className="mb-3 text-2xl font-bold text-slate-100">Acceso no autorizado</h1>
        <p className="mb-6 text-sm text-slate-400">
          Esta ruta está reservada al personal de portería/vigilancia o a Bienestar Universitario.
          Los estudiantes consultan el catálogo público y reclaman por correo, sin ver fotos.
        </p>
        <Link
          href="/objetos"
          className="inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
        >
          Volver al catálogo
        </Link>
      </div>
    </main>
  );
}

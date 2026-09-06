import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-lg border border-line bg-paper p-8 text-center shadow-sm">
        <h1 className="mb-3 font-serif text-2xl font-semibold text-ink">Acceso no autorizado</h1>
        <p className="mb-6 text-sm text-ink-muted">
          Esta ruta está reservada al personal de portería/vigilancia o a Bienestar Universitario.
          Los estudiantes consultan el catálogo público y reclaman por correo, sin ver fotos.
        </p>
        <Link
          href="/objetos"
          className="inline-flex rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          Volver al catálogo
        </Link>
      </div>
    </main>
  );
}

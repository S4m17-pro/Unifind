import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          UniFind · Universidad Libre, seccional Barranquilla.
          <span className="mt-1 block sm:mt-0 sm:inline sm:before:content-['_·_']">
            Consulta pública sin fotos ni datos sensibles.
          </span>
        </p>
        <div className="flex gap-4">
          <Link href="/objetos" className="hover:text-slate-200">
            Catálogo
          </Link>
          <Link href="/#como-funciona" className="hover:text-slate-200">
            Cómo reclamar
          </Link>
        </div>
      </div>
    </footer>
  );
}

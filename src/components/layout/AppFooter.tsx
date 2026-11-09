import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white print:hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>UniFind · Universidad Libre Seccional Barranquilla</p>
        <div className="flex gap-4">
          <Link href="/objetos" className="hover:text-slate-900">
            Catálogo
          </Link>
          <Link href="/#como-funciona" className="hover:text-slate-900">
            Cómo reclamar
          </Link>
        </div>
      </div>
    </footer>
  );
}

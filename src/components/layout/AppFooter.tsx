import Link from "next/link";
import BrandMark from "@/components/brand/BrandMark";
import { brand } from "@/lib/brand";

export default function AppFooter() {
  return (
    <footer className="border-t-[3px] border-brand bg-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          <BrandMark className="ring-1 ring-white/20" />
          <div>
            <p className="font-serif text-base font-semibold">
              {brand.product} · {brand.institution}
            </p>
            <p className="mt-1 text-xs text-white/70">
              {brand.seccional} · Consulta pública de objetos en custodia, sin
              fotos de objetos
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-medium">
          <Link href="/objetos" className="text-white/80 hover:text-white">
            Catálogo
          </Link>
          <Link
            href="/#como-reclamar"
            scroll={false}
            className="text-white/80 hover:text-white"
          >
            Cómo reclamar
          </Link>
          <Link href="/login" className="text-gold hover:text-white">
            Personal autorizado
          </Link>
        </div>
      </div>
    </footer>
  );
}

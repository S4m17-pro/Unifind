import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";
import { brand } from "@/lib/brand";

export default function AppFooter() {
  return (
    <footer className="border-t-[3px] border-brand bg-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          <span className="inline-flex shrink-0 items-center rounded-md bg-white px-2 py-1.5">
            <BrandLogo className="h-8 w-auto" />
          </span>
          <div>
            <p className="font-serif text-base font-semibold">{brand.institution}</p>
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
          <Link href="/como-funciona" className="text-white/80 hover:text-white">
            Cómo funciona
          </Link>
          <Link href="/login" className="text-gold hover:text-white">
            Personal autorizado
          </Link>
        </div>
      </div>
    </footer>
  );
}

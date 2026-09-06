import Link from "next/link";
import BrandImageSlot from "@/components/brand/BrandImageSlot";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";

export default function CampusHero() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:px-8 lg:py-20">
        <div>
          <div className="mb-5 flex gap-1" aria-hidden>
            <span className="h-1 w-10 bg-brand" />
            <span className="h-1 w-6 bg-gold" />
          </div>
          <p className="mb-4 inline-block rounded-md border border-gold/40 bg-gold-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
            {brand.kicker}
          </p>
          <h1 className="mb-4 max-w-xl font-serif text-4xl font-semibold text-ink sm:text-5xl">
            ¿Perdiste algo en el campus?
          </h1>
          <p className="mb-6 max-w-xl text-sm text-ink-muted sm:text-base">
            UniFind es la consulta de objetos en custodia de {brand.institution}{" "}
            {brand.seccional}. Revisa categoría, fecha, bloque/salón y portería;
            reclama con tu correo institucional. Por privacidad no publicamos
            fotos de los objetos, ni el QR ni el estante interno.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/objetos">Ver catálogo</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#como-funciona">Cómo reclamar</Link>
            </Button>
          </div>
          <p className="mt-6 text-xs text-ink-subtle">
            Portería de campus · Sin fotos de objetos · Entrega con carnet
          </p>
        </div>

        <BrandImageSlot slot="hero" variant="hero" priority />
      </div>
    </section>
  );
}

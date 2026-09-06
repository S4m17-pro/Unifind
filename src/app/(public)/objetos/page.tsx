import type { Metadata } from "next";
import BrandImageSlot from "@/components/brand/BrandImageSlot";
import CatalogFilters from "@/components/public/CatalogFilters";
import DbUnavailableNotice from "@/components/public/DbUnavailableNotice";
import ItemGrid from "@/components/public/ItemGrid";
import { brand } from "@/lib/brand";
import { getCatalogPageData, parseStatusFilter } from "@/lib/public-catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de objetos",
  description:
    "Consulta pública genérica de objetos en custodia. Filtra por categoría, portería y estado. Sin fotos.",
};

type SearchParams = Promise<{
  categoria?: string;
  porteria?: string;
  estado?: string;
}>;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = {
    category: params.categoria || undefined,
    custodyStation: params.porteria || undefined,
    status: parseStatusFilter(params.estado),
  };
  const { items, options, dbUnavailable } = await getCatalogPageData(filters);

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <div className="mb-4 flex gap-1" aria-hidden>
              <span className="h-1 w-8 bg-brand" />
              <span className="h-1 w-4 bg-gold" />
            </div>
            <p className="mb-3 inline-block rounded-md border border-gold/40 bg-gold-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
              Consulta pública · {brand.seccional}
            </p>
            <h1 className="mb-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
              Catálogo de objetos en custodia
            </h1>
            <p className="max-w-xl text-sm text-ink-muted sm:text-base">
              No publicamos fotos de los objetos, ni QR ni el estante interno.
              Filtra por categoría, portería y estado; si reconoces uno, reclámalo
              con tu correo institucional.
            </p>
          </div>
          <BrandImageSlot slot="catalog" variant="banner" />
        </header>

        <div className="mb-8">
          <CatalogFilters options={options} current={filters} action="/objetos" />
        </div>

        {dbUnavailable && (
          <div className="mb-6">
            <DbUnavailableNotice />
          </div>
        )}

        <p className="mb-4 text-sm text-ink-subtle">
          {items.length === 1 ? "1 objeto" : `${items.length} objetos`}
        </p>

        <ItemGrid items={items} />
      </div>
    </main>
  );
}

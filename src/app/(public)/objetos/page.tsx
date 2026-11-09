import type { Metadata } from "next";
import CatalogFilters from "@/components/public/CatalogFilters";
import DbUnavailableNotice from "@/components/public/DbUnavailableNotice";
import ItemGrid from "@/components/public/ItemGrid";
import { getCatalogPageData, parseStatusFilter } from "@/lib/public-catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de objetos",
  description:
    "Explora los objetos que están en custodia en portería. Filtra por categoría, portería y estado, y reclama el tuyo.",
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
        <header className="mb-8">
          <p className="mb-3 inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Consulta pública
          </p>
          <h1 className="mb-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Catálogo de objetos en custodia
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
            Usa los filtros para encontrar tu objeto más rápido. Si lo reconoces, envía el
            reclamo con tu correo institucional y portería lo verificará.
          </p>
        </header>

        <div className="mb-8">
          <CatalogFilters options={options} current={filters} action="/objetos" />
        </div>

        {dbUnavailable && (
          <div className="mb-6">
            <DbUnavailableNotice />
          </div>
        )}

        <p className="mb-4 text-sm text-slate-500">
          {items.length === 1 ? "1 objeto" : `${items.length} objetos`}
        </p>

        <ItemGrid items={items} />
      </div>
    </main>
  );
}

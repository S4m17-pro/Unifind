import type { Metadata } from "next";
import CatalogFilters from "@/components/public/CatalogFilters";
import DbUnavailableNotice from "@/components/public/DbUnavailableNotice";
import ItemGrid from "@/components/public/ItemGrid";
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
        <header className="mb-8">
          <p className="mb-3 inline-block rounded-full border border-blue-800 bg-blue-950/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400">
            Consulta pública
          </p>
          <h1 className="mb-3 text-3xl font-extrabold text-slate-100 sm:text-4xl">
            Catálogo de objetos en custodia
          </h1>
          <p className="max-w-2xl text-sm text-slate-400 sm:text-base">
            No publicamos fotos, QR ni el estante interno. Filtra por categoría, portería
            y estado; si reconoces un objeto, envía el reclamo con tu correo institucional.
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

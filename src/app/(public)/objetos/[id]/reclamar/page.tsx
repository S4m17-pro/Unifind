import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ClaimForm from "@/components/public/ClaimForm";
import StatusBadge from "@/components/public/StatusBadge";
import { getClaimDefaults } from "@/lib/claim-defaults";
import { getPublicItem, isClaimable } from "@/lib/public-catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reclamar objeto",
};

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ email?: string; nombre?: string }>;

export default async function ClaimPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);

  let item;
  try {
    item = await getPublicItem(id);
  } catch {
    notFound();
  }

  if (!item) notFound();

  const claimable = isClaimable(item.status);
  const defaults = await getClaimDefaults(query);

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <Link
          href={`/objetos/${item.id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver al detalle
        </Link>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl sm:p-8">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Reclamo
            </p>
            <StatusBadge status={item.status} />
          </div>
          <h1 className="mb-2 text-2xl font-extrabold text-slate-100">
            {item.category} · {item.custodyStation}
          </h1>
          <p className="mb-6 text-sm text-slate-400">
            Hallado en {item.foundLocation} (bloque/salón). Describe cómo lo reconoces;
            portería valida y te lo entrega con tu carnet.
          </p>

          {claimable ? (
            <ClaimForm
              item={{
                id: item.id,
                category: item.category,
                foundLocation: item.foundLocation,
                custodyStation: item.custodyStation,
              }}
              defaults={defaults}
              submitLabel="Enviar reclamo"
            />
          ) : (
            <p className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
              Este objeto ya no admite reclamos públicos.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

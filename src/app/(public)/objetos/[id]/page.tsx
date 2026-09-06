import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, ShieldAlert } from "lucide-react";
import ClaimFormModal from "@/components/public/ClaimFormModal";
import CategoryGlyph from "@/components/public/CategoryGlyph";
import StatusBadge from "@/components/public/StatusBadge";
import { formatFoundDate } from "@/lib/labels";
import { getPublicItem, isClaimable } from "@/lib/public-catalog";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ reclamar?: string; email?: string; nombre?: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const item = await getPublicItem(id);
    if (!item) return { title: "Objeto no encontrado" };
    return { title: `${item.category} en ${item.custodyStation}` };
  } catch {
    return { title: "Detalle del objeto" };
  }
}

export default async function ItemDetailPage({
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
  const autoOpen = query.reclamar === "1" && claimable;

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/objetos"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver al catálogo
        </Link>

        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <CategoryGlyph category={item.category} className="h-14 w-14" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  {item.category}
                </p>
                <h1 className="text-2xl font-extrabold text-slate-100 sm:text-3xl">
                  Objeto en {item.custodyStation}
                </h1>
              </div>
            </div>
            <StatusBadge status={item.status} />
          </div>

          <dl className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Lugar del hallazgo
              </dt>
              <dd className="text-sm text-slate-200">{item.foundLocation}</dd>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Portería de custodia
              </dt>
              <dd className="text-sm text-slate-200">{item.custodyStation}</dd>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:col-span-2">
              <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                Fecha de hallazgo
              </dt>
              <dd className="text-sm text-slate-200">{formatFoundDate(item.foundDate)}</dd>
            </div>
          </dl>

          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
            <p>
              Por privacidad no mostramos fotos, estante interno ni descripción del
              registro. Si es tuyo, descríbelo tú en el reclamo.
            </p>
          </div>

          {claimable ? (
            <div className="space-y-3">
              <ClaimFormModal
                item={{
                  id: item.id,
                  category: item.category,
                  foundLocation: item.foundLocation,
                  custodyStation: item.custodyStation,
                }}
                autoOpen={autoOpen}
                defaults={{ email: query.email, name: query.nombre }}
                triggerLabel="Reclamar este objeto"
              />
              <p className="text-center text-xs text-slate-500">
                ¿Prefieres la página completa?{" "}
                <Link
                  href={claimHref(item.id, query.email, query.nombre)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Abrir formulario de reclamo
                </Link>
              </p>
            </div>
          ) : (
            <p className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
              Este objeto ya no está disponible para reclamo público.
            </p>
          )}
        </article>
      </div>
    </main>
  );
}

function claimHref(id: string, email?: string, name?: string) {
  const params = new URLSearchParams();
  if (email) params.set("email", email);
  if (name) params.set("nombre", name);
  const query = params.toString();
  return query ? `/objetos/${id}/reclamar?${query}` : `/objetos/${id}/reclamar`;
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, ShieldAlert } from "lucide-react";
import ClaimFormModal from "@/components/public/ClaimFormModal";
import CategoryGlyph from "@/components/public/CategoryGlyph";
import StatusBadge from "@/components/public/StatusBadge";
import { getClaimDefaults } from "@/lib/claim-defaults";
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
  const defaults = await getClaimDefaults(query);

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/objetos"
          className="mb-6 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver al catálogo
        </Link>

        <article className="rounded-lg border border-line bg-paper p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <CategoryGlyph category={item.category} className="h-14 w-14" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                  {item.category}
                </p>
                <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
                  Objeto en {item.custodyStation}
                </h1>
              </div>
            </div>
            <StatusBadge status={item.status} />
          </div>

          <dl className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-canvas p-4">
              <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Bloque / salón
              </dt>
              <dd className="text-sm text-ink">{item.foundLocation}</dd>
            </div>
            <div className="rounded-lg border border-line bg-canvas p-4">
              <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Portería de custodia
              </dt>
              <dd className="text-sm text-ink">{item.custodyStation}</dd>
            </div>
            <div className="rounded-lg border border-line bg-canvas p-4 sm:col-span-2">
              <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                Fecha de hallazgo
              </dt>
              <dd className="text-sm text-ink">{formatFoundDate(item.foundDate)}</dd>
            </div>
          </dl>

          <div className="mb-8 flex items-start gap-3 rounded-lg border border-gold/40 bg-gold-soft p-4 text-sm text-gold-ink">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p>
              Por privacidad no mostramos fotos, QR, estante interno ni la descripción
              del registro. Si es tuyo, descríbelo tú en el reclamo.
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
                defaults={defaults}
                triggerLabel="Reclamar este objeto"
              />
              <p className="text-center text-xs text-ink-subtle">
                ¿Prefieres la página completa?{" "}
                <Link
                  href={claimHref(item.id, query.email, query.nombre)}
                  className="font-semibold text-brand hover:text-brand-hover"
                >
                  Abrir formulario de reclamo
                </Link>
              </p>
            </div>
          ) : (
            <p className="rounded-lg border border-line bg-canvas p-4 text-sm text-ink-muted">
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

import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { isClaimable, type PublicItem } from "@/lib/public-catalog";
import { formatFoundDate } from "@/lib/labels";
import CategoryGlyph from "@/components/public/CategoryGlyph";
import StatusBadge from "@/components/public/StatusBadge";

export default function ItemCard({ item }: { item: PublicItem }) {
  const claimable = isClaimable(item.status);

  return (
    <article className="flex h-full flex-col justify-between rounded-lg border border-line bg-paper p-6 shadow-sm transition-colors hover:border-brand/40">
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <CategoryGlyph category={item.category} />
          <StatusBadge status={item.status} />
        </div>

        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
          {item.category}
        </p>
        <h3 className="mb-3 font-serif text-lg font-semibold text-ink">
          Objeto en {item.custodyStation}
        </h3>

        <dl className="space-y-2 text-sm text-ink-muted">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden />
            <div>
              <dt className="sr-only">Bloque / salón</dt>
              <dd>
                <span className="text-ink">Bloque / salón:</span> {item.foundLocation}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden />
            <div>
              <dt className="sr-only">Fecha</dt>
              <dd>
                <span className="text-ink">Fecha:</span> {formatFoundDate(item.foundDate)}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Link
          href={`/objetos/${item.id}`}
          className="inline-flex flex-1 items-center justify-center rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
        >
          Ver detalle
        </Link>
        {claimable ? (
          <Link
            href={`/objetos/${item.id}/reclamar`}
            className="inline-flex flex-1 items-center justify-center rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Reclamar
          </Link>
        ) : (
          <span className="inline-flex flex-1 items-center justify-center rounded-md border border-line px-4 py-2.5 text-center text-sm text-ink-subtle">
            No disponible
          </span>
        )}
      </div>
    </article>
  );
}

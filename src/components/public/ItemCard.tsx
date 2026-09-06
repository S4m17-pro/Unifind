import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { isClaimable, type PublicItem } from "@/lib/public-catalog";
import { formatFoundDate } from "@/lib/labels";
import CategoryGlyph from "@/components/public/CategoryGlyph";
import StatusBadge from "@/components/public/StatusBadge";

export default function ItemCard({ item }: { item: PublicItem }) {
  const claimable = isClaimable(item.status);

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-200 hover:border-blue-500/50">
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <CategoryGlyph category={item.category} />
          <StatusBadge status={item.status} />
        </div>

        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
          {item.category}
        </p>
        <h3 className="mb-3 text-lg font-bold text-slate-100">
          Objeto en {item.custodyStation}
        </h3>

        <dl className="space-y-2 text-sm text-slate-400">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            <div>
              <dt className="sr-only">Bloque / salón</dt>
              <dd>
                <span className="text-slate-300">Bloque / salón:</span> {item.foundLocation}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            <div>
              <dt className="sr-only">Fecha</dt>
              <dd>
                <span className="text-slate-300">Fecha:</span> {formatFoundDate(item.foundDate)}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Link
          href={`/objetos/${item.id}`}
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
        >
          Ver detalle
        </Link>
        {claimable ? (
          <Link
            href={`/objetos/${item.id}/reclamar`}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-500"
          >
            Reclamar
          </Link>
        ) : (
          <span className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-800 px-4 py-2.5 text-center text-sm text-slate-500">
            No disponible
          </span>
        )}
      </div>
    </article>
  );
}

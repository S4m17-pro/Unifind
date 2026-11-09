import type { ItemStatus } from "@prisma/client";
import { cn } from "@/lib/cn";
import { statusLabel } from "@/lib/labels";

const STYLES: Record<ItemStatus, string> = {
  EN_BODEGA: "bg-teal-50 text-teal-700 border-teal-200/80",
  ENTREGADO: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  LISTO_PARA_DONACION: "bg-amber-50 text-amber-800 border-amber-200/80",
};

export default function StatusBadge({ status }: { status: ItemStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        STYLES[status],
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

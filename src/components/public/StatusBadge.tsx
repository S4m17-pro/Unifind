import type { ItemStatus } from "@prisma/client";
import { cn } from "@/lib/cn";
import { statusLabel } from "@/lib/labels";

const STYLES: Record<ItemStatus, string> = {
  EN_BODEGA: "bg-blue-950/80 text-blue-300 border-blue-800/80",
  ENTREGADO: "bg-emerald-950/80 text-emerald-300 border-emerald-800/80",
  LISTO_PARA_DONACION: "bg-amber-950/80 text-amber-300 border-amber-800/80",
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

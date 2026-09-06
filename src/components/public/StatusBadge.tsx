import type { ItemStatus } from "@prisma/client";
import { cn } from "@/lib/cn";
import { statusLabel } from "@/lib/labels";

const STYLES: Record<ItemStatus, string> = {
  EN_BODEGA: "bg-brand-soft text-brand border-brand/20",
  ENTREGADO: "bg-success-soft text-success border-success/20",
  LISTO_PARA_DONACION: "bg-gold-soft text-gold-ink border-gold/30",
};

export default function StatusBadge({ status }: { status: ItemStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        STYLES[status],
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

import type { ItemStatus } from "@prisma/client";

export const STATUS_LABELS: Record<ItemStatus, string> = {
  EN_BODEGA: "En bodega",
  ENTREGADO: "Entregado",
  LISTO_PARA_DONACION: "Listo para donación",
};

export function statusLabel(status: ItemStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function formatFoundDate(date: Date | string): string {
  return new Date(date).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

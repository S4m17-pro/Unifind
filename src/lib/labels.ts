import type { ItemStatus } from "@prisma/client";

export const STATUS_LABELS: Record<ItemStatus, string> = {
  EN_BODEGA: "En bodega",
  ENTREGADO: "Entregado",
  LISTO_PARA_DONACION: "Listo para donación",
};

export const FALLBACK_CATEGORIES = [
  "Electrónica",
  "Ropa",
  "Documentos",
  "Llaves",
  "Accesorios",
  "Útiles",
  "Otro",
] as const;

export const FALLBACK_STATIONS = [
  "Portería Principal",
  "Portería Norte",
  "Portería Sur",
  "Biblioteca",
] as const;

export function statusLabel(status: ItemStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function formatFoundDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

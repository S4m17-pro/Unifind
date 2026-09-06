export const ITEM_CATEGORIES = [
  "Electrónica",
  "Ropa",
  "Documentos",
  "Llaves",
  "Accesorios",
  "Útiles",
  "Otros",
] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export const CUSTODY_RETENTION_DAYS = 30;

export const STAFF_ROLES = ["ADMIN", "SUPERUSER"] as const;
export const SUPERUSER_ROLES = ["SUPERUSER"] as const;

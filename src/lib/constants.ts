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

export type StaffRole = (typeof STAFF_ROLES)[number];
export type SuperuserRole = (typeof SUPERUSER_ROLES)[number];

export function isStaffRole(role: string | undefined | null): role is StaffRole {
  return role === "ADMIN" || role === "SUPERUSER";
}

export function isSuperuserRole(role: string | undefined | null): role is SuperuserRole {
  return role === "SUPERUSER";
}

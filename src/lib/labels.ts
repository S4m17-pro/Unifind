import type { ItemStatus, Role } from "@prisma/client";

export const STATUS_LABELS: Record<ItemStatus, string> = {
  EN_BODEGA: "En bodega",
  ENTREGADO: "Entregado",
  LISTO_PARA_DONACION: "Listo para donación",
};

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Vigilancia",
  SUPERUSER: "Bienestar Universitario",
  STUDENT: "Comunidad Unilibre",
};

export function roleLabel(role?: Role | string | null): string {
  if (role && role in ROLE_LABELS) {
    return ROLE_LABELS[role as Role];
  }
  return "Personal Unilibre";
}

export function staffHomePath(role?: Role | string | null): string {
  if (role === "SUPERUSER") return "/bienestar";
  if (role === "ADMIN") return "/admin/dashboard";
  return "/objetos";
}

export function roleDuty(role?: Role | string | null): string {
  if (role === "SUPERUSER") return "Métricas, retención y donaciones";
  if (role === "ADMIN") return "Registro, reclamos y entregas en portería";
  return "Consulta pública de objetos en custodia";
}

export function accountInitials(name?: string | null, email?: string | null): string {
  const source = name?.trim() || email?.trim() || "UF";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

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

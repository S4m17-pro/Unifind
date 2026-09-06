import { auth } from "@/auth";

export class AuthActionError extends Error {
  constructor(message = "No autorizado.") {
    super(message);
    this.name = "AuthActionError";
  }
}

function isStaffRole(role: string | undefined): role is "ADMIN" | "SUPERUSER" {
  return role === "ADMIN" || role === "SUPERUSER";
}

export async function requireStaffSession() {
  const session = await auth();

  if (!session?.user?.id || !isStaffRole(session.user.role)) {
    throw new AuthActionError("Se requiere sesión de vigilancia o Bienestar.");
  }

  return session;
}

export async function requireSuperuserSession() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "SUPERUSER") {
    throw new AuthActionError("Se requiere sesión de Bienestar Universitario.");
  }

  return session;
}

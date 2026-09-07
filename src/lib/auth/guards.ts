import type { Role } from "@prisma/client";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { actionError, type ActionResult } from "@/lib/action-result";
import { isStaffRole, isSuperuserRole } from "@/lib/constants";

export class AuthActionError extends Error {
  constructor(message = "No autorizado.") {
    super(message);
    this.name = "AuthActionError";
  }
}

export type AuthedSession = {
  user: {
    id: string;
    role: Role;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
};

function asAuthedSession(session: Session | null): AuthedSession | null {
  if (!session?.user?.id || !session.user.role) {
    return null;
  }

  return session as AuthedSession;
}

export async function requireSession(
  message = "Debes iniciar sesión.",
): Promise<AuthedSession> {
  const session = asAuthedSession(await auth());

  if (!session) {
    throw new AuthActionError(message);
  }

  return session;
}

export async function requireRole(
  roles: readonly Role[],
  message = "No tienes permiso para esta acción.",
): Promise<AuthedSession> {
  const session = await requireSession();

  if (!roles.includes(session.user.role)) {
    throw new AuthActionError(message);
  }

  return session;
}

export async function requireStaffSession() {
  return requireRole(
    ["ADMIN", "SUPERUSER"],
    "Debes iniciar sesión como vigilante o Bienestar.",
  );
}

export async function requireSuperuserSession() {
  return requireRole(["SUPERUSER"], "Se requiere sesión de Bienestar Universitario.");
}

export async function withStaffSession<T extends object>(
  fn: (session: AuthedSession) => Promise<ActionResult<T>>,
): Promise<ActionResult<T>> {
  try {
    const session = await requireStaffSession();
    return await fn(session);
  } catch (error) {
    if (error instanceof AuthActionError) {
      return actionError(error.message);
    }
    throw error;
  }
}

export { isStaffRole, isSuperuserRole };

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/validation";

export async function authorizeCredentials(credentials: {
  email?: unknown;
  password?: unknown;
}) {
  const email = normalizeEmail(String(credentials?.email ?? ""));
  const password = String(credentials?.password ?? "");

  if (!email || !password) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user?.passwordHash) {
    return null;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

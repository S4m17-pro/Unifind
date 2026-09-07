import type { Prisma, PrismaClient, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeEmail, truncate } from "@/lib/validation";

type DbClient = PrismaClient | Prisma.TransactionClient;

type CommunityUserInput = {
  email: string;
  name?: string | null;
};

/** Upsert por correo. No cambia el rol de cuentas de personal ya existentes. */
export async function upsertCommunityUser(input: CommunityUserInput, db: DbClient = prisma) {
  const email = normalizeEmail(input.email);
  const name = truncate(input.name ?? "", 120);

  return db.user.upsert({
    where: { email },
    update: name ? { name } : {},
    create: {
      email,
      name: name || "Estudiante",
      role: "STUDENT",
    },
  });
}

type MicrosoftLinkInput = {
  email: string;
  name?: string | null;
  image?: string | null;
  oid: string;
};

/**
 * Primer login Microsoft: crea STUDENT.
 * Si el correo ya es vigilancia/Bienestar (u otro rol), se conserva el rol.
 */
export async function linkMicrosoftUser(input: MicrosoftLinkInput) {
  const email = normalizeEmail(input.email);
  const name = truncate(input.name ?? "", 120) || null;
  const avatarUrl = input.image?.trim() || null;
  const oid = input.oid.trim();

  const byEmail = await prisma.user.findUnique({ where: { email } });
  if (byEmail) {
    return prisma.user.update({
      where: { id: byEmail.id },
      data: {
        microsoftOid: byEmail.microsoftOid ?? oid,
        name: byEmail.name || name,
        avatarUrl: byEmail.avatarUrl || avatarUrl,
        emailVerified: byEmail.emailVerified ?? new Date(),
      },
    });
  }

  if (oid) {
    const byOid = await prisma.user.findUnique({ where: { microsoftOid: oid } });
    if (byOid) {
      return prisma.user.update({
        where: { id: byOid.id },
        data: {
          email,
          name: name ?? byOid.name,
          avatarUrl: avatarUrl ?? byOid.avatarUrl,
          emailVerified: byOid.emailVerified ?? new Date(),
        },
      });
    }
  }

  return prisma.user.create({
    data: {
      email,
      name,
      avatarUrl,
      microsoftOid: oid || null,
      role: "STUDENT" satisfies Role,
      emailVerified: new Date(),
    },
  });
}

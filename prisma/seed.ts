import { PrismaClient, Role, ItemStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash("UniFindAdmin123!", 10);
  const bienestarHash = await bcrypt.hash("UniFindBienestar123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "vigilancia@unilibre.edu.co" },
    update: { role: Role.ADMIN, passwordHash: adminHash, name: "Portería Principal" },
    create: {
      email: "vigilancia@unilibre.edu.co",
      name: "Portería Principal",
      role: Role.ADMIN,
      passwordHash: adminHash,
    },
  });

  await prisma.user.upsert({
    where: { email: "bienestar@unilibre.edu.co" },
    update: { role: Role.SUPERUSER, passwordHash: bienestarHash, name: "Bienestar Universitario" },
    create: {
      email: "bienestar@unilibre.edu.co",
      name: "Bienestar Universitario",
      role: Role.SUPERUSER,
      passwordHash: bienestarHash,
    },
  });

  const existingSample = await prisma.item.findFirst({
    where: { qrCode: "UNIFIND-SEED-LLAVES" },
  });

  if (!existingSample) {
    await prisma.item.create({
      data: {
        qrCode: "UNIFIND-SEED-LLAVES",
        category: "Llaves",
        foundLocation: "Bloque B - Salón 302",
        foundDate: new Date(),
        custodyStation: "Portería Principal",
        shelfLocation: "Estante 1 - Casillero A",
        status: ItemStatus.EN_BODEGA,
        registeredById: admin.id,
      },
    });
  }

  console.log("Seed UniFind listo: vigilancia y Bienestar creados.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/auth-guards";
import { isDataUrlImage, isValidEmail, normalizeEmail, truncate } from "@/lib/validation";

export async function processDeliveryAction({
  qrCode,
  studentEmail,
  studentName,
  signatureData,
}: {
  qrCode: string;
  studentEmail: string;
  studentName?: string;
  signatureData: string;
}) {
  let session;

  try {
    session = await requireStaffSession();
  } catch {
    return { error: "Debes iniciar sesión como vigilante o Bienestar." };
  }

  const normalizedQr = qrCode.trim();
  const email = normalizeEmail(studentEmail);
  const name = truncate(studentName ?? "", 120);

  if (!normalizedQr || !email || !signatureData) {
    return { error: "Todos los datos de verificación y firma son requeridos." };
  }

  if (!isValidEmail(email)) {
    return { error: "El correo del estudiante no es válido." };
  }

  if (!isDataUrlImage(signatureData)) {
    return { error: "La firma digital no tiene un formato válido." };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({
        where: { qrCode: normalizedQr },
      });

      if (!item) {
        return { error: "Objeto no encontrado con el código QR escaneado." };
      }

      if (item.status === "ENTREGADO") {
        return { error: "Este objeto ya ha sido entregado anteriormente." };
      }

      const student = await tx.user.upsert({
        where: { email },
        update: name ? { name } : {},
        create: {
          email,
          name: name || "Estudiante",
          role: "STUDENT",
        },
      });

      const deliveryLog = await tx.deliveryLog.create({
        data: {
          itemId: item.id,
          officerId: session.user.id,
          studentId: student.id,
          signatureData,
        },
      });

      await tx.item.update({
        where: { id: item.id },
        data: { status: "ENTREGADO" },
      });

      return { success: true as const, deliveryLogId: deliveryLog.id };
    });

    if ("error" in result && result.error) {
      return { error: result.error };
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/bienestar");
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Error al procesar la entrega presencial:", error);
    return { error: "No se pudo registrar la entrega presencial." };
  }
}

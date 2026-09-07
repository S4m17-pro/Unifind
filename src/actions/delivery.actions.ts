"use server";

import { revalidatePath } from "next/cache";
import { actionError, actionOk, type ActionResult } from "@/lib/action-result";
import { withStaffSession } from "@/lib/auth/guards";
import { upsertCommunityUser } from "@/lib/domain/users";
import { prisma } from "@/lib/prisma";
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
}): Promise<ActionResult<{ deliveryLogId: string }>> {
  return withStaffSession(async (session) => {
    const normalizedQr = qrCode.trim();
    const email = normalizeEmail(studentEmail);
    const name = truncate(studentName ?? "", 120);

    if (!normalizedQr || !email || !signatureData) {
      return actionError("Todos los datos de verificación y firma son requeridos.");
    }

    if (!isValidEmail(email)) {
      return actionError("El correo del estudiante no es válido.");
    }

    if (!isDataUrlImage(signatureData)) {
      return actionError("La firma digital no tiene un formato válido.");
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const item = await tx.item.findUnique({
          where: { qrCode: normalizedQr },
        });

        if (!item) {
          return actionError("Objeto no encontrado con el código QR escaneado.");
        }

        if (item.status === "ENTREGADO") {
          return actionError("Este objeto ya ha sido entregado anteriormente.");
        }

        const student = await upsertCommunityUser({ email, name }, tx);

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

        return actionOk({ deliveryLogId: deliveryLog.id });
      });

      if ("error" in result) {
        return result;
      }

      revalidatePath("/admin/dashboard");
      revalidatePath("/bienestar");
      revalidatePath("/");
      return result;
    } catch (error) {
      console.error("Error al procesar la entrega presencial:", error);
      return actionError("No se pudo registrar la entrega presencial.");
    }
  });
}

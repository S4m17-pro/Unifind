"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function processDeliveryAction({
  qrCode,
  studentEmail,
  officerId,
  signatureData,
}: {
  qrCode: string;
  studentEmail: string;
  officerId: string;
  signatureData: string;
}) {
  if (!qrCode || !studentEmail || !officerId || !signatureData) {
    return { error: "Todos los datos de verificación y firma son requeridos." };
  }

  try {
    // Buscar el objeto por código QR
    const item = await prisma.item.findUnique({
      where: { qrCode },
    });

    if (!item) {
      return { error: "Objeto no encontrado con el código QR escaneado." };
    }

    if (item.status === "ENTREGADO") {
      return { error: "Este objeto ya ha sido entregado anteriormente." };
    }

    // Buscar o verificar estudiante
    const student = await prisma.user.findUnique({
      where: { email: studentEmail },
    });

    if (!student) {
      return { error: "El estudiante especificado no se encuentra registrado." };
    }

    // Registrar bitácora de entrega con firma digital
    const deliveryLog = await prisma.deliveryLog.create({
      data: {
        itemId: item.id,
        officerId,
        studentId: student.id,
        signatureData,
      },
    });

    // Actualizar estado del objeto
    await prisma.item.update({
      where: { id: item.id },
      data: { status: "ENTREGADO" },
    });

    revalidatePath("/admin/dashboard");
    return { success: true, deliveryLogId: deliveryLog.id };
  } catch (error) {
    console.error("Error al procesar la entrega presencial:", error);
    return { error: "No se pudo registrar la entrega presencial." };
  }
}

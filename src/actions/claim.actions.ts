"use server";

import { revalidatePath } from "next/cache";
import { actionError, actionOk, type ActionResult } from "@/lib/action-result";
import { withStaffSession } from "@/lib/auth/guards";
import { upsertCommunityUser } from "@/lib/domain/users";
import { notifyClaimByEmail } from "@/lib/notifications/claim-email";
import { prisma } from "@/lib/prisma";
import { isValidEmail, normalizeEmail, truncate } from "@/lib/validation";

export async function submitClaimAction(
  formData: FormData,
): Promise<ActionResult<{ claimId: string }>> {
  const itemId = String(formData.get("itemId") ?? "");
  const studentEmail = normalizeEmail(String(formData.get("studentEmail") ?? ""));
  const studentName = truncate(String(formData.get("studentName") ?? "Estudiante"), 120);
  const description = truncate(String(formData.get("description") ?? ""), 2000);

  if (!itemId || !studentEmail || !description) {
    return actionError("Todos los campos obligatorios deben ser diligenciados.");
  }

  if (!isValidEmail(studentEmail)) {
    return actionError("El correo institucional no es válido.");
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: {
        id: true,
        qrCode: true,
        category: true,
        foundLocation: true,
        custodyStation: true,
        shelfLocation: true,
        status: true,
      },
    });

    if (!item || item.status === "ENTREGADO") {
      return actionError("Este objeto ya no está disponible para reclamo.");
    }

    const student = await upsertCommunityUser({
      email: studentEmail,
      name: studentName,
    });

    const existingPending = await prisma.claimRequest.findFirst({
      where: {
        itemId: item.id,
        studentId: student.id,
        status: "PENDING",
      },
    });

    if (existingPending) {
      return actionError("Ya tienes una solicitud pendiente para este objeto.");
    }

    const claim = await prisma.claimRequest.create({
      data: {
        itemId: item.id,
        studentId: student.id,
        description,
        status: "PENDING",
      },
    });

    try {
      await notifyClaimByEmail({
        studentName,
        studentEmail,
        description,
        qrCode: item.qrCode,
        category: item.category,
        foundLocation: item.foundLocation,
        custodyStation: item.custodyStation,
        shelfLocation: item.shelfLocation,
      });
    } catch (emailError) {
      console.error("El reclamo se guardó, pero falló el correo:", emailError);
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return actionOk({ claimId: claim.id });
  } catch (error) {
    console.error("Error al procesar reclamo:", error);
    return actionError("Ocurrió un error al enviar el formulario de reclamo.");
  }
}

export async function reviewClaimAction(
  claimId: string,
  status: "APPROVED" | "REJECTED",
): Promise<ActionResult> {
  return withStaffSession(async () => {
    if (!claimId || (status !== "APPROVED" && status !== "REJECTED")) {
      return actionError("Solicitud de revisión inválida.");
    }

    try {
      const claim = await prisma.claimRequest.findUnique({
        where: { id: claimId },
        select: { id: true, status: true },
      });

      if (!claim) {
        return actionError("La solicitud de reclamo no existe.");
      }

      if (claim.status !== "PENDING") {
        return actionError("Esta solicitud ya fue revisada.");
      }

      await prisma.claimRequest.update({
        where: { id: claimId },
        data: { status },
      });

      revalidatePath("/admin/dashboard");
      revalidatePath("/bienestar");
      return actionOk();
    } catch (error) {
      console.error("Error al revisar reclamo:", error);
      return actionError("No se pudo actualizar el reclamo.");
    }
  });
}

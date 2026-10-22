"use server";

import { revalidatePath } from "next/cache";
import type { ClaimStatus } from "@prisma/client";
import { actionError, actionOk, type ActionResult } from "@/lib/action-result";
import { withStaffSession } from "@/lib/auth/guards";
import { upsertCommunityUser } from "@/lib/domain/users";
import { notifyClaimByEmail } from "@/lib/notifications/claim-email";
import { prisma } from "@/lib/prisma";
import {
  isInstitutionalEmail,
  isValidEmail,
  normalizeEmail,
  truncate,
} from "@/lib/validation";

export async function submitClaimAction(
  formData: FormData,
): Promise<ActionResult<{ claimId: string }>> {
  const itemId = String(formData.get("itemId") ?? "");
  const studentEmail = normalizeEmail(String(formData.get("studentEmail") ?? ""));
  const studentName = truncate(String(formData.get("studentName") ?? "Estudiante"), 120);
  const description = truncate(String(formData.get("description") ?? ""), 1600);
  const distinctiveMarks = truncate(String(formData.get("distinctiveMarks") ?? ""), 500);
  const serialNumber = truncate(String(formData.get("serialNumber") ?? ""), 120);
  const unlockCode = truncate(String(formData.get("unlockCode") ?? ""), 120);

  if (!itemId || !studentEmail || !description) {
    return actionError("Todos los campos obligatorios deben ser diligenciados.");
  }

  if (!isValidEmail(studentEmail)) {
    return actionError("El correo institucional no es válido.");
  }

  if (!isInstitutionalEmail(studentEmail)) {
    return actionError(
      "El reclamo debe hacerse con tu correo institucional @unilibre.edu.co.",
    );
  }

  const evidence = [
    serialNumber ? `Serie / IMEI / placa: ${serialNumber}` : null,
    distinctiveMarks ? `Marcas distintivas: ${distinctiveMarks}` : null,
    unlockCode ? `Clave de desbloqueo: ${unlockCode}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const fullDescription = truncate(
    [description, evidence].filter(Boolean).join("\n\n"),
    2000,
  );

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
        description: fullDescription,
        status: "PENDING",
      },
    });

    try {
      await notifyClaimByEmail({
        studentName,
        studentEmail,
        description: fullDescription,
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

export type ClaimLookupResult = {
  reference: string;
  status: ClaimStatus;
  createdAt: Date;
  updatedAt: Date;
  item: {
    category: string;
    foundLocation: string;
    foundDate: Date;
    custodyStation: string;
  };
};

export async function lookupClaimAction(
  formData: FormData,
): Promise<ActionResult<{ claim: ClaimLookupResult }>> {
  const reference = String(formData.get("reference") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));

  if (!reference || !email) {
    return actionError("Escribe el correo con el que reclamaste y el código de radicado.");
  }

  if (!isValidEmail(email)) {
    return actionError("Ese correo no parece válido. Revisa el que usaste en el reclamo.");
  }

  try {
    const claim = await prisma.claimRequest.findFirst({
      where: {
        id: reference,
        student: { email },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        item: {
          select: {
            category: true,
            foundLocation: true,
            foundDate: true,
            custodyStation: true,
          },
        },
      },
    });

    if (!claim) {
      return actionError(
        "No encontramos un reclamo con esos datos. Verifica el código de radicado y el correo.",
      );
    }

    return actionOk({
      claim: {
        reference: claim.id,
        status: claim.status,
        createdAt: claim.createdAt,
        updatedAt: claim.updatedAt,
        item: claim.item,
      },
    });
  } catch (error) {
    console.error("Error al consultar reclamo:", error);
    return actionError("No pudimos consultar el reclamo en este momento.");
  }
}

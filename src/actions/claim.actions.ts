"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getResendClient } from "@/lib/resend";
import { requireStaffSession } from "@/lib/auth-guards";
import { escapeHtml } from "@/lib/html";
import { isValidEmail, normalizeEmail, truncate } from "@/lib/validation";

async function notifyClaimByEmail(params: {
  studentName: string;
  studentEmail: string;
  description: string;
  qrCode: string;
  category: string;
  foundLocation: string;
  custodyStation: string;
  shelfLocation: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY no configurada: se omite el correo de reclamo.");
    return;
  }

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@unifind.edu.co";
  const safeName = escapeHtml(params.studentName);
  const safeEmail = escapeHtml(params.studentEmail);
  const safeDescription = escapeHtml(params.description);

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "UniFind <onboarding@resend.dev>",
    to: [adminEmail],
    subject: `Nuevo reclamo de objeto perdido - ${params.qrCode}`,
    html: `
      <h2>Nuevo formulario de reclamo registrado</h2>
      <p><strong>Estudiante:</strong> ${safeName} (${safeEmail})</p>
      <p><strong>Categoría:</strong> ${escapeHtml(params.category)}</p>
      <p><strong>Lugar del hallazgo:</strong> ${escapeHtml(params.foundLocation)}</p>
      <p><strong>Custodia actual:</strong> ${escapeHtml(params.custodyStation)} (${escapeHtml(params.shelfLocation)})</p>
      <hr />
      <h3>Descripción detallada provista por el estudiante</h3>
      <blockquote style="background: #f4f4f5; padding: 12px; border-left: 4px solid #2563eb;">
        ${safeDescription}
      </blockquote>
      <p>Accede al panel de UniFind para validar los detalles y proceder con la entrega presencial.</p>
    `,
  });
}

export async function submitClaimAction(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const studentEmail = normalizeEmail(String(formData.get("studentEmail") ?? ""));
  const studentName = truncate(String(formData.get("studentName") ?? "Estudiante"), 120);
  const description = truncate(String(formData.get("description") ?? ""), 2000);

  if (!itemId || !studentEmail || !description) {
    return { error: "Todos los campos obligatorios deben ser diligenciados." };
  }

  if (!isValidEmail(studentEmail)) {
    return { error: "El correo institucional no es válido." };
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
      return { error: "Este objeto ya no está disponible para reclamo." };
    }

    const student = await prisma.user.upsert({
      where: { email: studentEmail },
      update: { name: studentName },
      create: {
        email: studentEmail,
        name: studentName,
        role: "STUDENT",
      },
    });

    const existingPending = await prisma.claimRequest.findFirst({
      where: {
        itemId: item.id,
        studentId: student.id,
        status: "PENDING",
      },
    });

    if (existingPending) {
      return { error: "Ya tienes una solicitud pendiente para este objeto." };
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
    return { success: true, claimId: claim.id };
  } catch (error) {
    console.error("Error al procesar reclamo:", error);
    return { error: "Ocurrió un error al enviar el formulario de reclamo." };
  }
}

export async function reviewClaimAction(claimId: string, status: "APPROVED" | "REJECTED") {
  try {
    await requireStaffSession();
  } catch {
    return { error: "Debes iniciar sesión como vigilante o Bienestar." };
  }

  if (!claimId || (status !== "APPROVED" && status !== "REJECTED")) {
    return { error: "Solicitud de revisión inválida." };
  }

  try {
    const claim = await prisma.claimRequest.findUnique({
      where: { id: claimId },
      select: { id: true, status: true },
    });

    if (!claim) {
      return { error: "La solicitud de reclamo no existe." };
    }

    if (claim.status !== "PENDING") {
      return { error: "Esta solicitud ya fue revisada." };
    }

    await prisma.claimRequest.update({
      where: { id: claimId },
      data: { status },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/bienestar");
    return { success: true };
  } catch (error) {
    console.error("Error al revisar reclamo:", error);
    return { error: "No se pudo actualizar el reclamo." };
  }
}

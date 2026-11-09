"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getResendClient } from "@/lib/resend";
import { requireStaffSession, getSignedInRole } from "@/lib/auth-guards";
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

function appBaseUrl(): string {
  const raw =
    process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

async function notifyStudentClaimReceived(params: {
  studentName: string;
  studentEmail: string;
  category: string;
  custodyStation: string;
  foundLocation: string;
  itemId: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    console.warn(
      "RESEND_API_KEY no configurada: se omite la confirmación de reclamo al estudiante.",
    );
    return;
  }

  const itemUrl = `${appBaseUrl()}/objetos/${params.itemId}`;
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "UniFind <onboarding@resend.dev>",
    to: [params.studentEmail],
    subject: `Recibimos tu reclamo - ${params.category}`,
    html: `
      <h2>Recibimos tu reclamo</h2>
      <p>Hola ${escapeHtml(params.studentName)},</p>
      <p>Registramos tu reclamo. Portería comparará tu descripción con el objeto en
      custodia y te avisará por este mismo correo cuando lo revise.</p>
      <ul>
        <li><strong>Categoría:</strong> ${escapeHtml(params.category)}</li>
        <li><strong>Portería:</strong> ${escapeHtml(params.custodyStation)}</li>
        <li><strong>Hallazgo:</strong> ${escapeHtml(params.foundLocation)}</li>
      </ul>
      <p><a href="${itemUrl}">Ver el objeto en el catálogo</a></p>
      <p>Si el reclamo se aprueba, acércate con tu carnet institucional para la entrega.</p>
    `,
  });
}

async function notifyStudentClaimReview(params: {
  studentName: string;
  studentEmail: string;
  status: "APPROVED" | "REJECTED";
  category: string;
  custodyStation: string;
  foundLocation: string;
  itemId: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    console.warn(
      "RESEND_API_KEY no configurada: se omite el correo de resultado al estudiante.",
    );
    return;
  }

  const itemUrl = `${appBaseUrl()}/objetos/${params.itemId}`;
  const approved = params.status === "APPROVED";

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "UniFind <onboarding@resend.dev>",
    to: [params.studentEmail],
    subject: approved
      ? `Tu reclamo fue aprobado - ${params.category}`
      : `Tu reclamo no fue aprobado - ${params.category}`,
    html: approved
      ? `
        <h2>Tu reclamo fue aprobado</h2>
        <p>Hola ${escapeHtml(params.studentName)},</p>
        <p>Revisamos tu reclamo y la descripción coincide con el objeto en custodia.</p>
        <ul>
          <li><strong>Categoría:</strong> ${escapeHtml(params.category)}</li>
          <li><strong>Portería:</strong> ${escapeHtml(params.custodyStation)}</li>
          <li><strong>Hallazgo:</strong> ${escapeHtml(params.foundLocation)}</li>
        </ul>
        <p><strong>Acércate con tu carnet institucional a ${escapeHtml(params.custodyStation)}.</strong>
        El vigilante verificará tu identidad, escaneará el código QR del objeto y firmarás la entrega.</p>
      `
      : `
        <h2>Tu reclamo no fue aprobado</h2>
        <p>Hola ${escapeHtml(params.studentName)},</p>
        <p>Tras comparar la descripción con el objeto en custodia, los detalles no coincidieron.</p>
        <p>Si crees que el objeto sí es tuyo, puedes volver a reclamarlo con más detalle
        (marcas, seriales, stickers o rasguños que solo tú conozcas).</p>
        <p><a href="${itemUrl}">Volver a ver el objeto</a></p>
      `,
  });
}

export async function submitClaimAction(formData: FormData) {
  // Regla §4: el personal (ADMIN/SUPERUSER) es custodio y no reclama objetos.
  // Ocultar el botón no basta: el servidor siempre revalida el rol.
  const role = await getSignedInRole();
  if (role === "ADMIN" || role === "SUPERUSER") {
    return { error: "El personal no registra reclamos desde el catálogo público." };
  }

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

    try {
      await notifyStudentClaimReceived({
        studentName,
        studentEmail,
        category: item.category,
        custodyStation: item.custodyStation,
        foundLocation: item.foundLocation,
        itemId: item.id,
      });
    } catch (emailError) {
      console.error(
        "El reclamo se guardó, pero falló la confirmación al estudiante:",
        emailError,
      );
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
      select: {
        id: true,
        status: true,
        item: {
          select: {
            id: true,
            category: true,
            custodyStation: true,
            foundLocation: true,
          },
        },
        student: { select: { name: true, email: true } },
      },
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

    try {
      await notifyStudentClaimReview({
        studentName: claim.student.name || "Estudiante",
        studentEmail: claim.student.email,
        status,
        category: claim.item.category,
        custodyStation: claim.item.custodyStation,
        foundLocation: claim.item.foundLocation,
        itemId: claim.item.id,
      });
    } catch (emailError) {
      console.error(
        "El reclamo se actualizó, pero falló el correo de resultado al estudiante:",
        emailError,
      );
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/bienestar");
    return { success: true };
  } catch (error) {
    console.error("Error al revisar reclamo:", error);
    return { error: "No se pudo actualizar el reclamo." };
  }
}

"use server";

import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { revalidatePath } from "next/cache";

export async function submitClaimAction(formData: FormData) {
  const itemId = formData.get("itemId") as string;
  const studentEmail = formData.get("studentEmail") as string;
  const studentName = formData.get("studentName") as string;
  const description = formData.get("description") as string;

  if (!itemId || !studentEmail || !description) {
    return { error: "Todos los campos obligatorios deben ser diligenciados." };
  }

  try {
    // Buscar o crear usuario estudiante
    let student = await prisma.user.findUnique({
      where: { email: studentEmail },
    });

    if (!student) {
      student = await prisma.user.create({
        data: {
          email: studentEmail,
          name: studentName || "Estudiante",
          role: "STUDENT",
        },
      });
    }

    // Crear la solicitud de reclamo
    const claim = await prisma.claimRequest.create({
      data: {
        itemId,
        studentId: student.id,
        description,
        status: "PENDING",
      },
      include: {
        item: true,
      },
    });

    // Enviar correo electrónico vía Resend al administrador / portería
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@unifind.edu.co";
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "UniFind <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `🚨 Nuevo Reclamo de Objeto Perdido - ID #${claim.item.qrCode}`,
      html: `
        <h2>Nuevo Formulario de Reclamo Registrado</h2>
        <p><strong>Estudiante:</strong> ${studentName} (${studentEmail})</p>
        <p><strong>Categoría Objeto:</strong> ${claim.item.category}</p>
        <p><strong>Lugar del hallazgo:</strong> ${claim.item.foundLocation}</p>
        <p><strong>Custodia actual:</strong> ${claim.item.custodyStation} (${claim.item.shelfLocation})</p>
        <hr />
        <h3>Descripción detallada provista por el estudiante:</h3>
        <blockquote style="background: #f4f4f5; padding: 12px; border-left: 4px solid #2563eb;">
          ${description}
        </blockquote>
        <br />
        <p>Accede al panel de UniFind para validar los detalles y proceder con la entrega presencial.</p>
      `,
    });

    revalidatePath("/");
    return { success: true, claimId: claim.id };
  } catch (error) {
    console.error("Error al procesar reclamo:", error);
    return { error: "Ocurrió un error al enviar el formulario de reclamo." };
  }
}

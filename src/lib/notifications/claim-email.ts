import { escapeHtml } from "@/lib/html";
import { getResendClient } from "@/lib/resend";

export async function notifyClaimByEmail(params: {
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

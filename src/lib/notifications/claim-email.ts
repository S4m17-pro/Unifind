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

function appBaseUrl(): string {
  const raw =
    process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export async function notifyStudentClaimReceived(params: {
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

  const itemUrl = `${appBaseUrl()}/objetos/${encodeURIComponent(params.itemId)}`;
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

export async function notifyStudentClaimReview(params: {
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

  const itemUrl = `${appBaseUrl()}/objetos/${encodeURIComponent(params.itemId)}`;
  const approved = params.status === "APPROVED";
  const details = `
    <ul>
      <li><strong>Categoría:</strong> ${escapeHtml(params.category)}</li>
      <li><strong>Portería:</strong> ${escapeHtml(params.custodyStation)}</li>
      <li><strong>Hallazgo:</strong> ${escapeHtml(params.foundLocation)}</li>
    </ul>
  `;

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
        ${details}
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

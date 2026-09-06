import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import SignOutControl from "@/components/auth/SignOutControl";
import { Button } from "@/components/ui/button";
import { roleDuty, roleLabel, staffHomePath } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Esta pantalla no te corresponde",
  description:
    "UniFind reserva el panel a vigilancia de portería y a Bienestar Universitario en Universidad Libre Barranquilla.",
};

export default async function UnauthorizedPage() {
  const session = await auth();
  const role = session?.user?.role;
  const homePath = staffHomePath(role);

  if (!session?.user) {
    return (
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-lg border border-line bg-paper p-8 text-center shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
            UniFind · Barranquilla
          </p>
          <h1 className="mb-3 font-serif text-2xl font-semibold text-ink">
            Esta pantalla es del personal de campus
          </h1>
          <p className="mb-6 text-sm text-ink-muted">
            El panel de custodia lo usa vigilancia de portería y Bienestar
            Universitario. Si llegaste por un enlace interno, entra con tu cuenta
            de personal. Si buscas algo que perdiste, el catálogo público es el
            camino, sin fotos ni sesión.
          </p>
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Button asChild>
              <Link href="/objetos">Ir al catálogo</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Soy personal de campus</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (role === "ADMIN") {
    return (
      <UnauthorizedCard
        eyebrow="Sesión de portería"
        title="Esta ruta es de Bienestar"
        body={`${session.user.name || session.user.email} tiene turno de ${roleLabel(role)}: ${roleDuty(role)}. Las métricas y el reporte de donación los ve solo Bienestar Universitario.`}
        primaryHref="/admin/dashboard"
        primaryLabel="Volver a vigilancia"
      />
    );
  }

  if (role === "SUPERUSER") {
    return (
      <UnauthorizedCard
        eyebrow="Sesión de Bienestar"
        title="Esta pantalla no abre con tu turno"
        body={`${session.user.name || session.user.email} entra como ${roleLabel(role)}. Si necesitabas otra oficina, vuelve a tu panel o cierra la sesión en este navegador.`}
        primaryHref={homePath}
        primaryLabel="Ir a Bienestar"
      />
    );
  }

  return (
    <UnauthorizedCard
      eyebrow="Comunidad Unilibre"
      title="Esta oficina no es para estudiantes"
      body={`Hay una sesión de ${roleLabel(role)}, pero no abre bodega ni donaciones. El catálogo y el reclamo por correo son tu camino. Si te prestaron un equipo de portería, cierra esta sesión.`}
      primaryHref="/objetos"
      primaryLabel="Ir al catálogo"
    />
  );
}

function UnauthorizedCard({
  eyebrow,
  title,
  body,
  primaryHref,
  primaryLabel,
}: {
  eyebrow: string;
  title: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
}) {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-lg border border-line bg-paper p-8 text-center shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
          {eyebrow}
        </p>
        <h1 className="mb-3 font-serif text-2xl font-semibold text-ink">{title}</h1>
        <p className="mb-6 text-sm text-ink-muted">{body}</p>
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Button asChild>
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          <SignOutControl>Cerrar sesión</SignOutControl>
        </div>
      </div>
    </main>
  );
}

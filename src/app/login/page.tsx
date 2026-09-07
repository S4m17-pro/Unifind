import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Info } from "lucide-react";
import { auth } from "@/auth";
import BrandImageSlot from "@/components/brand/BrandImageSlot";
import LoginForm from "@/components/auth/LoginForm";
import SignOutControl from "@/components/auth/SignOutControl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { isMicrosoftEntraConfigured } from "@/lib/auth/microsoft";
import { brand } from "@/lib/brand";
import { roleDuty, roleLabel, staffHomePath } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Entrar al panel",
  description:
    "Acceso de vigilancia y Bienestar Universitario a UniFind, Universidad Libre Barranquilla.",
};

function errorFromAuthParam(error?: string) {
  switch (error) {
    case "CredentialsSignin":
      return "Ese correo o la contraseña no coinciden. Esta puerta es solo para vigilancia y Bienestar.";
    case "AccessDenied":
      return "Esa cuenta de Microsoft no está permitida. Usa el correo institucional de Unilibre o entra con correo y contraseña de personal.";
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
      return "No pudimos conectar con Microsoft. Intenta de nuevo o entra con correo y contraseña.";
    case "SessionRequired":
      return "La sesión se venció. Entra de nuevo para seguir en el panel.";
    case "Configuration":
      return "El acceso no está listo en este momento. Avisa a sistemas o a Bienestar.";
    default:
      return error ? "No pudimos abrir la sesión. Intenta de nuevo en un momento." : undefined;
  }
}

function destinationHint(callbackUrl: string) {
  if (callbackUrl.startsWith("/bienestar")) {
    return "Te pedimos la sesión porque ibas a métricas y donaciones de Bienestar Universitario.";
  }
  if (callbackUrl.startsWith("/admin")) {
    return "Te pedimos la sesión porque ibas al panel de portería: registro, reclamos y entregas.";
  }
  if (callbackUrl.startsWith("/dashboard")) {
    return "Después de entrar te llevamos al panel que te corresponde.";
  }
  return null;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const requestedCallback = params.callbackUrl?.startsWith("/") ? params.callbackUrl : undefined;
  const callbackUrl = requestedCallback ?? "/dashboard";

  if (session?.user?.role === "SUPERUSER" || session?.user?.role === "ADMIN") {
    redirect(callbackUrl.startsWith("/") ? callbackUrl : staffHomePath(session.user.role));
  }

  if (session?.user) {
    return (
      <LoginShell>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
          Sesión ya abierta
        </p>
        <h1 className="mb-2 font-serif text-2xl font-semibold text-ink">
          Esta cuenta no abre el panel
        </h1>
        <p className="mb-6 text-sm text-ink-muted">
          Hay una sesión de {roleLabel(session.user.role)} ({session.user.email}).{" "}
          {roleDuty(session.user.role)}. El registro de bodega y las métricas de
          donación son de portería y Bienestar.
        </p>
        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link href="/objetos">Ir al catálogo</Link>
          </Button>
          <SignOutControl>Cerrar esta sesión</SignOutControl>
        </div>
      </LoginShell>
    );
  }

  const hint = requestedCallback ? destinationHint(requestedCallback) : null;
  const microsoftEnabled = isMicrosoftEntraConfigured();

  return (
    <LoginShell>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
        Portería y Bienestar
      </p>
      <h1 className="mb-2 font-serif text-2xl font-semibold text-ink">
        Entrar a {brand.product}
      </h1>
      <p className="text-sm text-ink-muted">
        {brand.product} custodia los objetos perdidos de {brand.institution}{" "}
        {brand.seccional}. Esta puerta es para vigilancia de portería y para
        Bienestar Universitario.
        {microsoftEnabled
          ? " Estudiantes y personal con Microsoft 365 Educación pueden continuar con su cuenta institucional."
          : null}
      </p>
      {hint ? (
        <Alert variant="gold" className="mt-4">
          <Info />
          <AlertDescription>{hint}</AlertDescription>
        </Alert>
      ) : null}
      <div className="mt-6">
        <LoginForm
          callbackUrl={callbackUrl}
          initialError={errorFromAuthParam(params.error)}
          microsoftEnabled={microsoftEnabled}
        />
      </div>
      <p className="mt-6 border-t border-line pt-4 text-sm text-ink-muted">
        ¿Perdiste algo en el campus?{" "}
        <Link href="/objetos" className="font-semibold text-brand hover:text-brand-hover">
          Consulta el catálogo
        </Link>{" "}
        : no necesitas cuenta ni contraseña.
      </p>
    </LoginShell>
  );
}

function LoginShell({ children }: { children: ReactNode }) {
  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
        <aside className="flex flex-col gap-4">
          <BrandImageSlot slot="hero" variant="panel" className="lg:min-h-[280px]" />
          <div className="hidden rounded-lg border border-line bg-paper p-5 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
              {brand.seccional}
            </p>
            <p className="mt-2 font-serif text-lg font-semibold text-ink">
              Acceso de personal de campus
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              El catálogo público no pide sesión. Esta pantalla es solo para
              portería y Bienestar. La foto de campus es institucional: nunca
              una foto de objeto en custodia.
            </p>
          </div>
        </aside>
        <div className="rounded-lg border border-line bg-paper p-8 shadow-sm">
          {children}
        </div>
      </div>
    </main>
  );
}

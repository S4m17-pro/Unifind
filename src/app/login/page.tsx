import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Info } from "lucide-react";
import { auth } from "@/auth";
import LoginForm from "@/components/auth/LoginForm";
import SignOutControl from "@/components/auth/SignOutControl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
      return "Esa cuenta no abre esta pantalla. Si eres de la comunidad Unilibre, usa el catálogo.";
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
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-lg border border-line bg-paper p-8 shadow-sm">
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
        </div>
      </main>
    );
  }

  const hint = requestedCallback ? destinationHint(requestedCallback) : null;

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-line bg-paper p-8 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
          Portería y Bienestar
        </p>
        <h1 className="mb-2 font-serif text-2xl font-semibold text-ink">Entrar a UniFind</h1>
        <p className="text-sm text-ink-muted">
          UniFind custodia los objetos perdidos de Universidad Libre Barranquilla.
          Esta puerta es para vigilancia de portería y para Bienestar Universitario.
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
          />
        </div>
        <p className="mt-6 border-t border-line pt-4 text-sm text-ink-muted">
          ¿Perdiste algo en el campus?{" "}
          <Link href="/objetos" className="font-semibold text-brand hover:text-brand-hover">
            Consulta el catálogo
          </Link>{" "}
          : no necesitas cuenta ni contraseña.
        </p>
      </div>
    </main>
  );
}

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/dashboard";

  if (session?.user?.role === "SUPERUSER") {
    redirect(callbackUrl.startsWith("/") ? callbackUrl : "/bienestar");
  }

  if (session?.user?.role === "ADMIN") {
    redirect(callbackUrl.startsWith("/") ? callbackUrl : "/admin/dashboard");
  }

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-line bg-paper p-8 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
          Personal autorizado
        </p>
        <h1 className="mb-2 font-serif text-2xl font-semibold text-ink">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-ink-muted">
          Acceso para vigilancia (registro y entregas) y Bienestar Universitario (métricas y donaciones).
        </p>
        <LoginForm callbackUrl={callbackUrl.startsWith("/") ? callbackUrl : "/dashboard"} />
      </div>
    </main>
  );
}

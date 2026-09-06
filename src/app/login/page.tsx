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
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
          Personal autorizado
        </p>
        <h1 className="mb-2 text-2xl font-bold text-slate-100">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-slate-400">
          Acceso para vigilancia (registro y entregas) y Bienestar Universitario (métricas y donaciones).
        </p>
        <LoginForm callbackUrl={callbackUrl.startsWith("/") ? callbackUrl : "/dashboard"} />
      </div>
    </main>
  );
}

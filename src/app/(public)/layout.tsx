import LoginButton from "@/components/auth/LoginButton";
import FloatingBackdrop from "@/components/layout/FloatingBackdrop";
import { getSignedInRole } from "@/lib/auth-guards";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = await getSignedInRole();
  const isStaff = role === "ADMIN" || role === "SUPERUSER";

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] flex-col lg:pr-0">
      <FloatingBackdrop />
      {isStaff ? (
        <p className="border-b border-gold/40 bg-gold-soft px-4 py-1.5 text-center text-[11px] font-medium text-gold-ink sm:px-6">
          Vista pública de estudiantes ·{" "}
          {role === "SUPERUSER"
            ? "tu panel está en Bienestar"
            : "tu panel está en Vigilancia"}
        </p>
      ) : null}
      {role ? null : (
        <div className="relative z-[1] hidden h-16 border-b border-line bg-canvas lg:block">
          <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-end px-8">
            <LoginButton />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

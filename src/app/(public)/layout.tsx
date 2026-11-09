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
        <p className="border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-center text-[11px] font-medium text-amber-800 sm:px-6">
          Vista pública de estudiantes ·{" "}
          {role === "SUPERUSER"
            ? "tu panel está en Bienestar"
            : "tu panel está en Vigilancia"}
        </p>
      ) : null}
      {children}
    </div>
  );
}

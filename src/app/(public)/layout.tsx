import { getSignedInRole } from "@/lib/auth-guards";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = await getSignedInRole();
  const isStaff = role === "ADMIN" || role === "SUPERUSER";

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      {isStaff ? (
        <p className="border-b border-amber-900/50 bg-amber-950/40 px-4 py-1.5 text-center text-[11px] font-medium text-amber-300 sm:px-6">
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

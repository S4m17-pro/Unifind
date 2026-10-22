import type { ReactNode } from "react";
import { auth } from "@/auth";
import StaffWorkspace from "@/components/layout/StaffWorkspace";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERUSER")
  ) {
    return <>{children}</>;
  }

  let pendingClaims = 0;
  try {
    pendingClaims = await prisma.claimRequest.count({ where: { status: "PENDING" } });
  } catch {
    pendingClaims = 0;
  }

  return (
    <StaffWorkspace
      role={session.user.role}
      name={session.user.name}
      email={session.user.email}
      pendingClaims={pendingClaims}
    >
      {children}
    </StaffWorkspace>
  );
}

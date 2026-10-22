import type { ReactNode } from "react";
import { auth } from "@/auth";
import StaffWorkspace from "@/components/layout/StaffWorkspace";

export const dynamic = "force-dynamic";

export default async function BienestarLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "SUPERUSER") {
    return <>{children}</>;
  }

  return (
    <StaffWorkspace
      role={session.user.role}
      name={session.user.name}
      email={session.user.email}
    >
      {children}
    </StaffWorkspace>
  );
}

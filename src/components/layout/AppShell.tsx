import type { ReactNode } from "react";
import { auth } from "@/auth";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import AppFooter from "@/components/layout/AppFooter";
import InPageNav from "@/components/layout/InPageNav";

export default async function AppShell({ children }: { children: ReactNode }) {
  const session = await auth();
  const role = session?.user?.role;
  const isAuthed = Boolean(session?.user);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <InPageNav />

      <div className="flex flex-1 items-stretch">
        <div className="hidden shrink-0 self-stretch lg:flex">
          <AppSidebar
            role={role}
            isAuthed={isAuthed}
            name={session?.user?.name}
            email={session?.user?.email}
          />
        </div>

        <div className="min-w-0 flex-1">{children}</div>
      </div>

      <AppFooter />
    </div>
  );
}

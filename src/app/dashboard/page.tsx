import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardGatePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  if (session.user.role === "SUPERUSER") {
    redirect("/bienestar");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  redirect("/objetos");
}

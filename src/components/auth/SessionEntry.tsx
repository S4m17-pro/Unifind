import Link from "next/link";
import { LogIn } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

/**
 * Entry point to the staff login. Rendered at the top-left of the public pages
 * so it stays visible on both mobile and desktop. Hidden for signed-in users.
 */
export default async function SessionEntry() {
  const session = await auth();
  if (session?.user) return null;

  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/login">
        <LogIn className="size-4" aria-hidden />
        Iniciar sesión
      </Link>
    </Button>
  );
}

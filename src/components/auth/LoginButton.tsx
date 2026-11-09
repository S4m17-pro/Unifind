import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Entry point to the staff login. The caller decides when to render it:
 * mobile header for small screens, utility bar for desktop.
 */
export default function LoginButton() {
  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/login">
        <LogIn className="size-4" aria-hidden />
        Iniciar sesión
      </Link>
    </Button>
  );
}

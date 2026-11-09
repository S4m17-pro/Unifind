import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminItemNotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="mb-3 font-serif text-2xl font-semibold text-ink">Objeto no encontrado</h1>
      <p className="mb-6 text-sm text-ink-muted">
        No hay una ficha privada con ese identificador, o ya no está en inventario.
      </p>
      <Button asChild>
        <Link href="/admin/dashboard">Volver al panel de vigilancia</Link>
      </Button>
    </div>
  );
}

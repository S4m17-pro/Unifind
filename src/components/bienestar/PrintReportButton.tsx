"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintReportButton() {
  return (
    <div className="text-right">
      <Button type="button" onClick={() => window.print()} className="font-semibold">
        <Printer className="size-4" aria-hidden />
        Descargar PDF
      </Button>
      <p className="mt-1 text-xs text-ink-subtle">
        Elige «Guardar como PDF» en el diálogo de impresión.
      </p>
    </div>
  );
}

import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DbUnavailableNotice() {
  return (
    <Alert variant="gold">
      <AlertDescription>
        No pudimos cargar el catálogo en este momento. Intenta de nuevo en unos minutos o consulta
        directamente en portería.
      </AlertDescription>
    </Alert>
  );
}

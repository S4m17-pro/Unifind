"use client";

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { processDeliveryAction } from "@/actions/delivery.actions";
import { isActionFailure } from "@/lib/action-result";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QRScannerComponent from "./QRScannerComponent";

const fieldLabel = "text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted";

export default function DeliveryModule() {
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const [qrCode, setQrCode] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleClearSignature = () => {
    sigCanvasRef.current?.clear();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      setMessage({
        type: "error",
        text: "Pide al estudiante que firme en el espacio marcado antes de completar la entrega.",
      });
      return;
    }

    // `getTrimmedCanvas()` falla con trim-canvas 0.1.2 (interop UMD/ESM);
    // `toDataURL` es la API nativa del canvas y produce el PNG de la firma.
    const signatureData = sigCanvasRef.current.toDataURL("image/png");

    setLoading(true);
    const result = await processDeliveryAction({
      qrCode,
      studentEmail,
      studentName,
      signatureData,
    });
    setLoading(false);

    if (isActionFailure(result)) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "¡Entrega presencial registrada exitosamente!" });
      setQrCode("");
      setStudentEmail("");
      setStudentName("");
      handleClearSignature();
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
      <div>
        <QRScannerComponent onScanSuccess={(code) => setQrCode(code)} />
      </div>

      <div className="flex flex-col justify-between rounded-lg border border-line bg-paper p-6 shadow-sm sm:p-8">
        <div>
          {message ? (
            <Alert
              variant={message.type === "success" ? "success" : "destructive"}
              className="mb-6"
            >
              {message.type === "success" ? (
                <CheckCircle2 className="animate-icon-pop" aria-hidden />
              ) : (
                <AlertCircle aria-hidden />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qrCode" className={fieldLabel}>
                Código QR escaneado
              </Label>
              <Input
                id="qrCode"
                type="text"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                required
                placeholder="Escanea con la cámara o ingresa el código"
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentName" className={fieldLabel}>
                Nombre del estudiante receptor
              </Label>
              <Input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Opcional si ya reclamó por correo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentEmail" className={fieldLabel}>
                Correo institucional del receptor
              </Label>
              <Input
                id="studentEmail"
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                required
                placeholder="estudiante@unilibre.edu.co"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className={fieldLabel}>
                  Firma digital de conformidad
                </span>
                <Button
                  type="button"
                  variant="link"
                  size="xs"
                  onClick={handleClearSignature}
                  className="h-auto p-0"
                >
                  Limpiar firma
                </Button>
              </div>
              <div
                id="signature"
                className="overflow-hidden rounded-md border border-line bg-canvas"
              >
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor="#C8102E"
                  canvasProps={{
                    className: "w-full h-40 cursor-crosshair",
                    "aria-label": "Firma digital de conformidad",
                  }}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="success"
              disabled={loading}
              className="mt-4 h-11 w-full font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  Registrando entrega...
                </>
              ) : (
                "Confirmar y registrar entrega presencial"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

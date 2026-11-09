"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { processDeliveryAction } from "@/actions/delivery.actions";
import QRScannerComponent from "./QRScannerComponent";

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

    if (result.error) {
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

      <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_26px_60px_-40px_rgba(15,23,42,0.45)] sm:p-8">
        <div>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900">
            Bitácora de entrega presencial
          </h2>

          {message && (
            <div
              className={`mb-6 flex items-center gap-2 rounded-xl p-4 text-sm ${
                message.type === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="animate-icon-pop h-5 w-5 shrink-0" aria-hidden />
              ) : null}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Código QR escaneado
              </label>
              <input
                type="text"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                required
                placeholder="Escanea con la cámara o ingresa el código"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-sm text-slate-800 focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Nombre del estudiante receptor
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Opcional si ya reclamó por correo"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Correo institucional del receptor
              </label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                required
                placeholder="estudiante@unilibre.edu.co"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Firma digital de conformidad
                </label>
                <button
                  type="button"
                  onClick={handleClearSignature}
                  className="text-xs text-teal-700 underline hover:text-teal-800"
                >
                  Limpiar firma
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor="#38bdf8"
                  canvasProps={{
                    className: "w-full h-40 cursor-crosshair",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-emerald-600 py-3 font-medium text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Registrando entrega...
                </span>
              ) : (
                "Confirmar y registrar entrega presencial"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

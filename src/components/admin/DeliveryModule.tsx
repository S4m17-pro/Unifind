"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { processDeliveryAction } from "@/actions/delivery.actions";
import QRScannerComponent from "./QRScannerComponent";

export default function DeliveryModule({ officerId }: { officerId: string }) {
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const [qrCode, setQrCode] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleClearSignature = () => {
    sigCanvasRef.current?.clear();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      setMessage({ type: "error", text: "Por favor captura la firma digital del estudiante antes de completar la entrega." });
      return;
    }

    const signatureData = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");

    setLoading(true);
    const result = await processDeliveryAction({
      qrCode,
      studentEmail,
      officerId,
      signatureData,
    });
    setLoading(false);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "¡Entrega presencial registrada exitosamente!" });
      setQrCode("");
      setStudentEmail("");
      handleClearSignature();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Escáner Cámara QR */}
      <div>
        <QRScannerComponent onScanSuccess={(code) => setQrCode(code)} />
      </div>

      {/* Formulario de Verificación y Firma */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            ✍️ Bitácora de Entrega Presencial
          </h2>

          {message && (
            <div
              className={`p-4 rounded-xl mb-6 text-sm ${
                message.type === "success"
                  ? "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
                  : "bg-red-950/80 border border-red-800 text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Código QR Escaneado del Paquete / Objeto
              </label>
              <input
                type="text"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                required
                placeholder="Escanea con la cámara o ingresa código manualmente"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Correo Institucional del Estudiante Receptor
              </label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                required
                placeholder="estudiante@universidad.edu.co"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Firma Digital Canvas */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Firma Digital de Conformidad (Firma en pantalla)
                </label>
                <button
                  type="button"
                  onClick={handleClearSignature}
                  className="text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  Limpiar Firma
                </button>
              </div>
              <div className="border border-slate-800 bg-slate-950 rounded-xl overflow-hidden">
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
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {loading ? "Registrando Entrega..." : "Confirmar y Registrar Entrega Presencial"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

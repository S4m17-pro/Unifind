"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface Props {
  onScanSuccess: (decodedText: string) => void;
}

export default function QRScannerComponent({ onScanSuccess }: Props) {
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        setScannedResult(decodedText);
        onScanSuccess(decodedText);
        scanner.clear();
      },
      (error) => {
        // Ignorar escaneos parciales en curso
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [onScanSuccess]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
      <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center justify-center gap-2">
        📷 Escáner de Código QR
      </h3>

      <div id="qr-reader" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"></div>

      {scannedResult && (
        <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-sm font-mono">
          QR Detectado: {scannedResult}
        </div>
      )}
    </div>
  );
}

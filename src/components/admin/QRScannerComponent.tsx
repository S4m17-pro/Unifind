"use client";

import { useEffect, useState } from "react";
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
      false
    );

    scanner.render(
      (decodedText) => {
        setScannedResult(decodedText);
        onScanSuccess(decodedText);
        scanner.clear();
      },
      () => {
        // Ignorar escaneos parciales en curso
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [onScanSuccess]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-center shadow-2xl">
      <h3 className="mb-4 flex items-center justify-center gap-2 text-xl font-bold text-slate-100">
        Escáner de código QR
      </h3>

      <div id="qr-reader" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950" />

      {scannedResult && (
        <div className="mt-4 rounded-xl border border-emerald-800 bg-emerald-950/80 p-3 font-mono text-sm text-emerald-300">
          QR detectado: {scannedResult}
        </div>
      )}
    </div>
  );
}

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
    <div className="rounded-lg border border-line bg-paper p-6 text-center shadow-sm">
      <h3 className="mb-4 flex items-center justify-center gap-2 font-serif text-xl font-semibold text-ink">
        Escáner de código QR
      </h3>

      <div id="qr-reader" className="overflow-hidden rounded-lg border border-line bg-canvas" />

      {scannedResult && (
        <div className="mt-4 rounded-md border border-success/20 bg-success-soft p-3 font-mono text-sm text-success">
          QR detectado: {scannedResult}
        </div>
      )}
    </div>
  );
}

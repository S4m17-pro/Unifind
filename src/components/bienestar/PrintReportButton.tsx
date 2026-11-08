"use client";

export function PrintReportButton() {
  return (
    <div className="text-right">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        Descargar PDF
      </button>
      <p className="mt-1 text-xs text-slate-500">
        Elige «Guardar como PDF» en el diálogo de impresión.
      </p>
    </div>
  );
}

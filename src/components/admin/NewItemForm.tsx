"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createItemAction } from "@/actions/item.actions";

export default function NewItemForm({ officerId }: { officerId: string }) {
  const [loading, setLoading] = useState(false);
  const [createdItem, setCreatedItem] = useState<{ qrCode: string; category: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("registeredById", officerId);

    const res = await createItemAction(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.item) {
      setCreatedItem({ qrCode: res.item.qrCode, category: res.item.category });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
      <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        📦 Registro Privado de Objeto Perdido
      </h2>

      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 text-red-300 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {createdItem ? (
        <div className="text-center py-8 space-y-6">
          <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl">
            ¡Objeto registrado con éxito en bodega!
          </div>

          <div className="inline-block p-4 bg-white rounded-2xl shadow-xl">
            <QRCodeSVG value={createdItem.qrCode} size={200} />
          </div>

          <p className="text-slate-300 font-mono text-sm">
            Código QR: <strong className="text-blue-400">{createdItem.qrCode}</strong>
          </p>

          <button
            onClick={() => setCreatedItem(null)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all"
          >
            Registrar Otro Objeto
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Categoría
              </label>
              <input
                type="text"
                name="category"
                required
                placeholder="Ej. Electrónica, Documentos, Llaves"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Lugar de Hallazgo
              </label>
              <input
                type="text"
                name="foundLocation"
                required
                placeholder="Ej. Biblioteca - Piso 3"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Portería / Bodega Custodia
              </label>
              <input
                type="text"
                name="custodyStation"
                required
                placeholder="Ej. Portería Principal"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Ubicación Física en Bodega
              </label>
              <input
                type="text"
                name="shelfLocation"
                required
                placeholder="Ej. Estante 2 - Casillero B"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Foto Privada (Carga a Cloudinary)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-400 text-sm focus:outline-none focus:border-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-950 file:text-blue-400 hover:file:bg-blue-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50"
          >
            {loading ? "Procesando y generando QR..." : "Guardar en Bodega y Generar QR"}
          </button>
        </form>
      )}
    </div>
  );
}

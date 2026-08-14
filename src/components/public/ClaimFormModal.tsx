"use client";

import { useState } from "react";
import { submitClaimAction } from "@/actions/claim.actions";

interface Props {
  item: {
    id: string;
    category: string;
    foundLocation: string;
    custodyStation: string;
  };
}

export default function ClaimFormModal({ item }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.append("itemId", item.id);

    const result = await submitClaimAction(formData);
    setLoading(false);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({
        type: "success",
        text: "¡Solicitud de reclamo enviada con éxito! Se ha notificado al personal de portería vía correo electrónico.",
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-600/20"
      >
        Reclamar Objeto
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-slate-100 mb-1">
              Formulario de Reclamo
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Pertenencia: <span className="text-blue-400 font-semibold">{item.category}</span> hallado en {item.foundLocation}.
            </p>

            {message && (
              <div
                className={`p-4 rounded-xl mb-4 text-sm ${
                  message.type === "success"
                    ? "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
                    : "bg-red-950/80 border border-red-800 text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            {message?.type !== "success" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Tu Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    required
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Correo Institucional
                  </label>
                  <input
                    type="email"
                    name="studentEmail"
                    required
                    placeholder="estudiante@universidad.edu.co"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Descripción Detallada (Verificación de Privacidad)
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    placeholder="Describe características específicas que demuestren que te pertenece (marca, stickers, rasguños, contenido en caso de ser estuche o bolso)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? "Enviando..." : "Enviar Formulario"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

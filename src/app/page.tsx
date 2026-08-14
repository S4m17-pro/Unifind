import { prisma } from "@/lib/prisma";
import ClaimFormModal from "@/components/public/ClaimFormModal";

export const revalidate = 60; // Revalidar cada 60s
export const dynamic = 'force-dynamic';

export default async function PublicCatalogPage() {
  const items = await prisma.item.findMany({
    where: {
      status: "EN_BODEGA",
    },
    select: {
      id: true,
      category: true,
      foundLocation: true,
      foundDate: true,
      custodyStation: true,
      // NOTA PRIVACIDAD: No se seleccionan ni exponen descripciones ni fotos privadas
    },
    orderBy: {
      foundDate: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Hero */}
        <header className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-blue-950/80 border border-blue-800 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Portal Universitario de Objetos Perdidos
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
            Catálogo Genérico de Custodia UniFind
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Por políticas de seguridad y privacidad, las fotos y descripciones detalladas no son de acceso público. Consulta la categoría y ubicación para enviar tu solicitud de reclamo.
          </p>
        </header>

        {/* Grid de Items */}
        {items.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800/80 rounded-3xl">
            <p className="text-slate-400 text-lg">No hay objetos en custodia pendientes por reclamo actualmente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-slate-800 text-blue-400 text-xs font-semibold rounded-lg">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.foundDate).toLocaleDateString("es-CO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 mb-2">
                    Objeto en {item.custodyStation}
                  </h3>

                  <div className="space-y-1 text-sm text-slate-400 mb-6">
                    <p>
                      <strong className="text-slate-300">Lugar del Hallazgo:</strong> {item.foundLocation}
                    </p>
                    <p>
                      <strong className="text-slate-300">Portería de Custodia:</strong> {item.custodyStation}
                    </p>
                  </div>
                </div>

                <ClaimFormModal item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

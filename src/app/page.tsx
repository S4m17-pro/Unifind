import { prisma } from "@/lib/prisma";
import { PUBLIC_ITEM_SELECT } from "@/lib/public-catalog";
import ClaimFormModal from "@/components/public/ClaimFormModal";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function PublicCatalogPage() {
  const items = await prisma.item.findMany({
    where: {
      status: {
        in: ["EN_BODEGA", "LISTO_PARA_DONACION"],
      },
    },
    select: PUBLIC_ITEM_SELECT,
    orderBy: {
      foundDate: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full border border-blue-800 bg-blue-950/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400">
            Universidad Libre · Barranquilla
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
            Catálogo genérico de custodia UniFind
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-400 sm:text-base">
            Por políticas de seguridad y privacidad, las fotos, el estante interno y las
            descripciones detalladas no son de acceso público. Consulta la categoría, fecha/hora,
            bloque/salón y portería para enviar tu solicitud de reclamo.
          </p>
        </header>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 py-16 text-center">
            <p className="text-lg text-slate-400">
              No hay objetos en custodia pendientes por reclamo actualmente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-200 hover:border-blue-500/50"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-blue-400">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.foundDate).toLocaleString("es-CO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-slate-100">
                    Objeto en {item.custodyStation}
                  </h3>

                  <div className="mb-6 space-y-1 text-sm text-slate-400">
                    <p>
                      <strong className="text-slate-300">Bloque / salón:</strong> {item.foundLocation}
                    </p>
                    <p>
                      <strong className="text-slate-300">Portería de custodia:</strong>{" "}
                      {item.custodyStation}
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

import Link from "next/link";
import { ClipboardCheck, Search, Shield } from "lucide-react";
import { getCatalogPageData } from "@/lib/public-catalog";
import DbUnavailableNotice from "@/components/public/DbUnavailableNotice";
import ItemGrid from "@/components/public/ItemGrid";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    icon: Search,
    title: "Busca en el catálogo",
    body: "Filtra por categoría, portería y estado. No mostramos fotos ni detalles privados.",
  },
  {
    icon: ClipboardCheck,
    title: "Envía el reclamo",
    body: "Describe cómo reconoces el objeto y deja tu correo institucional.",
  },
  {
    icon: Shield,
    title: "Recógelo en portería",
    body: "El personal valida tu relato y te entrega el objeto con tu carnet.",
  },
] as const;

export default async function HomePage() {
  const { items, dbUnavailable } = await getCatalogPageData({
    status: "EN_BODEGA",
    limit: 6,
  });

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-16 text-center">
          <p className="mb-4 inline-block rounded-full border border-blue-800 bg-blue-950/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400">
            Universidad Libre · Barranquilla
          </p>
          <h1 className="mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
            ¿Perdiste algo en el campus?
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-sm text-slate-400 sm:text-base">
            UniFind es la consulta pública de objetos en custodia. Por privacidad no
            publicamos fotos ni descripciones internas: revisa categoría, fecha y portería,
            y reclama el que te corresponda.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/objetos"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-600/20 hover:bg-blue-500"
            >
              Ver catálogo
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Cómo reclamar
            </Link>
          </div>
        </section>

        <section id="como-funciona" className="mb-16 scroll-mt-24">
          <h2 className="mb-6 text-center text-2xl font-bold text-slate-100">
            Cómo funciona
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-blue-300">
                    <step.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Paso {index + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-100">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Recién en bodega</h2>
              <p className="mt-1 text-sm text-slate-400">
                Últimos objetos listos para reclamo. Sin fotos.
              </p>
            </div>
            <Link href="/objetos" className="text-sm font-medium text-blue-400 hover:text-blue-300">
              Ver todos
            </Link>
          </div>

          {dbUnavailable && (
            <div className="mb-6">
              <DbUnavailableNotice />
            </div>
          )}

          <ItemGrid
            items={items}
            emptyMessage="No hay objetos en custodia pendientes por reclamo actualmente."
          />
        </section>
      </div>
    </main>
  );
}

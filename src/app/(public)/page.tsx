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
    body: "Filtra por categoría, portería y estado y reclama el objeto que te corresponda.",
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
    status: "DISPONIBLES",
    limit: 6,
  });

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-16 text-center">
          <p className="mb-4 inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Universidad Libre · Barranquilla
          </p>
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
            ¿Perdiste algo en el campus?
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-sm text-slate-600 sm:text-base">
            Encuentra en UniFind los objetos que están guardados en portería. Revisa
            categoría, fecha de hallazgo, bloque y lugar de custodia, y reclama el tuyo en
            línea.
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
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Cómo reclamar
            </Link>
          </div>
        </section>

        <section id="como-funciona" className="mb-16 scroll-mt-24">
          <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">
            Cómo funciona
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <step.icon className="icon-hover-motion h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Paso {index + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Disponibles para reclamo</h2>
              <p className="mt-1 text-sm text-slate-600">
                Estos son los últimos objetos que ingresaron a portería.
              </p>
            </div>
            <Link href="/objetos" className="text-sm font-medium text-blue-700 hover:text-blue-800">
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

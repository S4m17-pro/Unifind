import Link from "next/link";
import { ArrowRight, ClipboardCheck, Search, Shield } from "lucide-react";
import { getCatalogPageData } from "@/lib/public-catalog";
import { ITEM_CATEGORIES } from "@/lib/constants";
import DbUnavailableNotice from "@/components/public/DbUnavailableNotice";
import ItemGrid from "@/components/public/ItemGrid";

export const dynamic = "force-dynamic";

const FLOAT_CLASSES = ["float-a", "float-b", "float-c"] as const;

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
        <section className="animate-fade-up relative mb-16 overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 px-6 py-12 text-center shadow-[0_40px_90px_-60px_rgba(15,23,42,0.55)] backdrop-blur-sm sm:px-10 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/70 to-transparent"
          />
          <p className="mb-4 inline-block rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700">
            Universidad Libre · Barranquilla
          </p>
          <h1 className="font-display mb-3 bg-gradient-to-r from-teal-800 to-emerald-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            ¿Perdiste algo en el campus?
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-sm text-slate-600 sm:text-base">
            Encuentra en UniFind los objetos que están guardados en portería. Revisa
            categoría, fecha de hallazgo, bloque y lugar de custodia, y reclama el tuyo en
            línea.
          </p>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {ITEM_CATEGORIES.slice(0, 6).map((category, index) => (
              <span
                key={category}
                className={`${FLOAT_CLASSES[index % FLOAT_CLASSES.length]} rounded-full border border-white/80 bg-white/85 px-3 py-1 text-xs font-medium text-teal-800 shadow-[0_10px_20px_-16px_rgba(15,23,42,0.5)]`}
              >
                {category}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/objetos"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-medium text-white shadow-[0_16px_30px_-18px_rgba(15,118,110,0.9)] transition-colors hover:bg-teal-600"
            >
              Ver catálogo
              <ArrowRight
                className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300/80 bg-white/70 px-5 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-white"
            >
              Cómo reclamar
            </Link>
          </div>
        </section>

        <section id="como-funciona" className="mb-16 scroll-mt-24">
          <h2 className="font-display mb-6 text-center text-2xl font-bold text-slate-900">
            Cómo funciona
          </h2>
          <div className="stagger-up grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="card-lift group rounded-2xl border border-white/80 bg-white p-6 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.45)]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
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
              <h2 className="font-display text-2xl font-bold text-slate-900">Disponibles para reclamo</h2>
              <p className="mt-1 text-sm text-slate-600">
                Estos son los últimos objetos que ingresaron a portería.
              </p>
            </div>
            <Link href="/objetos" className="text-sm font-medium text-teal-700 hover:text-teal-800">
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

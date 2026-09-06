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
    body: "Filtra por categoría, portería y estado. Sin fotos, QR ni estante interno.",
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
    <main>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
          <p className="mb-4 inline-block rounded-md border border-gold/40 bg-gold-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
            Universidad Libre · Barranquilla
          </p>
          <h1 className="mb-4 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            ¿Perdiste algo en el campus?
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-sm text-ink-muted sm:text-base">
            UniFind es la consulta pública de objetos en custodia. Por privacidad no
            publicamos fotos, QR ni el estante interno: revisa categoría, fecha/hora,
            bloque/salón y portería, y reclama el que te corresponda.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/objetos"
              className="inline-flex items-center justify-center rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
            >
              Ver catálogo
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-md border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
            >
              Cómo reclamar
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section id="como-funciona" className="mb-16 scroll-mt-28">
          <h2 className="mb-6 text-center font-serif text-2xl font-semibold text-ink">
            Cómo funciona
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="rounded-lg border border-line bg-paper p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-soft text-brand">
                    <step.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                    Paso {index + 1}
                  </span>
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold text-ink">{step.title}</h3>
                <p className="text-sm text-ink-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink">Disponibles para reclamo</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Últimos objetos en custodia. Sin fotos ni datos internos.
              </p>
            </div>
            <Link href="/objetos" className="text-sm font-semibold text-brand hover:text-brand-hover">
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

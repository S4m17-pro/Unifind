import Link from "next/link";
import { ClipboardCheck, Search, Shield } from "lucide-react";
import CampusHero from "@/components/brand/CampusHero";
import BrandImageSlot from "@/components/brand/BrandImageSlot";
import { SesionCerradaFlash } from "@/components/auth/AuthFlash";
import DbUnavailableNotice from "@/components/public/DbUnavailableNotice";
import ItemGrid from "@/components/public/ItemGrid";
import { getCatalogPageData } from "@/lib/public-catalog";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    icon: Search,
    title: "Busca en el catálogo",
    body: "Filtra por categoría, portería y estado. Sin fotos de objetos, QR ni estante interno.",
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
      <SesionCerradaFlash />
      <CampusHero />

      <div className="relative z-[1] bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div
            id="como-funciona"
            className="scroll-mt-[var(--app-header-offset)]"
          >
            <section
              id="como-reclamar"
              className="mb-16 scroll-mt-[var(--app-header-offset)]"
            >
              <div className="mb-8 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
                <div>
                  <div className="mb-4 flex gap-1" aria-hidden>
                    <span className="h-1 w-8 bg-brand" />
                    <span className="h-1 w-4 bg-gold" />
                  </div>
                  <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
                    Cómo funciona
                  </h2>
                  <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
                    Tres pasos entre el hallazgo en campus y la entrega en
                    portería. No necesitas cuenta de estudiante: el catálogo es
                    público.
                  </p>
                </div>
                <BrandImageSlot slot="howItWorks" variant="panel" />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {STEPS.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-lg border border-line bg-paper p-6"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-brand-soft text-brand">
                        <step.icon className="size-5" aria-hidden />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                        Paso {index + 1}
                      </span>
                    </div>
                    <h3 className="mb-2 font-serif text-lg font-semibold text-ink">
                      {step.title}
                    </h3>
                    <p className="text-sm text-ink-muted">{step.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-ink">
                  Disponibles para reclamo
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Últimos objetos en custodia. Sin fotos ni datos internos.
                </p>
              </div>
              <Link
                href="/objetos"
                className="text-sm font-semibold text-brand hover:text-brand-hover"
              >
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
      </div>
    </main>
  );
}

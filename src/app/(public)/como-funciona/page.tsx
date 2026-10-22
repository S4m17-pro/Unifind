import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck, Search, Shield } from "lucide-react";
import BrandImageSlot from "@/components/brand/BrandImageSlot";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description:
    "Conoce el proceso para buscar, reclamar y recoger objetos perdidos en Universidad Libre Seccional Barranquilla.",
};

const STEPS = [
  {
    icon: Search,
    title: "Busca en el catálogo",
    body: "Revisa el catálogo público filtrando por categoría, portería o estado. No mostramos fotos, códigos QR ni ubicación interna por privacidad.",
  },
  {
    icon: ClipboardCheck,
    title: "Envía tu reclamo",
    body: "Si reconoces tu objeto, envía el reclamo con tu correo institucional @unilibre.edu.co y una descripción probatoria con detalles que solo tú conozcas.",
  },
  {
    icon: Shield,
    title: "Recógelo en portería",
    body: "El personal de vigilancia revisa tu solicitud, verifica tu identidad presencialmente con tu carnet y te entrega el objeto firmando el comprobante.",
  },
] as const;

export default function ComoFuncionaPage() {
  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver al inicio
        </Link>

        <header className="mb-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <div className="mb-4 flex gap-1" aria-hidden>
              <span className="h-1 w-8 bg-brand" />
              <span className="h-1 w-4 bg-gold" />
            </div>
            <p className="mb-3 inline-block rounded-md border border-gold/40 bg-gold-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
              Guía paso a paso · {brand.seccional}
            </p>
            <h1 className="mb-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
              Cómo funciona UniFind
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
              De la custodia en portería a la entrega segura. Un proceso claro, ágil y
              pensado para proteger la información de toda la comunidad universitaria.
            </p>
          </div>
          <BrandImageSlot slot="howItWorks" variant="banner" />
        </header>

        <section className="mb-12">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
              Proceso para reclamar
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Sigue estos tres pasos para recuperar tu objeto perdido.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <article
                key={step.title}
                className="rounded-lg border border-line bg-paper p-6 shadow-sm transition-colors hover:border-brand/40"
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
                <p className="text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-paper p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
                ¿Listo para buscar tu objeto?
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                Consulta el catálogo público sin necesidad de iniciar sesión. Si lo
                reconoces, envía tu reclamo desde ahí mismo.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/objetos"
                className="inline-flex items-center justify-center rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                Ir al catálogo
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

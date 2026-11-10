import { redirect } from "next/navigation";
import { FileSignature, Gift, Package } from "lucide-react";
import { auth } from "@/auth";
import { IngresoFlash } from "@/components/auth/AuthFlash";
import { PrintReportButton } from "@/components/bienestar/PrintReportButton";
import SectionHeading from "@/components/ui/section-heading";
import StatCard from "@/components/ui/stat-card";
import { formatFoundDate, roleDuty, roleLabel } from "@/lib/labels";
import { getBienestarMetrics } from "@/lib/metrics";

export const dynamic = "force-dynamic";

export default async function BienestarPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "SUPERUSER") {
    redirect("/unauthorized");
  }

  const metrics = await getBienestarMetrics();
  const generatedAt = new Date();
  const totalRegistered = Object.values(metrics.statusCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <div className="space-y-10">
      <header data-print-hide className="space-y-4 border-b border-line pb-6">
        <IngresoFlash
          name={session.user.name || session.user.email || "Bienestar"}
          roleLabel={roleLabel(session.user.role)}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
              Bienestar Universitario · Barranquilla
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-ink">
              Panel de Bienestar
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">
              {roleDuty(session.user.role)}. Bienestar supervisa la custodia y decide las
              donaciones; el registro, los reclamos y las entregas los realiza portería.
            </p>
          </div>
          <PrintReportButton />
        </div>
      </header>

      <section
        id="resumen"
        data-workspace-section
        data-print-hide
        className="scroll-mt-28 space-y-5"
      >
        <SectionHeading
          eyebrow="Resumen"
          title="Estado de la custodia"
          description={`Los objetos sin reclamo pasan a donación tras ${metrics.retentionDays} días en bodega.`}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="En bodega"
            value={metrics.statusCounts.EN_BODEGA}
            hint="Esperando reclamo o vencimiento del plazo"
            icon={Package}
            tone="ink"
          />
          <StatCard
            label="Listos para donación"
            value={metrics.statusCounts.LISTO_PARA_DONACION}
            hint="Superaron el tiempo de custodia"
            icon={Gift}
            tone="gold"
          />
          <StatCard
            label="Entregas firmadas"
            value={metrics.deliveries}
            hint="Objetos devueltos con firma"
            icon={FileSignature}
            tone="success"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-line bg-paper p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Reclamos
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-subtle">
              Los revisa y resuelve portería; aquí solo se monitorean.
            </p>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md bg-bar px-3 py-2">
                <dt className="text-[11px] uppercase tracking-wider text-ink-subtle">
                  Pendientes
                </dt>
                <dd className="mt-1 font-serif text-2xl font-semibold text-ink">
                  {metrics.claimCounts.PENDING}
                </dd>
              </div>
              <div className="rounded-md bg-success-soft px-3 py-2">
                <dt className="text-[11px] uppercase tracking-wider text-success">
                  Aprobados
                </dt>
                <dd className="mt-1 font-serif text-2xl font-semibold text-success">
                  {metrics.claimCounts.APPROVED}
                </dd>
              </div>
              <div className="rounded-md bg-danger-soft px-3 py-2">
                <dt className="text-[11px] uppercase tracking-wider text-danger">
                  Rechazados
                </dt>
                <dd className="mt-1 font-serif text-2xl font-semibold text-danger">
                  {metrics.claimCounts.REJECTED}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-line bg-paper p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Cómo cierra el ciclo
            </h3>
            <ol className="mt-3 space-y-2 text-sm leading-relaxed text-ink-muted">
              <li>
                <span className="font-semibold text-ink">1.</span> Portería registra el
                objeto y lo guarda en bodega.
              </li>
              <li>
                <span className="font-semibold text-ink">2.</span> Si nadie lo reclama en{" "}
                {metrics.retentionDays} días, pasa a la lista de donación.
              </li>
              <li>
                <span className="font-semibold text-ink">3.</span> Bienestar descarga el
                reporte y coordina la entrega con la entidad receptora.
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section
        id="donacion"
        data-workspace-section
        className="scroll-mt-28 rounded-lg border border-line bg-paper p-6 sm:p-8 print:border-0 print:p-0"
      >
        <div className="hidden print:block">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Universidad Libre Seccional Barranquilla · Bienestar Universitario
          </p>
          <h1 className="mt-1 font-serif text-2xl font-semibold text-ink">
            Reporte de donación de objetos
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Generado el {generatedAt.toLocaleString("es-CO")} · Tiempo de custodia antes de
            donación: {metrics.retentionDays} días
          </p>
          <div className="mt-6 grid grid-cols-4 gap-4 text-sm">
            <div className="rounded-md border border-line px-3 py-2">
              <p className="text-[11px] uppercase tracking-wider text-ink-subtle">
                Listos para donación
              </p>
              <p className="mt-1 font-serif text-xl font-semibold">
                {metrics.statusCounts.LISTO_PARA_DONACION}
              </p>
            </div>
            <div className="rounded-md border border-line px-3 py-2">
              <p className="text-[11px] uppercase tracking-wider text-ink-subtle">
                En bodega
              </p>
              <p className="mt-1 font-serif text-xl font-semibold">
                {metrics.statusCounts.EN_BODEGA}
              </p>
            </div>
            <div className="rounded-md border border-line px-3 py-2">
              <p className="text-[11px] uppercase tracking-wider text-ink-subtle">
                Entregados
              </p>
              <p className="mt-1 font-serif text-xl font-semibold">
                {metrics.statusCounts.ENTREGADO}
              </p>
            </div>
            <div className="rounded-md border border-line px-3 py-2">
              <p className="text-[11px] uppercase tracking-wider text-ink-subtle">
                Total registrado
              </p>
              <p className="mt-1 font-serif text-xl font-semibold">{totalRegistered}</p>
            </div>
          </div>
        </div>

        <div data-print-hide>
          <SectionHeading
            eyebrow="Donación"
            title="Objetos listos para donación"
            description="Son los objetos que superaron el tiempo de custodia y ya no admiten reclamo."
          />
        </div>

        {metrics.donationItems.length === 0 ? (
          <p className="rounded-md border border-line px-4 py-3 text-sm text-ink-muted">
            No hay objetos listos para donación.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="report-table w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-bar text-xs uppercase tracking-wider text-ink-muted">
                  <th className="border border-line px-3 py-2">#</th>
                  <th className="border border-line px-3 py-2">QR</th>
                  <th className="border border-line px-3 py-2">Categoría</th>
                  <th className="border border-line px-3 py-2">Portería</th>
                  <th className="border border-line px-3 py-2">Hallazgo</th>
                  <th className="border border-line px-3 py-2">Fecha</th>
                  <th className="border border-line px-3 py-2 text-right">Días</th>
                </tr>
              </thead>
              <tbody>
                {metrics.donationItems.map((item, index) => (
                  <tr key={item.id} className="align-top text-ink">
                    <td className="border border-line px-3 py-2">{index + 1}</td>
                    <td className="border border-line px-3 py-2 font-mono text-xs">
                      {item.qrCode}
                    </td>
                    <td className="border border-line px-3 py-2">{item.category}</td>
                    <td className="border border-line px-3 py-2">{item.custodyStation}</td>
                    <td className="border border-line px-3 py-2">{item.foundLocation}</td>
                    <td className="border border-line px-3 py-2">
                      {formatFoundDate(item.foundDate)}
                    </td>
                    <td className="border border-line px-3 py-2 text-right">
                      {item.daysInCustody}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-12 hidden grid-cols-2 gap-10 text-sm print:grid">
          <div>
            <div className="border-t border-ink/50 pt-2 text-center text-ink-muted">
              Bienestar Universitario
            </div>
          </div>
          <div>
            <div className="border-t border-ink/50 pt-2 text-center text-ink-muted">
              Portería / Vigilancia
            </div>
          </div>
        </div>

        <p className="mt-8 hidden text-xs text-ink-subtle print:block">
          Documento generado automáticamente por UniFind. Contiene datos de uso interno.
        </p>
      </section>
    </div>
  );
}

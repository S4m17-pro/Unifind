import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, FileSignature, Gift, Package } from "lucide-react";
import { auth } from "@/auth";
import { IngresoFlash } from "@/components/auth/AuthFlash";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/ui/stat-card";
import { roleDuty, roleLabel } from "@/lib/labels";
import { getBienestarMetrics } from "@/lib/metrics";

export const dynamic = "force-dynamic";

export default async function BienestarPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "SUPERUSER") {
    redirect("/unauthorized");
  }

  const metrics = await getBienestarMetrics();

  return (
    <div className="space-y-10">
      <header className="space-y-4 border-b border-line pb-6">
          <IngresoFlash
            name={session.user.name || session.user.email || "Bienestar"}
            roleLabel={roleLabel(session.user.role)}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
              Turno de {roleLabel(session.user.role)} · Barranquilla
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-ink">Métricas y donaciones</h1>
            <p className="mt-1 text-sm text-ink-muted">
              {session.user.name || session.user.email}. {roleDuty(session.user.role)}.
              Retención de custodia: {metrics.retentionDays} días antes de LISTO_PARA_DONACION.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="En bodega"
            value={metrics.statusCounts.EN_BODEGA}
            icon={Package}
            tone="brand"
          />
          <StatCard
            label="Entregados"
            value={metrics.statusCounts.ENTREGADO}
            icon={CheckCircle2}
            tone="success"
          />
          <StatCard
            label="Listos para donación"
            value={metrics.statusCounts.LISTO_PARA_DONACION}
            icon={Gift}
            tone="gold"
          />
          <StatCard
            label="Entregas firmadas"
            value={metrics.deliveries}
            icon={FileSignature}
            tone="ink"
          />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-line bg-paper p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Reclamos
            </h2>
            <ul className="space-y-2 text-sm text-ink">
              <li>Pendientes: {metrics.claimCounts.PENDING}</li>
              <li>Aprobados: {metrics.claimCounts.APPROVED}</li>
              <li>Rechazados: {metrics.claimCounts.REJECTED}</li>
            </ul>
          </div>

          <div className="rounded-lg border border-line bg-paper p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Por categoría
            </h2>
            <ul className="space-y-2 text-sm text-ink">
              {metrics.byCategory.length === 0 ? (
                <li>Sin registros.</li>
              ) : (
                metrics.byCategory.map((row) => (
                  <li key={row.category}>
                    {row.category}: {row.count}
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-lg border border-line bg-paper p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Por portería
            </h2>
            <ul className="space-y-2 text-sm text-ink">
              {metrics.byStation.length === 0 ? (
                <li>Sin registros.</li>
              ) : (
                metrics.byStation.map((row) => (
                  <li key={row.station}>
                    {row.station}: {row.count}
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-paper p-6 sm:p-8">
          <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">Reporte de donación</h2>
          <p className="mb-6 text-sm text-ink-muted">
            Objetos que superaron el periodo de retención y quedaron en LISTO_PARA_DONACION.
          </p>
          <Button asChild className="mb-6">
            <Link href="/bienestar/reporte">Descargar reporte PDF</Link>
          </Button>
          {metrics.donationItems.length === 0 ? (
            <p className="text-sm text-ink-subtle">No hay objetos listos para donación.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-ink-subtle">
                  <tr>
                    <th className="px-3 py-2">QR</th>
                    <th className="px-3 py-2">Categoría</th>
                    <th className="px-3 py-2">Portería</th>
                    <th className="px-3 py-2">Hallazgo</th>
                    <th className="px-3 py-2">Días en custodia</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.donationItems.map((item) => (
                    <tr key={item.id} className="border-t border-line text-ink">
                      <td className="px-3 py-2 font-mono text-xs text-brand">{item.qrCode}</td>
                      <td className="px-3 py-2">{item.category}</td>
                      <td className="px-3 py-2">{item.custodyStation}</td>
                      <td className="px-3 py-2">{item.foundLocation}</td>
                      <td className="px-3 py-2">{item.daysInCustody}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
    </div>
  );
}

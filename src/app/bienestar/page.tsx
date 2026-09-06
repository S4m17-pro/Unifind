import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getBienestarMetrics } from "@/lib/metrics";

export const dynamic = "force-dynamic";

export default async function BienestarPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "SUPERUSER") {
    redirect("/unauthorized");
  }

  const metrics = await getBienestarMetrics();

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 sm:p-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="border-b border-slate-800 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Bienestar Universitario
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">Métricas y donaciones</h1>
          <p className="mt-1 text-sm text-slate-400">
            Lectura para SUPERUSER. Retención de custodia: {metrics.retentionDays} días antes de
            LISTO_PARA_DONACION.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="En bodega" value={metrics.statusCounts.EN_BODEGA} tone="text-blue-400" />
          <MetricCard label="Entregados" value={metrics.statusCounts.ENTREGADO} tone="text-emerald-400" />
          <MetricCard
            label="Listos para donación"
            value={metrics.statusCounts.LISTO_PARA_DONACION}
            tone="text-amber-400"
          />
          <MetricCard label="Entregas firmadas" value={metrics.deliveries} tone="text-slate-100" />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Reclamos
            </h2>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Pendientes: {metrics.claimCounts.PENDING}</li>
              <li>Aprobados: {metrics.claimCounts.APPROVED}</li>
              <li>Rechazados: {metrics.claimCounts.REJECTED}</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Por categoría
            </h2>
            <ul className="space-y-2 text-sm text-slate-300">
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

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Por portería
            </h2>
            <ul className="space-y-2 text-sm text-slate-300">
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

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="mb-2 text-2xl font-bold">Reporte de donación</h2>
          <p className="mb-6 text-sm text-slate-400">
            Objetos que superaron el periodo de retención y quedaron en LISTO_PARA_DONACION.
          </p>
          {metrics.donationItems.length === 0 ? (
            <p className="text-sm text-slate-500">No hay objetos listos para donación.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-slate-500">
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
                    <tr key={item.id} className="border-t border-slate-800 text-slate-300">
                      <td className="px-3 py-2 font-mono text-xs text-blue-400">{item.qrCode}</td>
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
    </main>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
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
    <main className="min-h-screen p-6 text-slate-900 sm:p-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Bienestar Universitario
            </p>
            <h1 className="font-display mt-2 text-3xl font-extrabold">Métricas y donaciones</h1>
            <p className="mt-1 text-sm text-slate-600">
              Panel de Bienestar Universitario. Los objetos sin reclamo pasan a donación tras{" "}
              {metrics.retentionDays} días en custodia.
            </p>
          </div>
          <Link
            href="/bienestar/reporte"
            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            Reporte PDF
          </Link>
        </header>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="En bodega" value={metrics.statusCounts.EN_BODEGA} tone="text-teal-700" />
          <MetricCard label="Entregados" value={metrics.statusCounts.ENTREGADO} tone="text-emerald-700" />
          <MetricCard
            label="Listos para donación"
            value={metrics.statusCounts.LISTO_PARA_DONACION}
            tone="text-amber-700"
          />
          <MetricCard label="Entregas firmadas" value={metrics.deliveries} tone="text-slate-900" />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-600">
              Reclamos
            </h2>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>Pendientes: {metrics.claimCounts.PENDING}</li>
              <li>Aprobados: {metrics.claimCounts.APPROVED}</li>
              <li>Rechazados: {metrics.claimCounts.REJECTED}</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-600">
              Por categoría
            </h2>
            <ul className="space-y-2 text-sm text-slate-700">
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

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-600">
              Por portería
            </h2>
            <ul className="space-y-2 text-sm text-slate-700">
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

        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="mb-2 text-2xl font-bold">Reporte de donación</h2>
          <p className="mb-6 text-sm text-slate-600">
            Objetos que superaron el tiempo de custodia y están listos para donación.
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
                    <tr key={item.id} className="border-t border-slate-200 text-slate-700">
                      <td className="px-3 py-2 font-mono text-xs text-teal-700">{item.qrCode}</td>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

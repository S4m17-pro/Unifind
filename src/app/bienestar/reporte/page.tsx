import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getBienestarMetrics } from "@/lib/metrics";
import { formatFoundDate } from "@/lib/labels";
import { PrintReportButton } from "@/components/bienestar/PrintReportButton";

export const dynamic = "force-dynamic";

export default async function DonationReportPage() {
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
    <main className="min-h-screen bg-white px-6 py-8 text-slate-900 sm:px-10 print:px-0 print:py-0">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 print:hidden">
          <Link
            href="/bienestar"
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            ← Volver a métricas
          </Link>
          <PrintReportButton />
        </div>

        <header className="border-b-2 border-slate-900 pb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Universidad Libre Seccional Barranquilla · Bienestar Universitario
          </p>
          <h1 className="mt-1 text-2xl font-extrabold">Reporte de donación de objetos</h1>
          <p className="mt-1 text-sm text-slate-600">
            Generado el {generatedAt.toLocaleString("es-CO")} · Retención de custodia:{" "}
            {metrics.retentionDays} días
          </p>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <Summary label="Listos para donación" value={metrics.statusCounts.LISTO_PARA_DONACION} />
          <Summary label="En bodega" value={metrics.statusCounts.EN_BODEGA} />
          <Summary label="Entregados" value={metrics.statusCounts.ENTREGADO} />
          <Summary label="Total registrado" value={totalRegistered} />
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold">Objetos listos para donación</h2>
          <p className="mt-1 text-sm text-slate-600">
            Objetos que superaron el periodo de retención y quedaron en LISTO_PARA_DONACION.
          </p>

          {metrics.donationItems.length === 0 ? (
            <p className="mt-4 rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-600">
              No hay objetos listos para donación.
            </p>
          ) : (
            <table className="report-table mt-4 w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-100 text-xs uppercase tracking-wider text-slate-700">
                  <th className="border border-slate-300 px-3 py-2">#</th>
                  <th className="border border-slate-300 px-3 py-2">QR</th>
                  <th className="border border-slate-300 px-3 py-2">Categoría</th>
                  <th className="border border-slate-300 px-3 py-2">Portería</th>
                  <th className="border border-slate-300 px-3 py-2">Hallazgo</th>
                  <th className="border border-slate-300 px-3 py-2">Fecha</th>
                  <th className="border border-slate-300 px-3 py-2 text-right">Días</th>
                </tr>
              </thead>
              <tbody>
                {metrics.donationItems.map((item, index) => (
                  <tr key={item.id} className="align-top">
                    <td className="border border-slate-300 px-3 py-2">{index + 1}</td>
                    <td className="border border-slate-300 px-3 py-2 font-mono text-xs">
                      {item.qrCode}
                    </td>
                    <td className="border border-slate-300 px-3 py-2">{item.category}</td>
                    <td className="border border-slate-300 px-3 py-2">{item.custodyStation}</td>
                    <td className="border border-slate-300 px-3 py-2">{item.foundLocation}</td>
                    <td className="border border-slate-300 px-3 py-2">
                      {formatFoundDate(item.foundDate)}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right">
                      {item.daysInCustody}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <footer className="mt-12 grid grid-cols-1 gap-10 text-sm sm:grid-cols-2">
          <div>
            <div className="border-t border-slate-500 pt-2 text-center text-slate-700">
              Bienestar Universitario
            </div>
          </div>
          <div>
            <div className="border-t border-slate-500 pt-2 text-center text-slate-700">
              Portería / Vigilancia
            </div>
          </div>
        </footer>

        <p className="mt-8 text-xs text-slate-500">
          Documento generado automáticamente por UniFind. Contiene datos de uso interno.
        </p>
      </div>
    </main>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-300 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

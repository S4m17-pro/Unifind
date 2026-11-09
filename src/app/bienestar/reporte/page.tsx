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
    <div className="rounded-lg border border-line bg-paper p-6 text-ink sm:p-10 print:rounded-none print:border-0 print:p-0">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 print:hidden">
          <Link
            href="/bienestar"
            className="text-sm font-semibold text-brand hover:underline"
          >
            ← Volver a métricas
          </Link>
          <PrintReportButton />
        </div>

        <header className="border-b-2 border-ink pb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Universidad Libre Seccional Barranquilla · Bienestar Universitario
          </p>
          <h1 className="font-serif mt-1 text-2xl font-semibold">Reporte de donación de objetos</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Generado el {generatedAt.toLocaleString("es-CO")} · Tiempo de custodia antes de
            donación: {metrics.retentionDays} días
          </p>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <Summary label="Listos para donación" value={metrics.statusCounts.LISTO_PARA_DONACION} />
          <Summary label="En bodega" value={metrics.statusCounts.EN_BODEGA} />
          <Summary label="Entregados" value={metrics.statusCounts.ENTREGADO} />
          <Summary label="Total registrado" value={totalRegistered} />
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-lg font-semibold">Objetos listos para donación</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Objetos que superaron el tiempo de custodia y están listos para donación.
          </p>

          {metrics.donationItems.length === 0 ? (
            <p className="mt-4 rounded-lg border border-line px-4 py-3 text-sm text-ink-muted">
              No hay objetos listos para donación.
            </p>
          ) : (
            <table className="report-table mt-4 w-full border-collapse text-left text-sm">
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
                  <tr key={item.id} className="align-top">
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
          )}
        </section>

        <footer className="mt-12 grid grid-cols-1 gap-10 text-sm sm:grid-cols-2">
          <div>
            <div className="border-t border-line pt-2 text-center text-ink-muted">
              Bienestar Universitario
            </div>
          </div>
          <div>
            <div className="border-t border-line pt-2 text-center text-ink-muted">
              Portería / Vigilancia
            </div>
          </div>
        </footer>

        <p className="mt-8 text-xs text-ink-subtle">
          Documento generado automáticamente por UniFind. Contiene datos de uso interno.
        </p>
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

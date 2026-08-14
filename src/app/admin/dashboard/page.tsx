import NewItemForm from "@/components/admin/NewItemForm";
import DeliveryModule from "@/components/admin/DeliveryModule";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // En un entorno de producción, obtenemos la sesión activa de NextAuth
  // const session = await getServerSession(authOptions);
  const sampleOfficerId = "admin_officer_demo_id";

  const totalBodega = await prisma.item.count({ where: { status: "EN_BODEGA" } });
  const totalEntregados = await prisma.item.count({ where: { status: "ENTREGADO" } });
  const totalDonacion = await prisma.item.count({ where: { status: "LISTO_PARA_DONACION" } });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100">
              Panel de Control (Vigilancia & Bodega)
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Gestión centralizada de recepción, custodia, escaneo QR y entregas presenciales UniFind.
            </p>
          </div>
        </div>

        {/* Tarjetas Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">En Bodega</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">{totalBodega}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Entregados</p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">{totalEntregados}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Listos para Donación (&gt;30 Días)</p>
            <p className="text-3xl font-bold text-amber-400 mt-2">{totalDonacion}</p>
          </div>
        </div>

        {/* Sección: Registro Privado de Objetos */}
        <section>
          <NewItemForm officerId={sampleOfficerId} />
        </section>

        {/* Sección: Escaneo QR y Entrega Presencial con Firma */}
        <section className="pt-6">
          <DeliveryModule officerId={sampleOfficerId} />
        </section>
      </div>
    </main>
  );
}

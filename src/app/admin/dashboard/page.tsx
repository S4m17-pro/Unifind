import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  describeCloudinarySetup,
  getCloudinaryStatus,
  isCloudinaryConfigured,
} from "@/lib/images";
import { resolveAdminPrivatePhoto } from "@/lib/admin-photo";
import AdminPrivatePhoto from "@/components/admin/AdminPrivatePhoto";
import ClaimsReview from "@/components/admin/ClaimsReview";
import DeliveryModule from "@/components/admin/DeliveryModule";
import NewItemForm from "@/components/admin/NewItemForm";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERUSER")) {
    redirect("/login?callbackUrl=/admin/dashboard");
  }

  const [totalBodega, totalEntregados, totalDonacion, pendingClaims, recentItems] = await Promise.all([
    prisma.item.count({ where: { status: "EN_BODEGA" } }),
    prisma.item.count({ where: { status: "ENTREGADO" } }),
    prisma.item.count({ where: { status: "LISTO_PARA_DONACION" } }),
    prisma.claimRequest.findMany({
      where: { status: "PENDING" },
      include: {
        student: { select: { name: true, email: true } },
        item: {
          select: {
            id: true,
            category: true,
            qrCode: true,
            custodyStation: true,
            shelfLocation: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.item.findMany({
      where: { status: { in: ["EN_BODEGA", "LISTO_PARA_DONACION"] } },
      select: {
        id: true,
        category: true,
        qrCode: true,
        custodyStation: true,
        shelfLocation: true,
        images: {
          select: { cloudinaryId: true },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const cloudinaryStatus = getCloudinaryStatus();
  const canSignImages = isCloudinaryConfigured();
  const cloudinarySetupMessage = describeCloudinarySetup();

  return (
    <main className="min-h-screen p-6 text-slate-900 sm:p-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-slate-900">
              Panel de control (Vigilancia y bodega)
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Sesión: {session.user.name || session.user.email}. Registra objetos hallados,
              revisa solicitudes y completa las entregas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">En bodega</p>
            <p className="mt-2 text-3xl font-bold text-teal-700">{totalBodega}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Entregados</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">{totalEntregados}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Listos para donación (&gt;30 días)
            </p>
            <p className="mt-2 text-3xl font-bold text-amber-700">{totalDonacion}</p>
          </div>
        </div>

        {cloudinaryStatus.status !== "ready" ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {cloudinarySetupMessage}
          </div>
        ) : null}

        <section>
          <NewItemForm
            photoNotice={canSignImages ? undefined : cloudinarySetupMessage}
            cloudinaryReady={canSignImages}
          />
        </section>

        <ClaimsReview claims={pendingClaims} />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Inventario reciente</h2>
          <p className="mb-6 text-sm text-slate-600">
            Las fotos de los objetos solo las ve el personal autorizado. Nunca aparecen en la
            vista de los estudiantes.
          </p>
          {recentItems.length === 0 ? (
            <p className="text-sm text-slate-500">Aún no hay objetos en custodia.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {recentItems.map((item) => {
                const photo = resolveAdminPrivatePhoto(item.images[0]?.cloudinaryId);

                return (
                  <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <AdminPrivatePhoto
                      signedUrl={photo.signedUrl}
                      emptyLabel={photo.emptyLabel}
                      alt={`Foto privada de ${item.category}`}
                    />
                    <p className="font-semibold text-slate-900">{item.category}</p>
                    <p className="font-mono text-xs text-teal-700">{item.qrCode}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.custodyStation} · {item.shelfLocation}
                    </p>
                    <Link
                      href={`/admin/objetos/${item.id}`}
                      className="mt-3 inline-flex text-sm font-medium text-teal-700 hover:text-teal-800"
                    >
                      Ver ficha privada
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="pt-6">
          <DeliveryModule />
        </section>
      </div>
    </main>
  );
}

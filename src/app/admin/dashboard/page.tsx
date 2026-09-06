import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  describeCloudinarySetup,
  getCloudinaryStatus,
  getSignedPrivateImageUrl,
  isCloudinaryConfigured,
} from "@/lib/images";
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
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 sm:p-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100">
              Panel de control (Vigilancia y bodega)
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Sesión: {session.user.name || session.user.email}. Registro privado, QR, revisión de
              reclamos y entrega con firma.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">En bodega</p>
            <p className="mt-2 text-3xl font-bold text-blue-400">{totalBodega}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Entregados</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">{totalEntregados}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Listos para donación (&gt;30 días)
            </p>
            <p className="mt-2 text-3xl font-bold text-amber-400">{totalDonacion}</p>
          </div>
        </div>

        {cloudinaryStatus.status !== "ready" ? (
          <div className="rounded-2xl border border-amber-800 bg-amber-950/50 px-4 py-3 text-sm text-amber-200">
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

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-100">Inventario reciente (privado)</h2>
          <p className="mb-6 text-sm text-slate-400">
            Las fotos autenticadas de Cloudinary solo se firman aquí. El catálogo público no las recibe.
          </p>
          {recentItems.length === 0 ? (
            <p className="text-sm text-slate-500">Aún no hay objetos en custodia.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {recentItems.map((item) => {
                const imageId = item.images[0]?.cloudinaryId;
                const signedUrl = imageId ? getSignedPrivateImageUrl(imageId) : null;
                const photoLabel = signedUrl
                  ? null
                  : imageId
                    ? "Foto privada almacenada; no se pudo firmar. Revisa CLOUDINARY_*."
                    : "Sin foto privada";

                return (
                  <article key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    {signedUrl ? (
                      <img
                        src={signedUrl}
                        alt={`Foto privada de ${item.category}`}
                        className="mb-3 h-36 w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="mb-3 flex h-24 items-center justify-center rounded-xl bg-slate-900 px-3 text-center text-xs text-slate-500">
                        {photoLabel}
                      </div>
                    )}
                    <p className="font-semibold text-slate-100">{item.category}</p>
                    <p className="font-mono text-xs text-blue-400">{item.qrCode}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {item.custodyStation} · {item.shelfLocation}
                    </p>
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

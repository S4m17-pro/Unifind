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
    <main className="p-6 sm:p-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-center">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-ink">
              Panel de control (Vigilancia y bodega)
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Sesión: {session.user.name || session.user.email}. Registro privado, QR, revisión de
              reclamos y entrega con firma.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-line bg-paper p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">En bodega</p>
            <p className="mt-2 font-serif text-3xl font-semibold text-brand">{totalBodega}</p>
          </div>
          <div className="rounded-lg border border-line bg-paper p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Entregados</p>
            <p className="mt-2 font-serif text-3xl font-semibold text-success">{totalEntregados}</p>
          </div>
          <div className="rounded-lg border border-line bg-paper p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Listos para donación (&gt;30 días)
            </p>
            <p className="mt-2 font-serif text-3xl font-semibold text-gold-ink">{totalDonacion}</p>
          </div>
        </div>

        {cloudinaryStatus.status !== "ready" ? (
          <div className="rounded-lg border border-gold/40 bg-gold-soft px-4 py-3 text-sm text-gold-ink">
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

        <section className="rounded-lg border border-line bg-paper p-6 sm:p-8">
          <h2 className="mb-4 font-serif text-2xl font-semibold text-ink">Inventario reciente (privado)</h2>
          <p className="mb-6 text-sm text-ink-muted">
            Las fotos autenticadas de Cloudinary solo se firman aquí. El catálogo público no las recibe.
          </p>
          {recentItems.length === 0 ? (
            <p className="text-sm text-ink-subtle">Aún no hay objetos en custodia.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {recentItems.map((item) => {
                const photo = resolveAdminPrivatePhoto(item.images[0]?.cloudinaryId);

                return (
                  <article key={item.id} className="rounded-lg border border-line bg-canvas p-4">
                    <AdminPrivatePhoto
                      signedUrl={photo.signedUrl}
                      emptyLabel={photo.emptyLabel}
                      alt={`Foto privada de ${item.category}`}
                    />
                    <p className="font-semibold text-ink">{item.category}</p>
                    <p className="font-mono text-xs text-brand">{item.qrCode}</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {item.custodyStation} · {item.shelfLocation}
                    </p>
                    <Link
                      href={`/admin/objetos/${item.id}`}
                      className="mt-3 inline-flex text-sm font-semibold text-brand hover:text-brand-hover"
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

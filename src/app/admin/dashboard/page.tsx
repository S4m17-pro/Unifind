import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Boxes,
  ClipboardCheck,
  PackagePlus,
  QrCode,
  ScanLine,
  ShieldCheck,
  Warehouse,
} from "lucide-react";
import { auth } from "@/auth";
import { IngresoFlash } from "@/components/auth/AuthFlash";
import { roleDuty, roleLabel } from "@/lib/labels";
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
import SectionHeading from "@/components/ui/section-heading";
import StatCard from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERUSER")) {
    redirect("/login?callbackUrl=/admin/dashboard");
  }

  const [totalBodega, totalEntregados, totalDonacion, pendingClaims, recentItems] =
    await Promise.all([
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
              foundLocation: true,
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
          foundLocation: true,
          createdAt: true,
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
  const firstName = (session.user.name || session.user.email || "vigilancia").split(/\s+/)[0];

  return (
    <div className="space-y-8">
      <header className="space-y-5 border-b border-line pb-6">
        <IngresoFlash
          name={session.user.name || session.user.email || "vigilancia"}
          roleLabel={roleLabel(session.user.role)}
        />
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
              Turno de {roleLabel(session.user.role)} · Universidad Libre Barranquilla
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">
              Hola, {firstName}. Listo para registrar y entregar.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
              {session.user.name || session.user.email}. {roleDuty(session.user.role)}.
              Usa este espacio para registrar objetos, revisar reclamos con evidencia,
              imprimir la etiqueta QR y entregar con firma digital.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="#registro">
                <PackagePlus className="size-4" />
                Registrar objeto
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#reclamos">
                <ClipboardCheck className="size-4" />
                Ver reclamos
                {pendingClaims.length > 0 ? (
                  <span className="rounded-full bg-brand px-1.5 text-[10px] text-white">
                    {pendingClaims.length}
                  </span>
                ) : null}
              </Link>
            </Button>
            <Button asChild>
              <Link href="#entregas">
                <ScanLine className="size-4" />
                Escanear y entregar
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section id="resumen" data-workspace-section className="scroll-mt-[var(--app-header-offset)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="En bodega" value={totalBodega} hint="Disponibles para reclamo" icon={Warehouse} tone="brand" />
          <StatCard label="Entregados" value={totalEntregados} hint="Con firma registrada" icon={ShieldCheck} tone="success" />
          <StatCard label="Listos para donación" value={totalDonacion} hint="Superaron periodo de custodia" icon={Boxes} tone="gold" />
          <StatCard label="Reclamos pendientes" value={pendingClaims.length} hint="Por revisar en portería" icon={ClipboardCheck} tone="ink" />
        </div>
      </section>

      {cloudinaryStatus.status !== "ready" ? (
        <div className="rounded-lg border border-gold/40 bg-gold-soft px-4 py-3 text-sm text-gold-ink">
          {cloudinarySetupMessage}
        </div>
      ) : null}

      <section id="registro" data-workspace-section className="scroll-mt-[var(--app-header-offset)]">
        <SectionHeading
          eyebrow="Recepción y etiquetado"
          title="Registrar objeto perdido"
          description="Captura categoría, hallazgo, portería, ubicación física en bodega y foto privada. El sistema genera el código QR para imprimir la etiqueta."
          action={
            <p className="flex items-center gap-2 text-xs text-ink-subtle">
              <QrCode className="size-4" aria-hidden />
              QR único por objeto
            </p>
          }
        />
        <NewItemForm
          photoNotice={canSignImages ? undefined : cloudinarySetupMessage}
          cloudinaryReady={canSignImages}
        />
      </section>

      <section id="reclamos" data-workspace-section className="scroll-mt-[var(--app-header-offset)]">
        <SectionHeading
          eyebrow="Catálogo y reclamos"
          title="Revisión de reclamos"
          description="Solo personal de vigilancia ve las descripciones probatorias. Aprueba para autorizar el retiro presencial o rechaza con criterio."
        />
        <ClaimsReview claims={pendingClaims} />
      </section>

      <section id="entregas" data-workspace-section className="scroll-mt-[var(--app-header-offset)]">
        <SectionHeading
          eyebrow="Entrega segura"
          title="Escanear QR y firmar entrega"
          description="Escanea el código de la etiqueta, valida el receptor y toma la firma digital táctil como comprobante legal."
        />
        <DeliveryModule />
      </section>

      <section id="inventario" data-workspace-section className="scroll-mt-[var(--app-header-offset)]">
        <SectionHeading
          eyebrow="Bodega privada"
          title="Inventario reciente"
          description="Fotos autenticadas, QR, ubicación en estante y ficha privada. El catálogo público nunca expone estos datos."
          action={
            <Button asChild variant="outline">
              <Link href="/objetos">Ver catálogo público</Link>
            </Button>
          }
        />
        <div className="rounded-lg border border-line bg-paper p-6 shadow-sm sm:p-8">
          {recentItems.length === 0 ? (
            <p className="text-sm text-ink-subtle">Aún no hay objetos en custodia.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recentItems.map((item) => {
                const photo = resolveAdminPrivatePhoto(item.images[0]?.cloudinaryId);
                return (
                  <article
                    key={item.id}
                    className="flex h-full flex-col rounded-lg border border-line bg-canvas"
                  >
                    <AdminPrivatePhoto
                      signedUrl={photo.signedUrl}
                      emptyLabel={photo.emptyLabel}
                      alt={`Foto privada de ${item.category}`}
                    />
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-ink">{item.category}</p>
                          <p className="font-mono text-xs text-brand">{item.qrCode}</p>
                        </div>
                        <span className="rounded-md border border-line px-2 py-0.5 text-[11px] uppercase tracking-wider text-ink-subtle">
                          {item.createdAt.toLocaleDateString("es-CO", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-ink-muted">
                        {item.custodyStation} · {item.shelfLocation}
                      </p>
                      <p className="mt-1 text-xs text-ink-subtle">Hallado en {item.foundLocation}</p>
                      <Link
                        href={`/admin/objetos/${item.id}`}
                        className="mt-4 inline-flex items-center text-sm font-semibold text-brand hover:text-brand-hover"
                      >
                        Abrir ficha privada
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, QrCode, Warehouse } from "lucide-react";
import { auth } from "@/auth";
import AdminPrivatePhoto from "@/components/admin/AdminPrivatePhoto";
import StatusBadge from "@/components/public/StatusBadge";
import { resolveAdminPrivatePhoto } from "@/lib/admin-photo";
import { formatFoundDate } from "@/lib/labels";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

async function getAdminItem(id: string) {
  return prisma.item.findUnique({
    where: { id },
    select: {
      id: true,
      qrCode: true,
      category: true,
      foundLocation: true,
      foundDate: true,
      custodyStation: true,
      shelfLocation: true,
      status: true,
      createdAt: true,
      registeredBy: {
        select: { name: true, email: true },
      },
      images: {
        select: { cloudinaryId: true },
        take: 1,
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const item = await getAdminItem(id);
    if (!item) return { title: "Ficha no encontrada" };
    return { title: `Ficha privada · ${item.category}` };
  } catch {
    return { title: "Ficha privada" };
  }
}

export default async function AdminItemDetailPage({ params }: { params: Params }) {
  const session = await auth();

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERUSER")) {
    redirect("/login?callbackUrl=/admin/dashboard");
  }

  const { id } = await params;

  let item;
  try {
    item = await getAdminItem(id);
  } catch {
    notFound();
  }

  if (!item) notFound();

  const photo = resolveAdminPrivatePhoto(item.images[0]?.cloudinaryId);
  const registrar = item.registeredBy.name || item.registeredBy.email;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver al panel
        </Link>

        <article className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Ficha privada de vigilancia
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-slate-100 sm:text-3xl">
                {item.category}
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Registrado por {registrar} · {formatFoundDate(item.createdAt)}
              </p>
            </div>
            <StatusBadge status={item.status} />
          </div>

          <AdminPrivatePhoto
            variant="detail"
            signedUrl={photo.signedUrl}
            emptyLabel={photo.emptyLabel}
            alt={`Foto privada de ${item.category}`}
          />
          <p className="mt-2 mb-8 text-xs text-slate-500">
            La foto se firma en el servidor con los helpers de Cloudinary. El catálogo público
            nunca recibe este enlace.
          </p>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:col-span-2">
              <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <QrCode className="h-3.5 w-3.5" aria-hidden />
                Código QR interno
              </dt>
              <dd className="font-mono text-sm text-blue-400">{item.qrCode}</dd>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Bloque / salón
              </dt>
              <dd className="text-sm text-slate-200">{item.foundLocation}</dd>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Portería de custodia
              </dt>
              <dd className="text-sm text-slate-200">{item.custodyStation}</dd>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Warehouse className="h-3.5 w-3.5" aria-hidden />
                Estante interno
              </dt>
              <dd className="text-sm text-slate-200">{item.shelfLocation}</dd>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <dt className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                Fecha de hallazgo
              </dt>
              <dd className="text-sm text-slate-200">{formatFoundDate(item.foundDate)}</dd>
            </div>
          </dl>
        </article>
      </div>
    </main>
  );
}

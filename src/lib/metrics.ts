import { prisma } from "@/lib/prisma";
import { CUSTODY_RETENTION_DAYS } from "@/lib/constants";
import { requireSuperuserSession } from "@/lib/auth-guards";

export async function getBienestarMetrics() {
  await requireSuperuserSession();

  const [
    byStatus,
    byCategory,
    byStation,
    claimsByStatus,
    deliveries,
    donationItems,
  ] = await Promise.all([
    prisma.item.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.item.groupBy({
      by: ["category"],
      _count: { _all: true },
      orderBy: { _count: { category: "desc" } },
    }),
    prisma.item.groupBy({
      by: ["custodyStation"],
      _count: { _all: true },
      orderBy: { _count: { custodyStation: "desc" } },
    }),
    prisma.claimRequest.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.deliveryLog.count(),
    prisma.item.findMany({
      where: { status: "LISTO_PARA_DONACION" },
      select: {
        id: true,
        category: true,
        custodyStation: true,
        foundLocation: true,
        foundDate: true,
        createdAt: true,
        qrCode: true,
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const statusCounts = {
    EN_BODEGA: 0,
    ENTREGADO: 0,
    LISTO_PARA_DONACION: 0,
  };

  for (const row of byStatus) {
    statusCounts[row.status] = row._count._all;
  }

  const claimCounts = {
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
  };

  for (const row of claimsByStatus) {
    claimCounts[row.status] = row._count._all;
  }

  const now = Date.now();

  return {
    retentionDays: CUSTODY_RETENTION_DAYS,
    statusCounts,
    claimCounts,
    deliveries,
    byCategory: byCategory.map((row) => ({
      category: row.category,
      count: row._count._all,
    })),
    byStation: byStation.map((row) => ({
      station: row.custodyStation,
      count: row._count._all,
    })),
    donationItems: donationItems.map((item) => ({
      ...item,
      daysInCustody: Math.floor((now - item.createdAt.getTime()) / 86_400_000),
    })),
  };
}

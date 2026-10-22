import { prisma } from "@/lib/prisma";
import { CUSTODY_RETENTION_DAYS } from "@/lib/constants";
import { requireSuperuserSession } from "@/lib/auth/guards";

export async function getBienestarMetrics() {
  await requireSuperuserSession();

  const [
    totalItems,
    byStatus,
    byCategory,
    byStation,
    claimsByStatus,
    deliveryLogs,
    donationItems,
    intakeDates,
  ] = await Promise.all([
    prisma.item.count(),
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
    prisma.deliveryLog.findMany({
      select: {
        deliveredAt: true,
        item: { select: { createdAt: true } },
      },
    }),
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
    prisma.item.findMany({
      select: { createdAt: true },
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
  const delivered = statusCounts.ENTREGADO;
  const returnRate = totalItems > 0 ? Math.round((delivered / totalItems) * 100) : 0;
  const totalCustodyMs = deliveryLogs.reduce(
    (sum, log) => sum + Math.max(0, log.deliveredAt.getTime() - log.item.createdAt.getTime()),
    0,
  );
  const averageCustodyDays =
    deliveryLogs.length > 0
      ? Math.round((totalCustodyMs / deliveryLogs.length / 86_400_000) * 10) / 10
      : 0;

  return {
    retentionDays: CUSTODY_RETENTION_DAYS,
    totalItems,
    returnRate,
    averageCustodyDays,
    statusCounts,
    claimCounts,
    deliveries: deliveryLogs.length,
    monthlyIntake: buildMonthlyIntake(intakeDates.map((item) => item.createdAt)),
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

function buildMonthlyIntake(dates: Date[], months = 6) {
  const now = new Date();
  const buckets = Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString("es-CO", { month: "short" }).replace(".", ""),
      fullLabel: date.toLocaleDateString("es-CO", { month: "long", year: "numeric" }),
      count: 0,
    };
  });

  const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const date of dates) {
    const bucket = byKey.get(`${date.getFullYear()}-${date.getMonth()}`);
    if (bucket) bucket.count += 1;
  }

  return buckets;
}

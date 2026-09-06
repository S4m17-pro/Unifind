import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CUSTODY_RETENTION_DAYS } from "@/lib/constants";

function isAuthorizedCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorizedCron(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - CUSTODY_RETENTION_DAYS);

    const updateResult = await prisma.item.updateMany({
      where: {
        status: "EN_BODEGA",
        createdAt: {
          lte: cutoff,
        },
      },
      data: {
        status: "LISTO_PARA_DONACION",
      },
    });

    return NextResponse.json({
      success: true,
      retentionDays: CUSTODY_RETENTION_DAYS,
      message: `${updateResult.count} objeto(s) actualizados a LISTO_PARA_DONACION.`,
    });
  } catch (error) {
    console.error("Error en Cron de expiración de ítems:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

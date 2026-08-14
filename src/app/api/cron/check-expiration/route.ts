import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ruta Cron ejecutada periódicamente (ej. vía Vercel Cron o GitHub Actions)
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Actualizar items en bodega con más de 30 días
    const updateResult = await prisma.item.updateMany({
      where: {
        status: "EN_BODEGA",
        createdAt: {
          lte: thirtyDaysAgo,
        },
      },
      data: {
        status: "LISTO_PARA_DONACION",
      },
    });

    return NextResponse.json({
      success: true,
      message: `${updateResult.count} objeto(s) actualizados a LISTO_PARA_DONACION.`,
    });
  } catch (error) {
    console.error("Error en Cron de expiración de ítems:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

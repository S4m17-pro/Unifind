import { ItemStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ITEM_CATEGORIES } from "@/lib/constants";

/**
 * Campos públicos del catálogo. Nunca incluir fotos, cloudinaryId,
 * secureUrl, QR, estante interno ni descripciones de reclamo.
 */
export const PUBLIC_ITEM_SELECT = {
  id: true,
  category: true,
  foundLocation: true,
  foundDate: true,
  custodyStation: true,
} as const;

export type PublicCatalogItem = {
  id: string;
  category: string;
  foundLocation: string;
  foundDate: Date;
  custodyStation: string;
};

/** Lectura de catálogo para UI: añade status solo para filtros/CTA, no fotos ni estante. */
const CATALOG_UI_SELECT = {
  ...PUBLIC_ITEM_SELECT,
  status: true,
} satisfies Prisma.ItemSelect;

export type PublicItem = Prisma.ItemGetPayload<{ select: typeof CATALOG_UI_SELECT }>;

export type CatalogStatusFilter = ItemStatus | "DISPONIBLES" | "TODOS";

export function isClaimable(status: ItemStatus): boolean {
  return status !== ItemStatus.ENTREGADO;
}

export type PublicCatalogFilters = {
  category?: string;
  custodyStation?: string;
  status?: CatalogStatusFilter;
  limit?: number;
};

export type CatalogFilterOptions = {
  categories: string[];
  stations: string[];
};

const ITEM_STATUSES = new Set<string>(Object.values(ItemStatus));

export function parseStatusFilter(value?: string): CatalogStatusFilter | undefined {
  if (!value) return undefined;
  if (value === "TODOS" || value === "DISPONIBLES") return value;
  if (ITEM_STATUSES.has(value)) return value as ItemStatus;
  return undefined;
}

function buildWhere(filters: PublicCatalogFilters): Prisma.ItemWhereInput {
  const where: Prisma.ItemWhereInput = {};

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.custodyStation) {
    where.custodyStation = filters.custodyStation;
  }

  if (filters.status === "TODOS") {
    // consulta amplia
  } else if (filters.status === "DISPONIBLES" || !filters.status) {
    where.status = { in: [ItemStatus.EN_BODEGA, ItemStatus.LISTO_PARA_DONACION] };
  } else {
    where.status = filters.status;
  }

  return where;
}

function toPublicItem(item: PublicItem): PublicItem {
  return {
    id: item.id,
    category: item.category,
    foundLocation: item.foundLocation,
    foundDate: item.foundDate,
    custodyStation: item.custodyStation,
    status: item.status,
  };
}

export async function getPublicItems(filters: PublicCatalogFilters = {}): Promise<PublicItem[]> {
  const items = await prisma.item.findMany({
    where: buildWhere(filters),
    select: CATALOG_UI_SELECT,
    orderBy: { foundDate: "desc" },
    take: filters.limit,
  });

  return items.map(toPublicItem);
}

export async function getPublicItem(id: string): Promise<PublicItem | null> {
  const item = await prisma.item.findUnique({
    where: { id },
    select: CATALOG_UI_SELECT,
  });

  return item ? toPublicItem(item) : null;
}

export async function getCatalogFilterOptions(): Promise<CatalogFilterOptions> {
  const [categoryRows, stationRows] = await Promise.all([
    prisma.item.findMany({
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    }),
    prisma.item.findMany({
      distinct: ["custodyStation"],
      select: { custodyStation: true },
      orderBy: { custodyStation: "asc" },
    }),
  ]);

  return {
    categories: uniqueSorted([...ITEM_CATEGORIES, ...categoryRows.map((row) => row.category)]),
    stations: uniqueSorted(stationRows.map((row) => row.custodyStation)),
  };
}

export type CatalogPageData = {
  items: PublicItem[];
  options: CatalogFilterOptions;
  dbUnavailable: boolean;
};

export async function getCatalogPageData(
  filters: PublicCatalogFilters = {},
): Promise<CatalogPageData> {
  try {
    const [items, options] = await Promise.all([
      getPublicItems(filters),
      getCatalogFilterOptions(),
    ]);
    return { items, options, dbUnavailable: false };
  } catch (error) {
    console.error("Catálogo público: no se pudo leer la base de datos.", error);
    return {
      items: [],
      options: {
        categories: [...ITEM_CATEGORIES],
        stations: [],
      },
      dbUnavailable: true,
    };
  }
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, "es"));
}

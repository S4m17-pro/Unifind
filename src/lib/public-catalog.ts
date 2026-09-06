/**
 * Campos públicos del catálogo. Nunca incluir fotos, QR, estante
 * interno ni descripciones de reclamo.
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

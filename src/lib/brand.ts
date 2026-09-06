/**
 * Public campus brand surface.
 *
 * Drop institutional assets (campus photo, logo Unilibre) via env or /public.
 * Never point these at private object photos or signed Cloudinary item URLs.
 */

function readPublicAssetUrl(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;

  const lowered = trimmed.toLowerCase();
  if (
    lowered.startsWith("tu_") ||
    lowered.startsWith("your_") ||
    lowered.includes("placeholder") ||
    lowered.includes("example.com") ||
    lowered.includes("change-me")
  ) {
    return null;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return trimmed;
    }
  } catch {
    return null;
  }

  return null;
}

function readAlt(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

export const brand = {
  product: "UniFind",
  institution: "Universidad Libre",
  seccional: "Seccional Barranquilla",
  kicker: "Universidad Libre · Barranquilla",
  logoUrl: readPublicAssetUrl(process.env.NEXT_PUBLIC_BRAND_LOGO_URL),
  heroUrl: readPublicAssetUrl(process.env.NEXT_PUBLIC_BRAND_HERO_URL),
  howItWorksUrl: readPublicAssetUrl(process.env.NEXT_PUBLIC_BRAND_HOW_IT_WORKS_URL),
  catalogUrl: readPublicAssetUrl(process.env.NEXT_PUBLIC_BRAND_CATALOG_URL),
  emptyUrl: readPublicAssetUrl(process.env.NEXT_PUBLIC_BRAND_EMPTY_URL),
  logoAlt: readAlt(
    process.env.NEXT_PUBLIC_BRAND_LOGO_ALT,
    "Universidad Libre",
  ),
  heroAlt: readAlt(
    process.env.NEXT_PUBLIC_BRAND_HERO_ALT,
    "Campus Universidad Libre Seccional Barranquilla",
  ),
} as const;

export type BrandSlot = "hero" | "howItWorks" | "catalog" | "empty";

export const brandSlotCopy: Record<
  BrandSlot,
  { title: string; hint: string; alt: string }
> = {
  hero: {
    title: "Aquí va la foto del campus",
    hint: "Imagen de campus / hero · solo assets institucionales",
    alt: brand.heroAlt,
  },
  howItWorks: {
    title: "Aquí va la ilustración de portería",
    hint: "Cómo reclamar · foto o diagrama institucional",
    alt: "Portería y custodia en Universidad Libre Barranquilla",
  },
  catalog: {
    title: "Foto institucional del campus",
    hint: "Banner del catálogo · no uses fotos de objetos",
    alt: "Consulta pública en el campus Unilibre Barranquilla",
  },
  empty: {
    title: "Ilustración de custodia",
    hint: "Vacío a propósito: no hay objetos en este filtro",
    alt: "Custodia sin objetos para mostrar",
  },
};

export function brandSlotSrc(slot: BrandSlot): string | null {
  switch (slot) {
    case "hero":
      return brand.heroUrl;
    case "howItWorks":
      return brand.howItWorksUrl;
    case "catalog":
      return brand.catalogUrl;
    case "empty":
      return brand.emptyUrl;
  }
}

export function isLocalBrandAsset(src: string): boolean {
  return src.startsWith("/");
}

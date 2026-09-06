import Image from "next/image";
import { Building2 } from "lucide-react";
import { CampusMotif } from "@/components/brand/CampusMotif";
import {
  brandSlotCopy,
  brandSlotSrc,
  isLocalBrandAsset,
  type BrandSlot,
} from "@/lib/brand";
import { cn } from "@/lib/cn";

const VARIANT_CLASS: Record<
  "hero" | "panel" | "banner" | "empty",
  string
> = {
  hero: "min-h-[280px] sm:min-h-[340px] lg:min-h-[400px]",
  panel: "min-h-[200px] sm:min-h-[240px]",
  banner: "min-h-[160px] sm:min-h-[200px]",
  empty: "min-h-[148px] max-w-sm",
};

function BrandMedia({
  src,
  alt,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
}) {
  if (isLocalBrandAsset(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    );
  }

  return (
    // Remote institutional URL from NEXT_PUBLIC_BRAND_* — not an object photo.
    // Native img so Samuel can change CDN host without a next.config rebuild.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 size-full object-cover"
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}

export default function BrandImageSlot({
  slot,
  variant = "panel",
  priority = false,
  className,
}: {
  slot: BrandSlot;
  variant?: keyof typeof VARIANT_CLASS;
  priority?: boolean;
  className?: string;
}) {
  const src = brandSlotSrc(slot);
  const copy = brandSlotCopy[slot];
  const sizes =
    variant === "hero"
      ? "(min-width: 1024px) 42vw, 100vw"
      : variant === "banner"
        ? "(min-width: 1024px) 28vw, 100vw"
        : "(min-width: 1024px) 36vw, 100vw";

  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-lg border border-line bg-paper",
        VARIANT_CLASS[variant],
        className,
      )}
    >
      {src ? (
        <>
          <BrandMedia
            src={src}
            alt={copy.alt}
            priority={priority}
            sizes={sizes}
          />
          <figcaption className="sr-only">{copy.alt}</figcaption>
        </>
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(135deg,#f4f4f2_0%,#f8e8eb_48%,#f7f1d4_100%)]"
          role="img"
          aria-label={`${copy.title}. ${copy.hint}`}
        >
          <div
            className="pointer-events-none absolute inset-3 rounded-md border border-dashed border-brand/35"
            aria-hidden
          />
          <CampusMotif className="mb-3 w-[min(100%,280px)] opacity-90" />
          <p className="flex items-center gap-2 px-4 text-center font-serif text-base font-semibold text-ink sm:text-lg">
            <Building2 className="size-4 shrink-0 text-brand" aria-hidden />
            {copy.title}
          </p>
          <p className="mt-1 max-w-xs px-4 text-center text-xs text-ink-muted">
            {copy.hint}
          </p>
        </div>
      )}
    </figure>
  );
}

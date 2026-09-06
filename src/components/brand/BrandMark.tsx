import Image from "next/image";
import { brand, isLocalBrandAsset } from "@/lib/brand";
import { cn } from "@/lib/cn";

export default function BrandMark({ className }: { className?: string }) {
  if (!brand.logoUrl) {
    return (
      <span
        aria-hidden
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-md bg-brand font-serif text-sm font-bold tracking-wide text-white",
          className,
        )}
      >
        UF
      </span>
    );
  }

  if (isLocalBrandAsset(brand.logoUrl)) {
    return (
      <span
        className={cn(
          "relative flex size-10 shrink-0 overflow-hidden rounded-md bg-paper",
          className,
        )}
      >
        <Image
          src={brand.logoUrl}
          alt={brand.logoAlt}
          width={40}
          height={40}
          className="size-10 object-contain"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-md bg-paper",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.logoUrl}
        alt={brand.logoAlt}
        width={40}
        height={40}
        className="size-10 object-contain"
      />
    </span>
  );
}

import Image from "next/image";
import { brand, isLocalBrandAsset } from "@/lib/brand";
import { cn } from "@/lib/cn";

export default function BrandMark({ className }: { className?: string }) {
  const logoSrc = brand.logoUrl || "/brand/logo.svg";

  if (isLocalBrandAsset(logoSrc)) {
    return (
      <span
        className={cn(
          "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md",
          className,
        )}
      >
        <Image
          src={logoSrc}
          alt={brand.logoAlt}
          width={48}
          height={48}
          priority
          className="size-full object-contain"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt={brand.logoAlt}
        width={48}
        height={48}
        className="size-full object-contain"
      />
    </span>
  );
}

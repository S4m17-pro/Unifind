import Image from "next/image";
import { brand, isLocalBrandAsset } from "@/lib/brand";
import { cn } from "@/lib/cn";

export default function BrandMark({ className }: { className?: string }) {
  const logoSrc = brand.markUrl || "/brand/logos/unifind.png";

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
          alt={brand.markAlt}
          width={48}
          height={48}
          priority
          className="size-full object-cover object-left"
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
        alt={brand.markAlt}
        width={48}
        height={48}
        className="size-full object-cover object-left"
      />
    </span>
  );
}

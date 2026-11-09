import Image from "next/image";
import { brand, isLocalBrandAsset } from "@/lib/brand";
import { cn } from "@/lib/cn";

export default function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  const logoSrc = brand.logoUrl || "/brand/logos/unifind.png";

  if (isLocalBrandAsset(logoSrc)) {
    return (
      <Image
        src={logoSrc}
        alt={brand.logoAlt}
        width={600}
        height={203}
        priority={priority}
        className={cn("h-9 w-auto object-contain", className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoSrc}
      alt={brand.logoAlt}
      className={cn("h-9 w-auto object-contain", className)}
    />
  );
}

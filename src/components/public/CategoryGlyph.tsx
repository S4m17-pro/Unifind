import { FileText, KeyRound, Package, Shirt, Smartphone, Wallet } from "lucide-react";
import { cn } from "@/lib/cn";

function iconFor(category: string) {
  const value = category.toLowerCase();
  if (value.includes("electr") || value.includes("celu") || value.includes("port")) {
    return Smartphone;
  }
  if (value.includes("ropa") || value.includes("prenda") || value.includes("chaqueta")) {
    return Shirt;
  }
  if (value.includes("doc") || value.includes("carnet") || value.includes("cédula") || value.includes("cedula")) {
    return FileText;
  }
  if (value.includes("llave")) {
    return KeyRound;
  }
  if (value.includes("billetera") || value.includes("accesor")) {
    return Wallet;
  }
  return Package;
}

export default function CategoryGlyph({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const Icon = iconFor(category);
  return (
    <span
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-md border border-line bg-brand-soft text-brand",
        className,
      )}
      aria-hidden
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

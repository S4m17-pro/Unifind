import BrandImageSlot from "@/components/brand/BrandImageSlot";
import ItemCard from "@/components/public/ItemCard";
import type { PublicItem } from "@/lib/public-catalog";

export default function ItemGrid({
  items,
  emptyMessage = "No hay objetos en custodia con esos filtros.",
}: {
  items: PublicItem[];
  emptyMessage?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-lg border border-line bg-paper px-6 py-12 text-center">
        <BrandImageSlot slot="empty" variant="empty" className="mb-6 w-full" />
        <p className="max-w-md text-lg text-ink-muted">{emptyMessage}</p>
        <p className="mt-2 max-w-md text-sm text-ink-subtle">
          Pregunta en portería o vuelve más tarde. El catálogo no muestra fotos
          de objetos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

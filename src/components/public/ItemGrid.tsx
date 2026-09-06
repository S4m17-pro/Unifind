import type { PublicItem } from "@/lib/public-catalog";
import ItemCard from "@/components/public/ItemCard";

export default function ItemGrid({
  items,
  emptyMessage = "No hay objetos en custodia con esos filtros.",
}: {
  items: PublicItem[];
  emptyMessage?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-paper px-6 py-16 text-center">
        <p className="text-lg text-ink-muted">{emptyMessage}</p>
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

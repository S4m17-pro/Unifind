import Link from "next/link";
import type { CatalogFilterOptions, CatalogStatusFilter } from "@/lib/public-catalog";
import { STATUS_LABELS } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export type CatalogFilterValues = {
  category?: string;
  custodyStation?: string;
  status?: CatalogStatusFilter;
};

const STATUS_OPTIONS: Array<{ value: CatalogStatusFilter; label: string }> = [
  { value: "DISPONIBLES", label: "Disponibles" },
  { value: "EN_BODEGA", label: STATUS_LABELS.EN_BODEGA },
  { value: "LISTO_PARA_DONACION", label: STATUS_LABELS.LISTO_PARA_DONACION },
  { value: "ENTREGADO", label: STATUS_LABELS.ENTREGADO },
  { value: "TODOS", label: "Todos" },
];

const fieldLabel = "text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted";

export default function CatalogFilters({
  options,
  current,
  action = "/objetos",
}: {
  options: CatalogFilterOptions;
  current: CatalogFilterValues;
  action?: string;
}) {
  const selectedStatus = current.status ?? "DISPONIBLES";

  return (
    <form
      method="get"
      action={action}
      className="grid gap-3 rounded-lg border border-line bg-paper p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
    >
      <div className="space-y-2">
        <Label htmlFor="categoria" className={fieldLabel}>
          Categoría
        </Label>
        <Select
          id="categoria"
          name="categoria"
          defaultValue={current.category ?? ""}
          className="h-11"
        >
          <option value="">Todas</option>
          {options.categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="porteria" className={fieldLabel}>
          Portería
        </Label>
        <Select
          id="porteria"
          name="porteria"
          defaultValue={current.custodyStation ?? ""}
          className="h-11"
        >
          <option value="">Todas</option>
          {options.stations.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estado" className={fieldLabel}>
          Estado
        </Label>
        <Select id="estado" name="estado" defaultValue={selectedStatus} className="h-11">
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="h-11 flex-1 font-semibold">
          Filtrar
        </Button>
        <Button asChild variant="outline" className="h-11 flex-1">
          <Link href={action}>Limpiar</Link>
        </Button>
      </div>
    </form>
  );
}

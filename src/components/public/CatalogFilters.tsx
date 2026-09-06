import Link from "next/link";
import type { CatalogFilterOptions, CatalogStatusFilter } from "@/lib/public-catalog";
import { STATUS_LABELS } from "@/lib/labels";

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
      className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
    >
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Categoría
        </span>
        <select
          name="categoria"
          defaultValue={current.category ?? ""}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Todas</option>
          {options.categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Portería
        </span>
        <select
          name="porteria"
          defaultValue={current.custodyStation ?? ""}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Todas</option>
          {options.stations.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Estado
        </span>
        <select
          name="estado"
          defaultValue={selectedStatus}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-500"
        >
          Filtrar
        </button>
        <Link
          href={action}
          className="inline-flex items-center justify-center rounded-xl border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
        >
          Limpiar
        </Link>
      </div>
    </form>
  );
}

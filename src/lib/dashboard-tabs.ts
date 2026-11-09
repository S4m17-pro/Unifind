export const DASHBOARD_TABS = [
  "resumen",
  "registro",
  "reclamos",
  "entregas",
  "inventario",
] as const;

export type DashboardTab = (typeof DASHBOARD_TABS)[number];

export const DEFAULT_DASHBOARD_TAB: DashboardTab = "resumen";

export function isDashboardTab(value: unknown): value is DashboardTab {
  return (
    typeof value === "string" &&
    (DASHBOARD_TABS as readonly string[]).includes(value)
  );
}

export function dashboardTabHref(tab: DashboardTab): string {
  return `/admin/dashboard?tab=${tab}`;
}

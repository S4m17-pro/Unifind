"use client";

import Link from "next/link";
import {
  Boxes,
  ClipboardCheck,
  LayoutDashboard,
  PackagePlus,
  ScanLine,
  type LucideIcon,
} from "lucide-react";
import {
  DASHBOARD_TABS,
  dashboardTabHref,
  type DashboardTab,
} from "@/lib/dashboard-tabs";
import { cn } from "@/lib/cn";

const TAB_META: Record<DashboardTab, { label: string; icon: LucideIcon }> = {
  resumen: { label: "Resumen", icon: LayoutDashboard },
  registro: { label: "Registrar", icon: PackagePlus },
  reclamos: { label: "Reclamos", icon: ClipboardCheck },
  entregas: { label: "Entregas", icon: ScanLine },
  inventario: { label: "Inventario", icon: Boxes },
};

export default function DashboardTabs({
  active,
  pendingClaims = 0,
  className,
}: {
  active: DashboardTab;
  pendingClaims?: number;
  className?: string;
}) {
  return (
    <nav
      aria-label="Secciones del panel de portería"
      className={cn("no-scrollbar overflow-x-auto", className)}
    >
      <div className="flex min-w-max items-center gap-1 rounded-lg border border-line bg-paper p-1">
        {DASHBOARD_TABS.map((tab) => {
          const { label, icon: Icon } = TAB_META[tab];
          const isActive = tab === active;
          return (
            <Link
              key={tab}
              href={dashboardTabHref(tab)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand text-white"
                  : "text-ink-muted hover:bg-bar hover:text-ink",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <span>{label}</span>
              {tab === "reclamos" && pendingClaims > 0 ? (
                <span
                  className={cn(
                    "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    isActive ? "bg-white text-brand" : "bg-brand text-white",
                  )}
                >
                  {pendingClaims}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

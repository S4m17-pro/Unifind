import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const TONES = {
  brand: {
    icon: "bg-brand-soft text-brand",
    value: "text-brand",
  },
  success: {
    icon: "bg-success-soft text-success",
    value: "text-success",
  },
  gold: {
    icon: "bg-gold-soft text-gold-ink",
    value: "text-gold-ink",
  },
  ink: {
    icon: "bg-bar text-ink-muted",
    value: "text-ink",
  },
} as const;

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "ink",
  suffix,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  suffix?: string;
}) {
  const style = TONES[tone];

  return (
    <div className="rounded-lg border border-line bg-paper p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
          {label}
        </p>
        <span className={cn("flex size-9 items-center justify-center rounded-md", style.icon)}>
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      <p className={cn("mt-3 font-serif text-3xl font-semibold tabular-nums", style.value)}>
        {value}
        {suffix ? <span className="ml-1 text-lg font-medium">{suffix}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-xs leading-relaxed text-ink-subtle">{hint}</p> : null}
    </div>
  );
}

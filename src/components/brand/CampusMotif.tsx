import { cn } from "@/lib/cn";

/** Geometric campus sketch — Libre red roofs, gold windows. Not a stock photo. */
export function CampusMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 220"
      className={cn("text-brand", className)}
      aria-hidden
    >
      <rect x="0" y="168" width="360" height="52" fill="#E8E6DF" />
      <rect x="0" y="168" width="360" height="3" fill="#C8102E" />

      <rect x="28" y="88" width="86" height="80" fill="#F7F1D4" stroke="#C8102E" strokeWidth="2" />
      <rect x="28" y="76" width="86" height="14" fill="#C8102E" />
      <rect x="40" y="104" width="14" height="18" fill="#B89600" opacity="0.85" />
      <rect x="64" y="104" width="14" height="18" fill="#B89600" opacity="0.55" />
      <rect x="88" y="104" width="14" height="18" fill="#B89600" opacity="0.85" />
      <rect x="40" y="132" width="14" height="18" fill="#B89600" opacity="0.55" />
      <rect x="88" y="132" width="14" height="18" fill="#B89600" opacity="0.85" />
      <rect x="58" y="138" width="26" height="30" fill="#1A1A1A" />

      <rect x="128" y="48" width="108" height="120" fill="#FFFFFF" stroke="#C8102E" strokeWidth="2" />
      <rect x="128" y="36" width="108" height="16" fill="#C8102E" />
      <rect x="168" y="12" width="28" height="28" fill="#B89600" />
      <rect x="174" y="18" width="16" height="16" fill="#F7F1D4" />
      <rect x="144" y="68" width="16" height="20" fill="#B89600" opacity="0.8" />
      <rect x="174" y="68" width="16" height="20" fill="#B89600" opacity="0.45" />
      <rect x="204" y="68" width="16" height="20" fill="#B89600" opacity="0.8" />
      <rect x="144" y="100" width="16" height="20" fill="#B89600" opacity="0.45" />
      <rect x="174" y="100" width="16" height="20" fill="#B89600" opacity="0.8" />
      <rect x="204" y="100" width="16" height="20" fill="#B89600" opacity="0.45" />
      <rect x="166" y="136" width="32" height="32" fill="#1A1A1A" />

      <rect x="250" y="96" width="82" height="72" fill="#F8E8EB" stroke="#C8102E" strokeWidth="2" />
      <rect x="250" y="84" width="82" height="14" fill="#C8102E" />
      <rect x="264" y="112" width="14" height="16" fill="#B89600" opacity="0.8" />
      <rect x="288" y="112" width="14" height="16" fill="#B89600" opacity="0.5" />
      <rect x="312" y="112" width="14" height="16" fill="#B89600" opacity="0.8" />
      <rect x="278" y="140" width="26" height="28" fill="#1A1A1A" />

      <circle cx="52" cy="188" r="7" fill="#1A1A1A" opacity="0.12" />
      <circle cx="300" cy="190" r="7" fill="#1A1A1A" opacity="0.12" />
    </svg>
  );
}

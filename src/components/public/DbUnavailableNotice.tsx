export default function DbUnavailableNotice() {
  return (
    <div className="rounded-2xl border border-amber-800/70 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
      No se pudo leer el catálogo. Comprueba Postgres y{" "}
      <code className="font-mono text-amber-100">DATABASE_URL</code> (ver README de la
      fundación / PR #2).
    </div>
  );
}

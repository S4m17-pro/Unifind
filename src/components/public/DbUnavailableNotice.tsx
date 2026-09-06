export default function DbUnavailableNotice() {
  return (
    <div className="rounded-lg border border-gold/40 bg-gold-soft px-4 py-3 text-sm text-gold-ink">
      No se pudo leer el catálogo. Comprueba Postgres y{" "}
      <code className="font-mono text-ink">DATABASE_URL</code> (ver README de la
      fundación / PR #2).
    </div>
  );
}

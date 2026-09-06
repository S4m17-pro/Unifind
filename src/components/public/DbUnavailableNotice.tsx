export default function DbUnavailableNotice() {
  return (
    <div className="rounded-2xl border border-amber-800/70 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
      El catálogo no pudo leer la base de datos. Cuando Back deje Prisma y{" "}
      <code className="font-mono text-amber-100">DATABASE_URL</code> listos, los objetos
      aparecerán aquí.
    </div>
  );
}

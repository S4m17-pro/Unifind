export default function CatalogLoading() {
  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 h-24 animate-pulse rounded-2xl bg-slate-900/80" />
        <div className="mb-8 h-28 animate-pulse rounded-2xl bg-slate-900/80" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-2xl bg-slate-900/80" />
          ))}
        </div>
      </div>
    </main>
  );
}

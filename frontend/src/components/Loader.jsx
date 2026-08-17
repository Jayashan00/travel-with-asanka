export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="h-48 animate-pulse bg-shell" />
          <div className="space-y-3 p-6">
            <div className="h-4 w-2/3 animate-pulse rounded bg-shell" />
            <div className="h-3 w-full animate-pulse rounded bg-shell" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-shell" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ title, hint, action }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-8 py-14 text-center">
      <h3 className="text-xl">{title}</h3>
      {hint && <p className="max-w-md text-sm text-ink/60">{hint}</p>}
      {action}
    </div>
  )
}

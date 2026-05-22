export function CardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 bg-slate-200 rounded-lg" />
        <div className="h-4 w-12 bg-slate-200 rounded" />
      </div>
      <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
      <div className="h-7 w-20 bg-slate-200 rounded" />
    </div>
  )
}

export function ListSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 animate-pulse">
          <div className="h-5 w-3/4 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-1/2 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 4, cols = 4 }) {
  return (
    <div className="animate-pulse">
      <div className="flex gap-4 p-4 border-b border-slate-100">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-slate-50">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 bg-slate-100 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

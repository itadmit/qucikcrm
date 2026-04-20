export function CardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-100 rounded-xl"></div>
          <div>
            <div className="h-7 w-36 bg-zinc-200 rounded-lg mb-1.5"></div>
            <div className="h-3.5 w-52 bg-zinc-100 rounded"></div>
          </div>
        </div>
        <div className="h-9 w-28 bg-zinc-900/10 rounded-lg"></div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-200/70 p-5">
            <div className="h-4 w-28 bg-zinc-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="p-3 border border-zinc-100 rounded-xl">
                  <div className="h-4 w-full bg-zinc-100 rounded mb-2"></div>
                  <div className="h-3 w-3/4 bg-zinc-50 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

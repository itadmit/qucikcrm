export function ReportsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-zinc-100 rounded-xl"></div>
        <div>
          <div className="h-7 w-40 bg-zinc-200 rounded-lg mb-1.5"></div>
          <div className="h-3.5 w-56 bg-zinc-100 rounded"></div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-200/70 p-5">
            <div className="w-9 h-9 bg-zinc-100 rounded-xl mb-3"></div>
            <div className="h-8 w-14 bg-zinc-200 rounded mb-1.5"></div>
            <div className="h-3 w-24 bg-zinc-100 rounded"></div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-200/70 p-6">
            <div className="h-5 w-28 bg-zinc-200 rounded mb-5"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-20 bg-zinc-100 rounded"></div>
                    <div className="h-3 w-14 bg-zinc-100 rounded"></div>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Forecast */}
      <div className="bg-white rounded-2xl border border-zinc-200/70 p-6">
        <div className="h-5 w-36 bg-zinc-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="h-3 w-14 bg-zinc-100 rounded"></div>
                <div className="flex gap-4">
                  <div className="h-3 w-20 bg-zinc-100 rounded"></div>
                  <div className="h-3 w-20 bg-zinc-100 rounded"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-2 bg-zinc-100 rounded-full"></div>
                <div className="flex-1 h-2 bg-zinc-50 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

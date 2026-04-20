export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-3 w-28 bg-zinc-200 rounded mb-2.5"></div>
            <div className="h-9 w-56 bg-zinc-200 rounded-lg mb-2"></div>
            <div className="h-5 w-72 bg-zinc-100 rounded"></div>
          </div>
          <div className="flex gap-1.5">
            <div className="h-9 w-28 bg-zinc-100 rounded-lg border border-zinc-200"></div>
            <div className="h-9 w-24 bg-zinc-100 rounded-lg border border-zinc-200"></div>
            <div className="h-9 w-24 bg-zinc-100 rounded-lg border border-zinc-200 hidden sm:block"></div>
            <div className="h-9 w-28 bg-zinc-900/10 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-200/70 p-5">
            <div className="w-9 h-9 bg-zinc-100 rounded-xl mb-3"></div>
            <div className="h-8 w-14 bg-zinc-200 rounded mb-1.5"></div>
            <div className="h-3 w-24 bg-zinc-100 rounded"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200/70 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-zinc-100 rounded-lg"></div>
                <div className="h-5 w-24 bg-zinc-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50">
                  <div className="w-4 h-4 bg-zinc-200 rounded-full hidden sm:block"></div>
                  <div className="flex-1">
                    <div className="h-4 w-44 bg-zinc-200 rounded mb-1.5"></div>
                    <div className="h-3 w-28 bg-zinc-100 rounded"></div>
                  </div>
                  <div className="h-4 w-4 bg-zinc-100 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200/70 p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-zinc-100 rounded-lg"></div>
              <div className="h-5 w-20 bg-zinc-200 rounded"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-3.5 w-28 bg-zinc-100 rounded"></div>
                  <div className="h-5 w-10 bg-zinc-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotificationsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-100 rounded-xl"></div>
          <div>
            <div className="h-7 w-24 bg-zinc-200 rounded-lg mb-1.5"></div>
            <div className="h-3.5 w-40 bg-zinc-100 rounded"></div>
          </div>
        </div>
        <div className="h-9 w-28 bg-zinc-100 rounded-lg border border-zinc-200"></div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 bg-zinc-100 p-0.5 rounded-lg w-fit">
        <div className="h-8 w-20 bg-white rounded-md shadow-sm"></div>
        <div className="h-8 w-20 bg-transparent rounded-md"></div>
        <div className="h-8 w-20 bg-transparent rounded-md"></div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-200/70 p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-zinc-100 rounded-xl shrink-0"></div>
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-40 bg-zinc-200 rounded"></div>
                <div className="h-3 w-full bg-zinc-100 rounded"></div>
                <div className="h-3 w-20 bg-zinc-50 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

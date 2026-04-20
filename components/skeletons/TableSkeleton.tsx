export function TableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-100 rounded-xl"></div>
          <div>
            <div className="h-7 w-32 bg-zinc-200 rounded-lg mb-1.5"></div>
            <div className="h-3.5 w-48 bg-zinc-100 rounded"></div>
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="h-9 w-24 bg-zinc-100 rounded-lg border border-zinc-200"></div>
          <div className="h-9 w-28 bg-zinc-900/10 rounded-lg"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-200/70 p-5">
            <div className="w-9 h-9 bg-zinc-100 rounded-xl mb-3"></div>
            <div className="h-8 w-14 bg-zinc-200 rounded mb-1.5"></div>
            <div className="h-3 w-20 bg-zinc-100 rounded"></div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200/70 p-3">
        <div className="flex gap-2">
          <div className="flex-1 h-9 bg-zinc-100 rounded-lg"></div>
          <div className="h-9 w-20 bg-zinc-100 rounded-lg border border-zinc-200"></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/70 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200/70 bg-zinc-50/50">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="text-right py-2.5 px-4">
                  <div className="h-3 w-16 bg-zinc-200 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b border-zinc-100">
                {Array.from({ length: columns }).map((_, j) => (
                  <td key={j} className="py-3 px-4">
                    <div className={`h-4 bg-zinc-100 rounded ${j === 0 ? 'w-32' : 'w-20'}`}></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

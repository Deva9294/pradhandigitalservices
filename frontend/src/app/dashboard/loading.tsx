import { Skeleton } from "@/components/common/Skeleton";

/** Dashboard loading skeleton — stats cards + recent applications list */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="container mx-auto px-4 py-10">
        {/* Welcome header */}
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Stats cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-navy-800 p-6 border border-navy-100 dark:border-navy-700"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-navy-800 p-5 border border-navy-100 dark:border-navy-700 text-center"
            >
              <Skeleton className="h-10 w-10 mx-auto mb-3 rounded-xl" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>

        {/* Recent applications table/list */}
        <Skeleton className="h-7 w-56 mb-4" />
        <div className="rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700 overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-5 gap-4 p-4 border-b border-navy-100 dark:border-navy-700">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border-b border-navy-50 dark:border-navy-700/50 last:border-b-0"
            >
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

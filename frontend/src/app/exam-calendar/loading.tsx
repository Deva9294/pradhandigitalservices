import { Skeleton } from "@/components/common/Skeleton";

/** Exam Calendar loading skeleton — header + calendar/list grid */
export default function ExamCalendarLoading() {
  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="container mx-auto px-4 py-10">
        {/* Page header */}
        <Skeleton className="h-9 w-56 mb-3" />
        <Skeleton className="h-4 w-80 max-w-full mb-8" />

        {/* Calendar month header skeleton */}
        <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Calendar-like grid */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {/* Day headers */}
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={`hd-${i}`} className="h-8 rounded-lg" />
          ))}
          {/* Day cells */}
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={`dc-${i}`} className="h-16 rounded-xl" />
          ))}
        </div>

        {/* Upcoming exam list */}
        <Skeleton className="h-7 w-48 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white dark:bg-navy-800 p-5 border border-navy-100 dark:border-navy-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-9 w-24 rounded-xl shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

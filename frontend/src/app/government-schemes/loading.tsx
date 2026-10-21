import { Skeleton } from "@/components/common/Skeleton";

/** Government Schemes resource list loading skeleton */
export default function GovernmentSchemesLoading() {
  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="container mx-auto px-4 py-10">
        {/* Page header */}
        <Skeleton className="h-9 w-72 mb-3" />
        <Skeleton className="h-4 w-96 max-w-full mb-8" />

        {/* Resource list items */}
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white dark:bg-navy-800 p-6 border border-navy-100 dark:border-navy-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-10 w-28 rounded-xl shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

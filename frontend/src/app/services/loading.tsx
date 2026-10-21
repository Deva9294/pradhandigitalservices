import { Skeleton, ServiceCardSkeleton } from "@/components/common/Skeleton";

/** Services page loading skeleton — matches the grid + search layout */
export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="container mx-auto px-4 py-10">
        {/* Page header skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="h-9 w-72 mx-auto mb-3 bg-navy-700" />
          <Skeleton className="h-4 w-96 max-w-full mx-auto bg-navy-800" />
        </div>

        {/* Search & filter bar skeleton */}
        <div className="rounded-[32px] border border-white/10 bg-navy-900/50 p-6 flex flex-col md:flex-row gap-4 mb-8">
          <Skeleton className="h-12 flex-1 rounded-2xl bg-navy-800" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-20 rounded-2xl bg-navy-800" />
            ))}
          </div>
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

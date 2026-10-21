import { Skeleton, VacancyCardSkeleton } from "@/components/common/Skeleton";

/** Vacancies page loading skeleton — matches the filters + vacancy list layout */
export default function VacanciesLoading() {
  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="container mx-auto px-4 py-10">
        {/* Page header */}
        <div className="text-center mb-8">
          <Skeleton className="h-9 w-80 mx-auto mb-3 bg-navy-700" />
          <Skeleton className="h-4 w-64 mx-auto bg-navy-800" />
        </div>

        {/* Filters skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 p-6 rounded-[32px] border border-white/10 bg-navy-900/50">
          <Skeleton className="lg:col-span-2 h-11 rounded-2xl bg-navy-800" />
          <Skeleton className="h-11 rounded-2xl bg-navy-800" />
          <Skeleton className="h-11 rounded-2xl bg-navy-800" />
          <Skeleton className="h-11 rounded-2xl bg-navy-800" />
        </div>

        {/* Vacancy cards list */}
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <VacancyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

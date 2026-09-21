import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-navy-100 dark:bg-navy-800",
        className
      )}
    />
  );
}

// Service Card Skeleton
export function ServiceCardSkeleton() {
  return (
    <div className="p-4 bg-white/90 dark:bg-navy-800/90 rounded-[28px] border border-navy-100 dark:border-navy-700">
      <Skeleton className="w-12 h-12 mx-auto mb-3 rounded-2xl" />
      <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
      <Skeleton className="h-3 w-1/2 mx-auto" />
    </div>
  );
}

// Vacancy Card Skeleton
export function VacancyCardSkeleton() {
  return (
    <div className="p-5 bg-navy-900/50 rounded-[28px] border border-white/10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="w-16 h-5 rounded-full" />
            <Skeleton className="w-12 h-4 rounded" />
          </div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <div className="flex gap-3">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
          </div>
        </div>
        <Skeleton className="w-24 h-10 rounded-xl" />
      </div>
    </div>
  );
}

// News Card Skeleton
export function NewsCardSkeleton() {
  return (
    <div className="p-5 bg-white dark:bg-navy-800 rounded-2xl border border-navy-100 dark:border-navy-700">
      <Skeleton className="h-5 w-full mb-3" />
      <Skeleton className="h-4 w-1/3 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

// Form Card Skeleton
export function FormCardSkeleton() {
  return (
    <div className="p-5 bg-white dark:bg-navy-800 rounded-2xl border border-navy-100 dark:border-navy-700">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-10 w-24 rounded-xl" />
    </div>
  );
}

// Grid Skeleton for loading multiple items
export function GridSkeleton({ count = 6, SkeletonComponent }: { count?: number; SkeletonComponent: React.ComponentType }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}

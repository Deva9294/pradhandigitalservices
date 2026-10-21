import { Skeleton } from "@/components/common/Skeleton";

/** Contact page loading skeleton — info cards + contact form */
export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="container mx-auto px-4 py-10">
        {/* Page header */}
        <div className="text-center mb-10">
          <Skeleton className="h-9 w-56 mx-auto mb-3" />
          <Skeleton className="h-4 w-80 max-w-full mx-auto" />
        </div>

        {/* Contact info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-navy-800 p-6 border border-navy-100 dark:border-navy-700 text-center"
            >
              <Skeleton className="h-10 w-10 mx-auto mb-3 rounded-full" />
              <Skeleton className="h-5 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-36 mx-auto" />
            </div>
          ))}
        </div>

        {/* Form skeleton */}
        <div className="max-w-2xl mx-auto rounded-3xl bg-white dark:bg-navy-800 p-8 border border-navy-100 dark:border-navy-700">
          <Skeleton className="h-7 w-48 mb-6" />
          <div className="space-y-5">
            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            </div>
            {/* Phone */}
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            {/* Subject */}
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            {/* Message */}
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
            {/* Submit button */}
            <Skeleton className="h-12 w-full rounded-2xl bg-saffron-200 dark:bg-saffron-900/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

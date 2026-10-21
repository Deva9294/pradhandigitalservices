import { Skeleton } from "@/components/common/Skeleton";

/** About page loading skeleton — hero section + content blocks */
export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      {/* Hero section skeleton */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 py-20">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-12 w-56 mx-auto mb-4 bg-navy-700" />
          <Skeleton className="h-6 w-72 mx-auto mb-2 bg-navy-700" />
          <Skeleton className="h-4 w-96 max-w-full mx-auto bg-navy-800" />
        </div>
      </section>

      {/* Who We Are section */}
      <section className="py-16 bg-white dark:bg-navy-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>

          {/* Values grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-navy-50 dark:bg-navy-800 p-6 border border-navy-100 dark:border-navy-700 text-center"
              >
                <Skeleton className="h-12 w-12 mx-auto mb-4 rounded-xl" />
                <Skeleton className="h-5 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="py-16 bg-navy-50 dark:bg-navy-950">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-56 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-navy-800 p-6 border border-navy-100 dark:border-navy-700"
              >
                <Skeleton className="h-10 w-10 mb-4 rounded-xl" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white dark:bg-navy-900">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-72 mx-auto mb-6" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-12 w-36 rounded-2xl" />
            <Skeleton className="h-12 w-36 rounded-2xl" />
          </div>
        </div>
      </section>
    </div>
  );
}

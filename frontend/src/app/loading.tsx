import BrandLogo from "@/components/ui/BrandLogo";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between gap-4 mb-12">
          <BrandLogo compact />
          <div className="text-right text-sm text-navy-300">Loading secure digital seva experience...</div>
        </div>

        <div className="space-y-6">
          <div className="h-20 rounded-[2rem] skeleton" />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <div className="h-44 rounded-[2rem] skeleton" />
              <div className="h-14 rounded-3xl skeleton" />
            </div>
            <div className="space-y-4">
              <div className="h-72 rounded-[2rem] skeleton" />
            </div>
            <div className="space-y-4">
              <div className="h-32 rounded-[2rem] skeleton" />
              <div className="h-20 rounded-3xl skeleton" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-40 rounded-[2rem] skeleton" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

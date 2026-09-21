export default function SectionSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-[2rem] p-6 bg-navy-950/80 border border-white/10 shadow-lg">
          <div className="h-4 w-1/2 mb-4 rounded-full skeleton" />
          <div className="h-10 w-3/4 mb-4 rounded-2xl skeleton" />
          <div className="space-y-3">
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 rounded-full w-5/6 skeleton" />
            <div className="h-3 rounded-full w-2/3 skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

import Image from "next/image";

/**
 * Full-page branded loading screen for Pradhan Digital Services.
 *
 * Features:
 * - Brand logo with gentle pulse
 * - Saffron progress bar animation
 * - Shimmer text effect on the brand name
 * - Bilingual loading text (Hindi / English)
 * - Light & dark mode support
 * - Pure CSS animations (no JS overhead)
 */
export default function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-navy-950 transition-colors"
      role="status"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-6 px-4">
        {/* Logo with pulse & golden aura */}
        <div className="relative animate-pulse-slow">
          <div className="w-24 h-24 rounded-3xl bg-[#0C0F14] ring-2 ring-amber-500/40 shadow-2xl overflow-hidden flex items-center justify-center p-1.5">
            <Image
              src="/brand-icon.svg"
              alt="Pradhan Digital Services Logo"
              width={96}
              height={96}
              className="object-contain w-full h-full scale-[1.05]"
              priority
            />
          </div>
          {/* Subtle warm golden glow aura */}
          <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-amber-500/25 blur-2xl -z-10 animate-pulse" />
        </div>

        {/* Brand name with shimmer */}
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-navy-900 dark:text-white relative overflow-hidden tracking-tight">
            <span className="relative z-10">Pradhan Digital Services</span>
            {/* Shimmer overlay */}
            <span
              className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent animate-shimmer"
              aria-hidden="true"
            />
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-saffron-600 dark:text-saffron-400 mt-1.5 font-semibold">
            Digital Solutions | Real Results | Better Tomorrow
          </p>
        </div>

        {/* Animated saffron progress bar */}
        <div className="w-48 h-1 rounded-full bg-navy-100 dark:bg-navy-800 overflow-hidden">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-saffron-400 via-saffron-500 to-saffron-600 animate-progress-slide" />
        </div>

        {/* Bilingual loading text */}
        <div className="text-center space-y-1">
          <p className="text-sm text-navy-500 dark:text-navy-400 animate-pulse">
            Loading…
          </p>
          <p className="text-sm text-navy-400 dark:text-navy-500 animate-pulse font-noto-devanagari">
            लोड हो रहा है…
          </p>
        </div>
      </div>

      {/* Inline keyframe styles — zero JS, pure CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes shimmer {
              0%   { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            @keyframes progress-slide {
              0%   { transform: translateX(-100%); }
              100% { transform: translateX(300%); }
            }
            @keyframes pulse-slow {
              0%, 100% { transform: scale(1); opacity: 1; }
              50%      { transform: scale(0.96); opacity: 0.85; }
            }
            .animate-shimmer {
              animation: shimmer 2s ease-in-out infinite;
            }
            .animate-progress-slide {
              animation: progress-slide 1.8s ease-in-out infinite;
            }
            .animate-pulse-slow {
              animation: pulse-slow 2.4s ease-in-out infinite;
            }
          `,
        }}
      />
    </div>
  );
}

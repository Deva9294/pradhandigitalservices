import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  compact?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  tagline?: string;
  className?: string;
  variant?: "badge" | "full";
}

export default function BrandLogo({ 
  compact = false, 
  size = "md",
  showTagline = true,
  tagline = "Digital Solutions | Real Results",
  className,
  variant = "badge"
}: BrandLogoProps) {
  const sizeMap = {
    sm: { icon: 34, text: "text-sm", tagline: "text-[9px]", gap: "gap-2.5", rounded: "rounded-xl" },
    md: { icon: 46, text: "text-base", tagline: "text-[11px]", gap: "gap-3", rounded: "rounded-2xl" },
    lg: { icon: 60, text: "text-lg", tagline: "text-xs", gap: "gap-3.5", rounded: "rounded-2xl" },
    xl: { icon: 80, text: "text-xl", tagline: "text-sm", gap: "gap-4", rounded: "rounded-3xl" },
  };

  const s = sizeMap[size];

  if (variant === "full") {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl border border-amber-500/20 shadow-xl bg-[#0C0F14]", className)}>
        <Image
          src="/logo-full-dark.png"
          alt="Pradhan Digital Services"
          width={s.icon * 6}
          height={s.icon * 2}
          className="h-auto w-full object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center", s.gap, className)}>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden shadow-lg bg-[#0C0F14] ring-1 ring-amber-500/30 hover:ring-amber-500/60 transition-all duration-300",
          s.rounded
        )}
        style={{ width: s.icon, height: s.icon }}
      >
        <Image
          src="/brand-icon.svg"
          alt="Pradhan Digital Services Logo"
          width={s.icon}
          height={s.icon}
          className="object-contain w-full h-full scale-[1.05]"
          priority
        />
        {/* Subtle golden top-edge shine */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      </div>
      {!compact && (
        <div className="leading-tight min-w-0">
          <div className={cn("font-bold text-navy-900 dark:text-white tracking-tight", s.text)}>
            Pradhan Digital Services
          </div>
          {showTagline && (
            <div className={cn("uppercase tracking-[0.16em] text-saffron-600 dark:text-saffron-400 font-semibold", s.tagline)}>
              {tagline}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

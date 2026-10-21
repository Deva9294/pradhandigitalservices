import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  compact?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  tagline?: string;
  className?: string;
  variant?: "badge" | "full";
  isDarkSurface?: boolean;
}

export default function BrandLogo({ 
  compact = false, 
  size = "md",
  showTagline = true,
  tagline = "TRUST | DIGITAL | INNOVATION",
  className,
  variant = "badge",
  isDarkSurface = true
}: BrandLogoProps) {
  const sizeMap = {
    sm: { 
      icon: 38, 
      text: "text-sm", 
      tagline: "text-[9px]", 
      gap: "gap-2.5", 
      rounded: "rounded-xl" 
    },
    md: { 
      icon: 48, 
      text: "text-base sm:text-lg", 
      tagline: "text-[10px] sm:text-[11px]", 
      gap: "gap-3", 
      rounded: "rounded-xl" 
    },
    lg: { 
      icon: 64, 
      text: "text-xl sm:text-2xl", 
      tagline: "text-xs", 
      gap: "gap-3.5", 
      rounded: "rounded-2xl" 
    },
    xl: { 
      icon: 84, 
      text: "text-2xl sm:text-3xl", 
      tagline: "text-sm", 
      gap: "gap-4", 
      rounded: "rounded-3xl" 
    },
  };

  const s = sizeMap[size];

  if (variant === "full") {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl border border-amber-500/30 shadow-xl bg-gradient-to-r from-[#071333] via-[#0A1B4D] to-[#071333] p-1.5", className)}>
        <Image
          src="/logo-header-transparent.png"
          alt="Pradhan Digital Services"
          width={s.icon * 6}
          height={s.icon * 2}
          className="h-auto w-full max-h-16 object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center select-none", s.gap, className)}>
      {/* Diya Emblem Badge - Perfectly matched to Navy Blue #0A1B4D Header with Warm Saffron Glow */}
      <div
        className={cn(
          "relative shrink-0 flex items-center justify-center overflow-hidden transition-all duration-300",
          "bg-gradient-to-br from-[#12286E] via-[#0A1B4D] to-[#071333]",
          "border border-amber-400/50 hover:border-amber-400/90",
          "shadow-[0_2px_14px_rgba(255,122,0,0.3)] hover:shadow-[0_4px_20px_rgba(255,122,0,0.5)]",
          s.rounded
        )}
        style={{ width: s.icon, height: s.icon }}
      >
        <Image
          src="/logo-icon-transparent.png"
          alt="Pradhan Digital Services"
          width={s.icon * 2}
          height={s.icon * 2}
          className="object-contain w-full h-full p-0.5 scale-[1.08] drop-shadow-[0_2px_8px_rgba(255,122,0,0.4)]"
          priority
        />
        {/* Subtle diagonal glossy refraction */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      </div>

      {/* Brand Typography */}
      {!compact && (
        <div className="leading-tight min-w-0">
          <div 
            className={cn(
              "font-black tracking-tight drop-shadow-sm", 
              isDarkSurface ? "text-white" : "text-[#0A1B4D] dark:text-white",
              s.text
            )}
          >
            Pradhan Digital Services
          </div>
          {showTagline && (
            <div 
              className={cn(
                "uppercase tracking-[0.18em] font-extrabold text-[#FF7A00] drop-shadow-xs", 
                s.tagline
              )}
            >
              {tagline}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

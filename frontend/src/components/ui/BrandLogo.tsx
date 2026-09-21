import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  compact?: boolean;
}

export default function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", compact && "gap-2")}>
      <div className="relative w-12 h-12 rounded-[28px] bg-navy-950 ring-1 ring-white/10 shadow-2xl overflow-hidden">
        <Image
          src="/brand-icon.svg"
          alt="Pradhan Digital Services Logo"
          width={48}
          height={48}
          className="object-contain"
          priority
        />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-semibold text-navy-950 dark:text-white text-base">Pradhan Digital Services</div>
          <div className="text-xs uppercase tracking-[0.26em] text-saffron-500">Digital Seva Portal</div>
        </div>
      )}
    </div>
  );
}

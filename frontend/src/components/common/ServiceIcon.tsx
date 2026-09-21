import Image from "next/image";
import { 
  IdCard, 
  FileBadge, 
  Landmark, 
  Building2, 
  WalletCards, 
  Smartphone, 
  GraduationCap, 
  BriefcaseBusiness, 
  FileText,
  Shield,
  CreditCard,
  Zap,
  Globe
} from "lucide-react";

interface ServiceIconProps {
  type: "official" | "icon";
  src?: string;
  fallback: keyof typeof iconMap;
  alt: string;
  size?: number;
  className?: string;
}

const iconMap = {
  "id-card": IdCard,
  "file-badge": FileBadge,
  "landmark": Landmark,
  "building": Building2,
  "wallet": WalletCards,
  "smartphone": Smartphone,
  "graduation": GraduationCap,
  "briefcase": BriefcaseBusiness,
  "file-text": FileText,
  "shield": Shield,
  "credit-card": CreditCard,
  "zap": Zap,
  "globe": Globe,
};

export default function ServiceIcon({ 
  type, 
  src, 
  fallback, 
  alt, 
  size = 48, 
  className = "" 
}: ServiceIconProps) {
  const IconComponent = iconMap[fallback];

  if (type === "official" && src) {
    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="object-contain"
          onError={(e) => {
            // Fallback to icon if image fails to load
            e.currentTarget.style.display = "none";
            const fallbackElement = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallbackElement) fallbackElement.style.display = "flex";
          }}
        />
        <div className="hidden absolute inset-0 items-center justify-center">
          {IconComponent && <IconComponent size={size * 0.6} className="text-navy-600 dark:text-navy-400" />}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {IconComponent && <IconComponent size={size * 0.6} className="text-navy-600 dark:text-navy-400" />}
    </div>
  );
}

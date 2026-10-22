"use client";

import Image from "next/image";
import { useState } from "react";
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

export interface ServiceIconProps {
  type?: "official" | "icon" | string;
  src?: string;
  slug?: string;
  department?: string;
  name?: string;
  fallback?: keyof typeof iconMap | string;
  alt?: string;
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

export function getOfficialLogoUrl(slug = "", department = "", name = "", explicitSrc?: string): string {
  if (explicitSrc && (explicitSrc.startsWith("/services/") || explicitSrc.startsWith("http"))) {
    return explicitSrc;
  }
  
  const text = `${slug} ${department} ${name}`.toLowerCase();

  // 1. Aadhaar / UIDAI
  if (text.includes("aadhaar") || text.includes("uidai") || text.includes("आधार")) {
    return "/services/uidai-aadhaar.svg";
  }
  // 2. PAN / Income Tax
  if (text.includes("pan") || text.includes("incometax") || text.includes("पैन") || text.includes("nsdl") || text.includes("utiitsl")) {
    return "/services/pan-nsdl.svg";
  }
  // 3. Voter ID / ECI
  if (text.includes("voter") || text.includes("epic") || text.includes("eci") || text.includes("निर्वाचन") || text.includes("मतदाता")) {
    return "/services/eci-voter.svg";
  }
  // 4. Samagra MP
  if (text.includes("samagra") || text.includes("समग्र") || text.includes("sss-id")) {
    return "/services/samagra-mp.svg";
  }
  // 5. Ayushman Bharat / PMJAY / ABHA
  if (text.includes("ayushman") || text.includes("pmjay") || text.includes("pm-jay") || text.includes("आयुष्मान") || text.includes("abha") || text.includes("health-id")) {
    return "/services/ayushman-pmjay.svg";
  }
  // 6. PM Kisan / MP Kisan / Agriculture
  if (text.includes("pm-kisan") || text.includes("pmkisan") || text.includes("kisan") || text.includes("किसान") || text.includes("fasal-bima") || text.includes("uparjan") || text.includes("mandi")) {
    return "/services/pm-kisan.svg";
  }
  // 7. Parivahan / MoRTH / Driving Licence / Vehicle RC / Challan
  if (text.includes("driving") || text.includes("licence") || text.includes("license") || text.includes("parivahan") || text.includes("वाहन") || text.includes("ड्राइविंग") || text.includes("rto") || text.includes("challan") || text.includes("vehicle") || text.includes("rc-") || text.includes("hsrp")) {
    return "/services/parivahan.svg";
  }
  // 8. Passport Seva / MEA
  if (text.includes("passport") || text.includes("पासपोर्ट") || text.includes("mea")) {
    return "/services/passport-seva.svg";
  }
  // 9. Ration Card / NFSA / Food
  if (text.includes("ration") || text.includes("rashan") || text.includes("राशन") || text.includes("खाद्य") || text.includes("nfsa")) {
    return "/services/ration-nfsa.svg";
  }
  // 10. Ladli Behna / Laxmi
  if (text.includes("ladli") || text.includes("लाड़ली") || text.includes("behna") || text.includes("laxmi")) {
    return "/services/ladli-behna.svg";
  }
  // 11. MP Rojgar Portal
  if (text.includes("rojgar") || text.includes("रोजगार") || text.includes("employment")) {
    return "/services/mp-rojgar.svg";
  }
  // 12. DigiLocker / ABC ID
  if (text.includes("digilocker") || text.includes("डिजिलॉकर") || text.includes("abc-id") || text.includes("apaar")) {
    return "/services/digilocker.svg";
  }
  // 13. UMANG
  if (text.includes("umang") || text.includes("उमंग")) {
    return "/services/umang.svg";
  }
  // 14. EPFO / PF / UAN
  if (text.includes("epfo") || text.includes("uan") || text.includes("pf-") || text.includes("epf") || text.includes("भविष्य निधि")) {
    return "/services/epfo.svg";
  }
  // 15. e-Shram / Labour
  if (text.includes("shram") || text.includes("श्रमिक") || text.includes("labour")) {
    return "/services/eshram.svg";
  }
  // 16. MP Bhulekh / Land Records / Khasra / Khatauni
  if (text.includes("khasra") || text.includes("khatauni") || text.includes("bhulekh") || text.includes("naksha") || text.includes("खसरा") || text.includes("भूलेख") || text.includes("b-1")) {
    return "/services/mp-bhulekh.svg";
  }
  // 17. MP Electricity / Bijli
  if (text.includes("electric") || text.includes("bijli") || text.includes("बिजली") || text.includes("mppkvvcl") || text.includes("power")) {
    return "/services/mp-electricity.svg";
  }
  // 18. LPG Gas
  if (text.includes("lpg") || text.includes("gas") || text.includes("गैस") || text.includes("indane") || text.includes("cylinder")) {
    return "/services/lpg-cylinder.svg";
  }
  // 19. FASTag
  if (text.includes("fastag") || text.includes("फास्टैग") || text.includes("toll")) {
    return "/services/fastag.svg";
  }
  // 20. CRS Birth & Death
  if (text.includes("birth") || text.includes("death") || text.includes("marriage") || text.includes("जन्म") || text.includes("मृत्यु") || text.includes("विवाह")) {
    return "/services/crs-india.svg";
  }
  // 21. MPESB / Vyapam
  if (text.includes("mpesb") || text.includes("vyapam") || text.includes("व्यापम") || text.includes("patwari") || text.includes("recruitment")) {
    return "/services/mpesb.svg";
  }
  // 22. MPPSC
  if (text.includes("mppsc") || text.includes("लोक सेवा आयोग")) {
    return "/services/mppsc.svg";
  }
  // 23. SSC
  if (text.includes("ssc")) {
    return "/services/ssc.svg";
  }
  // 24. Railway
  if (text.includes("railway") || text.includes("rrb") || text.includes("irctc") || text.includes("रेलवे")) {
    return "/services/railway.svg";
  }
  // 25. SBI / Banking
  if (text.includes("sbi") || text.includes("bank") || text.includes("aeps") || text.includes("बैंकिंग")) {
    return "/services/sbi.svg";
  }
  // 26. IBPS
  if (text.includes("ibps")) {
    return "/services/ibps.svg";
  }
  // 27. GST
  if (text.includes("gst") || text.includes("जीएसटी")) {
    return "/services/gst.svg";
  }
  // 28. Udyam MSME
  if (text.includes("udyam") || text.includes("msme") || text.includes("उद्यम")) {
    return "/services/udyam.svg";
  }
  // 29. FSSAI
  if (text.includes("fssai") || text.includes("खाद्य सुरक्षा")) {
    return "/services/fssai.svg";
  }
  // 30. CM Helpline 181
  if (text.includes("181") || text.includes("cm-helpline") || text.includes("शिकायत")) {
    return "/services/cm-helpline.svg";
  }
  // 31. MP Police
  if (text.includes("police") || text.includes("पुलिस") || text.includes("fir") || text.includes("cybercrime")) {
    return "/services/police-mp.svg";
  }
  // 32. Courts / Legal
  if (text.includes("court") || text.includes("न्यायालय") || text.includes("vakalat") || text.includes("rti")) {
    return "/services/ecourts.svg";
  }
  // 33. MP Lok Seva (Certificates: Caste, Income, Domicile, EWS, etc.)
  if (text.includes("certificate") || text.includes("प्रमाण") || text.includes("income") || text.includes("caste") || text.includes("domicile") || text.includes("niwas") || text.includes("ews") || text.includes("obc") || text.includes("lokseva") || text.includes("edistrict")) {
    return "/services/mp-lokseva.svg";
  }

  return "/services/mp-lokseva.svg";
}

export default function ServiceIcon({ 
  type = "official", 
  src, 
  slug = "",
  department = "",
  name = "",
  fallback = "id-card", 
  alt = "Service Icon", 
  size = 48, 
  className = "" 
}: ServiceIconProps) {
  const [hasError, setHasError] = useState(false);
  const IconComponent = (fallback && iconMap[fallback as keyof typeof iconMap]) || IdCard;

  // Resolve logo URL
  const logoUrl = getOfficialLogoUrl(slug, department, name, src);

  // If error loading or explicitly requested generic icon without logo
  if (hasError || (type === "icon" && !slug && !name && !src)) {
    return (
      <div 
        className={`flex items-center justify-center shrink-0 rounded-2xl bg-saffron-50 dark:bg-saffron-950/30 text-saffron-600 ${className}`} 
        style={{ width: size, height: size }}
      >
        <IconComponent size={Math.round(size * 0.58)} />
      </div>
    );
  }

  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 overflow-hidden rounded-2xl transition-transform hover:scale-105 ${className}`} 
      style={{ width: size, height: size }}
    >
      <Image
        src={logoUrl}
        alt={alt || name || slug || "Official Service Logo"}
        width={size}
        height={size}
        className="object-contain w-full h-full drop-shadow-sm select-none pointer-events-none"
        priority={size >= 48}
        unoptimized
        onError={() => setHasError(true)}
      />
    </div>
  );
}

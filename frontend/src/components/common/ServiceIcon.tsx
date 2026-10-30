"use client";

import { useState } from "react";
import {
  IdCard, FileBadge, Landmark, Building2, WalletCards, Smartphone,
  GraduationCap, BriefcaseBusiness, FileText, Shield, CreditCard, Zap, Globe
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
  "id-card": IdCard, "file-badge": FileBadge, landmark: Landmark,
  building: Building2, wallet: WalletCards, smartphone: Smartphone,
  graduation: GraduationCap, briefcase: BriefcaseBusiness, "file-text": FileText,
  shield: Shield, "credit-card": CreditCard, zap: Zap, globe: Globe,
};

const departmentDomains: Array<[string[], string]> = [
  [["aadhaar", "uidai", "आधार"], "uidai.gov.in"],
  [["pan", "income tax", "incometax", "आयकर", "पैन"], "incometax.gov.in"],
  [["voter", "eci", "election", "मतदाता", "निर्वाचन"], "eci.gov.in"],
  [["samagra", "समग्र"], "samagra.gov.in"],
  [["ayushman", "pmjay", "nha", "आयुष्मान", "abha"], "nha.gov.in"],
  [["pm-kisan", "pmkisan", "किसान"], "pmkisan.gov.in"],
  [["parivahan", "driving licence", "driving license", "rto", "वाहन"], "parivahan.gov.in"],
  [["passport", "mea", "पासपोर्ट"], "passportindia.gov.in"],
  [["ration", "nfsa", "राशन"], "nfsa.gov.in"],
  [["ladli behna", "लाड़ली बहना"], "cmladlibehna.mp.gov.in"],
  [["digilocker", "डिजिलॉकर", "abc id", "apaar"], "digilocker.gov.in"],
  [["umang", "उमंग"], "web.umang.gov.in"],
  [["epfo", "uan", "provident fund", "भविष्य निधि"], "epfindia.gov.in"],
  [["e-shram", "eshram", "labour", "श्रम"], "eshram.gov.in"],
  [["bhulekh", "khasra", "खसरा", "भूलेख"], "mpbhulekh.gov.in"],
  [["electricity", "bijli", "mppkvvcl", "बिजली"], "portal.mpcz.in"],
  [["lpg", "indane", "bharat gas", "hp gas"], "mylpg.in"],
  [["fastag", "नैशनल हाईवे", "toll"], "nhai.gov.in"],
  [["birth certificate", "death certificate", "crs", "जन्म", "मृत्यु"], "crsorgi.gov.in"],
  [["mpesb", "vyapam", "व्यापम"], "esb.mp.gov.in"],
  [["mppsc", "लोक सेवा आयोग"], "mppsc.mp.gov.in"],
  [["ssc"], "ssc.gov.in"],
  [["railway", "rrb", "रेलवे"], "indianrailways.gov.in"],
  [["irctc"], "irctc.co.in"],
  [["sbi", "aeps", "banking", "बैंक"], "sbi.co.in"],
  [["ibps"], "ibps.in"],
  [["gst", "जीएसटी"], "gst.gov.in"],
  [["udyam", "msme", "उद्यम"], "udyamregistration.gov.in"],
  [["fssai", "food safety", "खाद्य सुरक्षा"], "fssai.gov.in"],
  [["police", "fir", "cybercrime", "पुलिस"], "mppolice.gov.in"],
  [["court", "ecourts", "न्यायालय"], "ecourts.gov.in"],
  [["lokseva", "edistrict", "income certificate", "caste certificate", "domicile", "जाति", "आय प्रमाण", "मूल निवास"], "mpedistrict.gov.in"],
  [["scholarship", "scholarship portal", "छात्रवृत्ति"], "scholarshipportal.mp.nic.in"],
  [["employment", "rojgar", "रोजगार"], "mprojgar.gov.in"],
  [["fssai"], "fssai.gov.in"],
  [["jio"], "jio.com"],
  [["airtel"], "airtel.in"],
  [["vi ", "vodafone idea"], "myvi.in"],
  [["bsnl"], "bsnl.co.in"],
];

function resolveDepartmentDomain(slug = "", department = "", name = ""): string | null {
  const haystack = `${slug} ${department} ${name}`.toLowerCase();
  for (const [keywords, domain] of departmentDomains) {
    if (keywords.some((keyword) => haystack.includes(keyword))) return domain;
  }
  return null;
}

/**
 * Uses a department website's favicon as a recognizable site identity mark.
 * It deliberately does not draw or imitate government emblems/logos.
 * A department's actual brand asset must be supplied only from a verified,
 * authorized source.
 */
export function getOfficialLogoUrl(slug = "", department = "", name = "", explicitSrc?: string): string | null {
  if (explicitSrc && /^https:\/\//i.test(explicitSrc)) return explicitSrc;
  const domain = resolveDepartmentDomain(slug, department, name);
  return domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128` : null;
}

export default function ServiceIcon({
  type = "official", src, slug = "", department = "", name = "",
  fallback = "id-card", alt = "Department website icon", size = 48, className = ""
}: ServiceIconProps) {
  const [hasError, setHasError] = useState(false);
  const IconComponent = (fallback && iconMap[fallback as keyof typeof iconMap]) || IdCard;
  const logoUrl = getOfficialLogoUrl(slug, department, name, src);

  if (!logoUrl || hasError || (type === "icon" && !slug && !name && !src)) {
    return (
      <div className={`flex items-center justify-center shrink-0 rounded-2xl bg-saffron-50 dark:bg-saffron-950/30 text-saffron-600 ${className}`}
        style={{ width: size, height: size }}>
        <IconComponent size={Math.round(size * 0.58)} aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center shrink-0 overflow-hidden rounded-2xl ${className}`}
      style={{ width: size, height: size }}>
      <img
        src={logoUrl}
        alt={alt || name || slug || "Department website icon"}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="object-contain w-full h-full select-none pointer-events-none"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

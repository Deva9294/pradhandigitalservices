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

type DepartmentRule = { match: RegExp; domain: string };

/**
 * Verified government/service portal hosts, ordered from specific to broad.
 * These URLs are used only to show the portal's favicon as a source cue;
 * a favicon is NOT represented as an official logo or endorsement.
 * Services without a confidently identified owner use a neutral icon.
 */
const departmentRules: DepartmentRule[] = [
  { match: /pan(?!.?aadhaar)|\bpan\b|pancard|पैन/i, domain: "incometax.gov.in" },
  { match: /polling.?station|polling.?booth/i, domain: "voters.eci.gov.in" },
  { match: /mayke|sasural|family.?division|marriage.?transfer/i, domain: "samagra.gov.in" },
  { match: /fps|fair.?price.?shop|ration.?shop/i, domain: "nfsa.gov.in" },
  { match: /\bdl\b|driving.?licen[cs]e|learner.?licen[cs]e|parivahan|vehicle.?rc|vehicle.?registration|rto|conductor.?licen[cs]e|driving.?school|hypothecation|national.?permit|fitness.?certificate|puc.?status/i, domain: "parivahan.gov.in" },
  { match: /lost.?mobile|lost.?aadhaar|lost.?pan|lost.?dl|lost.?certificate|missing.?person|stolen.?vehicle|tenant.?verification|employee.?verification/i, domain: "mppolice.gov.in" },
  { match: /pcc|police.?clearance.?certificate/i, domain: "passportindia.gov.in" },
  { match: /legal.?aid|lok.?adalat/i, domain: "nalsa.gov.in" },
  { match: /obc|senior.?citizen|legal.?heir|family.?member.?certificate|certificate.?download|unmarried.?certificate|widow.?certificate|solvency|character.?certificate/i, domain: "mpedistrict.gov.in" },
  { match: /sewerage|hoarding|building.?permission|garbage.?complaint|streetlight|road.?drain|water.?tanker|funeral.?vehicle|tree.?cutting|municipal.?grievance|ambulance.?request/i, domain: "mpenagarpalika.gov.in" },
  { match: /landowner|mutation|land.?partition|land.?demarcation|revenue.?case|property.?valuation/i, domain: "mpbhulekh.gov.in" },
  { match: /procurement.?receipt|farmer.?payment|e.?uparjan/i, domain: "mpeuparjan.nic.in" },
  { match: /dairy.?subsidy|poultry|goat.?farming|fisheries|animal.?husbandry|livestock/i, domain: "mpahd.gov.in" },
  { match: /hospital.?appointment|health.?scheme|vaccination|blood.?bank|health.?complaint/i, domain: "health.mp.gov.in" },
  { match: /school.?admission|transfer.?certificate|school.?fee|student.?profile/i, domain: "educationportal.mp.gov.in" },
  { match: /revaluation|ncte|polytechnic.?admission|allotment.?letter|hostel.?application/i, domain: "dte.mponline.gov.in" },
  { match: /teacher.?recruitment|group.?[1234].?recruitment|subedar|forest.?recruitment|jail.?recruitment|health.?recruitment/i, domain: "esb.mp.gov.in" },
  { match: /police.?recruitment/i, domain: "mppolice.gov.in" },
  { match: /admit.?card|answer.?key|scorecard|cut.?off|merit.?list|document.?verification|syllabus|previous.?year.?papers|job.?notification/i, domain: "esb.mp.gov.in" },
  { match: /employment.?renewal/i, domain: "mprojgar.gov.in" },
  { match: /labour.?card|factory.?renewal|contractor.?licen[cs]e/i, domain: "labour.mp.gov.in" },
  { match: /dsc|digital.?signature/i, domain: "cca.gov.in" },
  { match: /government.?tender/i, domain: "mptenders.gov.in" },
  { match: /mp.?board|mpbse|board.?exam|marksheet|migration.?certificate/i, domain: "mpbse.nic.in" },
  { match: /aadhaar.?pan|pan.?aadhaar|pan.?linking/i, domain: "incometax.gov.in" },
  { match: /aadhaar|uidai|आधार/i, domain: "uidai.gov.in" },
  { match: /pan.?card|e.?pan|incometax|income.?tax|आयकर|पैन/i, domain: "incometax.gov.in" },
  { match: /voter|epic|election|मतदाता|निर्वाचन/i, domain: "voters.eci.gov.in" },
  { match: /samagra|समग्र/i, domain: "samagra.gov.in" },
  { match: /digilocker|डिजिलॉकर/i, domain: "digilocker.gov.in" },
  { match: /umang|उमंग/i, domain: "web.umang.gov.in" },
  { match: /apaar/i, domain: "apaar.education.gov.in" },
  { match: /abc.?id|academic.?bank.?of.?credits/i, domain: "abc.gov.in" },
  { match: /ayushman|pm.?jay|nha|आयुष्मान/i, domain: "nha.gov.in" },
  { match: /abha|health.?id|health.?record/i, domain: "abha.abdm.gov.in" },
  { match: /e.?sanjeevani/i, domain: "esanjeevani.mohfw.gov.in" },
  { match: /udid|disability.?card|दिव्यांग/i, domain: "swavlambancard.gov.in" },
  { match: /crs|birth.?certificate|death.?certificate|birth.?registration|death.?registration|जन्म|मृत्यु/i, domain: "crsorgi.gov.in" },
  { match: /income.?certificate|caste.?certificate|domicile|ews.?certificate|solvency|character.?certificate|lok.?seva|edistrict|जाति|मूल.?निवास|आय.?प्रमाण/i, domain: "mpedistrict.gov.in" },
  { match: /cm.?helpline|मुख्यमंत्री.*हेल्पलाइन/i, domain: "cmhelpline.mp.gov.in" },
  { match: /rti.?online|right.?to.?information/i, domain: "rtionline.gov.in" },
  { match: /ration|nfsa|food.?department|राशन|खाद्य/i, domain: "nfsa.gov.in" },
  { match: /lpg|indane|bharat.?gas|hp.?gas|gas.?connection/i, domain: "mylpg.in" },
  { match: /fssai|food.?safety|foscos|खाद्य.?सुरक्षा/i, domain: "foscos.fssai.gov.in" },
  { match: /driving.?licen[cs]e|learner.?licen[cs]e|parivahan|vehicle.?rc|vehicle.?registration|rto|वाहन/i, domain: "parivahan.gov.in" },
  { match: /e.?challan|traffic.?challan/i, domain: "echallan.parivahan.gov.in" },
  { match: /passport|पासपोर्ट/i, domain: "passportindia.gov.in" },
  { match: /cybercrime|cyber.?complaint/i, domain: "cybercrime.gov.in" },
  { match: /fir|police.?complaint|police.?verification|mppolice|पुलिस/i, domain: "mppolice.gov.in" },
  { match: /e.?courts|court.?case|cause.?list|court.?order|e.?filing|न्यायालय/i, domain: "ecourts.gov.in" },
  { match: /bhulekh|khasra|khatauni|b.?1|bhu.?naksha|land.?record|land.?mutation|खसरा|भूलेख/i, domain: "mpbhulekh.gov.in" },
  { match: /registry|property.?registration|stamp.?duty|igr|e.?stamp|guideline.?rate/i, domain: "mpigr.gov.in" },
  { match: /pm.?kisan|kisan.?samman/i, domain: "pmkisan.gov.in" },
  { match: /fasal.?bima|crop.?insurance|pmfby/i, domain: "pmfby.gov.in" },
  { match: /farmer.?registry|farmer.?id|agristack/i, domain: "agristack.gov.in" },
  { match: /e.?uparjan|uparjan/i, domain: "mpeuparjan.nic.in" },
  { match: /e.?mandi|mandi.?rate|mandi.?payment/i, domain: "emandirates.mp.gov.in" },
  { match: /krishi|fertilizer|seed.?subsidy|farm.?machinery|solar.?pump|horticulture|किसान|कृषि/i, domain: "mpkrishi.mp.gov.in" },
  { match: /mppsc|public.?service.?commission/i, domain: "mppsc.mp.gov.in" },
  { match: /mpesb|vyapam|patwari.?recruitment|group.?[1234].?recruitment/i, domain: "esb.mp.gov.in" },
  { match: /ssc.?recruitment|staff.?selection/i, domain: "ssc.gov.in" },
  { match: /upsc.?recruitment|union.?public.?service/i, domain: "upsc.gov.in" },
  { match: /railway.?recruitment|rrb.?recruitment/i, domain: "indianrailways.gov.in" },
  { match: /irctc|train.?ticket|tatkal|pnr.?status|ticket.?cancellation|railway/i, domain: "irctc.co.in" },
  { match: /banking.?recruitment|ibps|bank.?jobs/i, domain: "ibps.in" },
  { match: /india.?post|gds.?recruitment|post.?office/i, domain: "indiapost.gov.in" },
  { match: /army|navy|air.?force|agniveer|defence.?recruitment/i, domain: "joinindianarmy.nic.in" },
  { match: /scholarship|छात्रवृत्ति/i, domain: "scholarshipportal.mp.nic.in" },
  { match: /mp.?board|mpbse|board.?exam|marksheet|migration.?certificate/i, domain: "mpbse.nic.in" },
  { match: /e.?pravesh|college.?admission|ug.?admission|pg.?admission|counselling/i, domain: "epravesh.mponline.gov.in" },
  { match: /neet|jee.?form|cuet|nta/i, domain: "nta.ac.in" },
  { match: /employment.?exchange|job.?seeker|rojgar|रोजगार/i, domain: "mprojgar.gov.in" },
  { match: /e.?shram|eshram|श्रम/i, domain: "eshram.gov.in" },
  { match: /epfo|uan|provident.?fund|pf.?passbook|pf.?withdrawal|pf.?transfer/i, domain: "epfindia.gov.in" },
  { match: /esic/i, domain: "esic.gov.in" },
  { match: /apprenticeship/i, domain: "apprenticeshipindia.gov.in" },
  { match: /gst|जीएसटी|e.?way.?bill|e.?invoice/i, domain: "gst.gov.in" },
  { match: /udyam|msme|उद्यम/i, domain: "udyamregistration.gov.in" },
  { match: /mca.?filing|company.?registration|llp.?registration|director.?kyc/i, domain: "mca.gov.in" },
  { match: /trademark/i, domain: "ipindia.gov.in" },
  { match: /iec|import.?export/i, domain: "dgft.gov.in" },
  { match: /gem.?seller|government.?e.?marketplace/i, domain: "gem.gov.in" },
  { match: /trade.?licen[cs]e|gumasta|shop.?and.?establishment|municipal|property.?tax|water.?connection|garbage.?fee|fire.?noc|panchayat/i, domain: "mpenagarpalika.gov.in" },
  { match: /lic.?premium|lic.?policy/i, domain: "licindia.in" },
  { match: /atal.?pension|pmjjby|pmsby/i, domain: "jansuraksha.gov.in" },
  { match: /aeps|aadhaar.?enabled.?payment|upi.?complaint|upi.?setup/i, domain: "npci.org.in" },
  { match: /electricity|bijli|mppkvvcl|mpez|discom|मीटर|बिजली/i, domain: "portal.mpcz.in" },
  { match: /fastag|nhai|toll/i, domain: "nhai.gov.in" },
  { match: /jio/i, domain: "jio.com" },
  { match: /airtel/i, domain: "airtel.in" },
  { match: /vodafone|idea|\bvi\b/i, domain: "myvi.in" },
  { match: /bsnl/i, domain: "bsnl.co.in" },
  { match: /mp.?tourism/i, domain: "tourism.mp.gov.in" },
  { match: /speed.?post|courier.?tracking/i, domain: "indiapost.gov.in" },
];

function resolveDepartmentDomain(slug = "", department = "", name = ""): string | null {
  const haystack = `${slug.replace(/[-_]/g, " ")} ${department} ${name}`;
  return departmentRules.find(({ match }) => match.test(haystack))?.domain || null;
}

/**
 * Displays the favicon published by a matched department/service portal.
 * It is a portal identity cue, not a substitute for that department's
 * official logo artwork. Unknown or ambiguous services use a neutral icon.
 */
export function getOfficialLogoUrl(slug = "", department = "", name = "", explicitSrc?: string): string | null {
  if (explicitSrc && /^https:\/\//i.test(explicitSrc)) return explicitSrc;
  const domain = resolveDepartmentDomain(slug, department, name);
  return domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128` : null;
}

export default function ServiceIcon({
  type = "official", src, slug = "", department = "", name = "",
  fallback = "id-card", alt = "Department portal icon", size = 48, className = ""
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
    <div className={`relative flex items-center justify-center shrink-0 overflow-hidden rounded-2xl bg-white ${className}`}
      style={{ width: size, height: size }}>
      <img
        src={logoUrl}
        alt={alt || name || slug || "Department portal icon"}
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

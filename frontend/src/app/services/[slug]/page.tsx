import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ExternalLink, ArrowLeft, Shield, Clock, FileText, CheckCircle, 
  Phone, MessageCircle, HelpCircle, Check, AlertCircle, Building2, UploadCloud, Info
} from "lucide-react";
import { MASTER_SERVICES, ServiceCatalogueItem } from "@/data/servicesCatalogue";
import { allServices } from "@/data/services";
import { siteConfig } from "@/config/site";
import { whatsAppUrl, telSupportUrl } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const masterSlugs = MASTER_SERVICES.map((s) => ({ slug: s.slug }));
  const legacySlugs = allServices.map((s) => ({ slug: s.slug }));
  
  // Combine unique slugs
  const slugMap = new Map<string, { slug: string }>();
  [...masterSlugs, ...legacySlugs].forEach((item) => {
    slugMap.set(item.slug, item);
  });
  
  return Array.from(slugMap.values());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = MASTER_SERVICES.find((s) => s.slug === slug) || 
    allServices.find((s) => s.slug === slug);

  if (!service) return { title: "Service Not Found" };

  const title = `${service.name} (${(service as ServiceCatalogueItem).nameHi || service.name}) - Online Apply & Official Portal`;
  const desc = service.description || "Apply online with Pradhan Digital Services assistance or access direct official portal.";

  return {
    title,
    description: desc,
    openGraph: { 
      title: `${service.name} | ${siteConfig.name}`, 
      description: desc,
      images: ["/logo-full-dark.png"]
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  
  // Try finding in master catalogue first, then fallback to legacy list
  const master = MASTER_SERVICES.find((s) => s.slug === slug);
  const legacy = allServices.find((s) => s.slug === slug);

  if (!master && !legacy) notFound();

  // Normalize service data
  const service: ServiceCatalogueItem = master || {
    name: legacy!.name,
    nameHi: legacy!.nameHi || legacy!.name,
    slug: legacy!.slug,
    category: legacy!.category || "identity",
    subcategory: legacy!.categoryName || "General Services",
    description: legacy!.description,
    descriptionHi: legacy!.descriptionHi || legacy!.description,
    icon: legacy!.icon || "FileText",
    department: legacy!.officialPortal || "Government of India / State Portal",
    departmentHi: "आधिकारिक सरकारी पोर्टल",
    officialWebsiteUrl: legacy!.officialUrl || "https://mp.gov.in",
    directApplyUrl: legacy!.officialUrl || "https://mp.gov.in",
    officialHelpline: "+91 9294899787",
    officialSource: "Official State Portal",
    governmentFee: 0,
    serviceCharge: 50,
    totalFee: 50,
    price: 50,
    processingTime: "3-7 Days",
    processingTimeHi: "3-7 कार्य दिवस",
    requiredDocuments: ["Aadhaar Card", "Mobile Number", "Address Proof"],
    optionalDocuments: [],
    whoCanApply: "Eligible citizens meeting department criteria",
    whoCanApplyHi: "विभागीय नियमों अनुसार पात्र नागरिक",
    eligibility: ["Resident of India / Madhya Pradesh", "Valid identity documents"],
    eligibilityHi: ["भारत अथवा मध्य प्रदेश का निवासी", "मान्य पहचान दस्तावेज़"],
    steps: [
      "Select service and check required documents",
      "Upload documents for digital processing or assistance",
      "Verify application and receive reference tracking number",
      "Get final certificate/slip delivered digitally or via official portal"
    ],
    stepsHi: [
      "सेवा चुनें और आवश्यक दस्तावेजों की सूची देखें",
      "डिजिटल सहायता हेतु आवश्यक दस्तावेज़ अपलोड करें",
      "आवेदन विवरण सत्यापित करें और ट्रैकिंग रेफरेंस नंबर प्राप्त करें",
      "कार्य पूर्ण होने पर प्रमाण पत्र / रसीद डिजिटल रूप से प्राप्त करें"
    ],
    instructions: [
      "Ensure all uploaded documents are clearly legible.",
      "Government portal fee is deposited directly to the respective department.",
      "Pradhan Digital Services is a private assistance platform."
    ],
    instructionsHi: [
      "सभी अपलोड किए जाने वाले दस्तावेज़ साफ एवं पठनीय होने चाहिए।",
      "सरकारी शुल्क संबंधित विभाग के आधिकारिक खाते में सीधे जमा होता है।",
      "प्रधान डिजिटल सेवाएं एक निजी सुविधा एवं सहायता मंच है।"
    ],
    isPopular: legacy!.popular || false,
    tags: [legacy!.slug, "digital seva"],
    isActive: true
  };

  const related = MASTER_SERVICES
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 5);

  const govFee = service.governmentFee || 0;
  const srvFee = service.serviceCharge || 50;
  const totalAmount = govFee + srvFee;

  const prefillWaText = `Hi Pradhan Digital Services, I want to apply for *${service.name}* (${service.nameHi}). Please guide me with documents and procedure.`;

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-600 hover:text-saffron-500 transition"
          >
            <ArrowLeft className="w-4 h-4" /> 
            <span>सभी सेवाएं (All Services)</span>
          </Link>
          <span className="text-xs uppercase tracking-wider text-navy-400 font-semibold px-2.5 py-1 bg-navy-100 dark:bg-navy-800 rounded-full">
            {service.category}
          </span>
        </div>

        {/* Hero Header Card */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-navy-100 dark:border-navy-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-300 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>{service.department || "Official Portal Service"}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white tracking-tight">
                {service.name}
              </h1>
              {service.nameHi && (
                <div className="text-xl sm:text-2xl font-bold text-saffron-600 dark:text-saffron-400">
                  {service.nameHi}
                </div>
              )}
              <p className="text-navy-600 dark:text-navy-300 text-base leading-relaxed pt-1">
                {service.description}
              </p>
              {service.descriptionHi && service.descriptionHi !== service.description && (
                <p className="text-navy-500 dark:text-navy-400 text-sm leading-relaxed">
                  {service.descriptionHi}
                </p>
              )}
            </div>

            {/* Price Badge on Desktop */}
            <div className="flex lg:flex-col items-center lg:items-end justify-between p-4 bg-navy-50 dark:bg-navy-800/60 rounded-2xl border border-navy-200 dark:border-navy-700 min-w-[220px]">
              <div className="text-left lg:text-right">
                <span className="text-xs uppercase tracking-wider text-navy-500 font-medium">अनुमानित कुल शुल्क (Total)</span>
                <div className="text-3xl font-black text-navy-900 dark:text-white font-mono mt-0.5">
                  ₹{totalAmount}
                </div>
              </div>
              <div className="text-right text-xs text-navy-500 mt-2">
                <span>सरकारी शुल्क: ₹{govFee}</span>
                <span className="mx-1.5">•</span>
                <span>सेवा शुल्क: ₹{srvFee}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons Row (Mandated in Prompt Section 3 & 7) */}
          <div className="flex flex-wrap items-center gap-3 pt-6 mt-6 border-t border-navy-100 dark:border-navy-800">
            {/* Primary Apply Button */}
            <Link
              href={`/login?redirect=/services/${service.slug}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-saffron-600 hover:bg-saffron-500 text-white font-bold rounded-xl shadow-md transition text-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>मेरे लिए आवेदन करें / दस्तावेज़ अपलोड करें</span>
            </Link>

            {/* Official Website Button (Opens in secure new tab) */}
            {service.officialWebsiteUrl && (
              <a
                href={service.directApplyUrl || service.officialWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-navy-300 dark:border-navy-700 hover:border-saffron-500 text-navy-800 dark:text-white font-semibold rounded-xl hover:bg-navy-50 dark:hover:bg-navy-800 transition text-sm"
                title="Official Government Portal"
              >
                <ExternalLink className="w-4 h-4 text-saffron-600" />
                <span>Official Website खोलें</span>
              </a>
            )}

            {/* WhatsApp Button */}
            <a
              href={whatsAppUrl(prefillWaText)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-sm transition text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp करें</span>
            </a>

            {/* Call Now Button */}
            <a
              href={telSupportUrl()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 dark:hover:bg-navy-700 text-navy-900 dark:text-white font-semibold rounded-xl transition text-sm"
            >
              <Phone className="w-4 h-4 text-saffron-600" />
              <span>कॉल करें ({siteConfig.phone})</span>
            </a>
          </div>
        </div>

        {/* Main Grid: Details & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Transparent Fee & Timeline Breakdown */}
            <div className="bg-white dark:bg-navy-900 p-6 rounded-3xl shadow-sm border border-navy-100 dark:border-navy-800">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-saffron-600" />
                <span>पारदर्शी शुल्क एवं समय सीमा (Fee & Timeline Breakdown)</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-700">
                  <span className="text-xs uppercase font-medium text-navy-500">Government Fee (सरकारी शुल्क)</span>
                  <div className="text-2xl font-bold text-navy-900 dark:text-white font-mono mt-1">
                    ₹{govFee}
                  </div>
                  <p className="text-[11px] text-navy-500 mt-1">विभागीय चालान / पोर्टल शुल्क</p>
                </div>
                <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-700">
                  <span className="text-xs uppercase font-medium text-navy-500">Pradhan Service Charge (सहायता शुल्क)</span>
                  <div className="text-2xl font-bold text-saffron-600 font-mono mt-1">
                    ₹{srvFee}
                  </div>
                  <p className="text-[11px] text-navy-500 mt-1">फॉर्म भरने व दस्तावेज सहायता शुल्क</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                  <span className="text-xs uppercase font-medium text-amber-700 dark:text-amber-300">Processing Time (समय सीमा)</span>
                  <div className="text-xl font-bold text-amber-900 dark:text-amber-200 mt-1">
                    {service.processingTimeHi || service.processingTime}
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">अनुमानित कार्य दिवस</p>
                </div>
              </div>
            </div>

            {/* 2. Required Documents Checklist */}
            <div className="bg-white dark:bg-navy-900 p-6 rounded-3xl shadow-sm border border-navy-100 dark:border-navy-800">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>आवश्यक दस्तावेज़ सूची (Required Documents)</span>
              </h2>
              <p className="text-xs text-navy-500 dark:text-navy-400 mb-4">
                आवेदन करने से पहले कृपया इन दस्तावेजों की साफ फोटो या स्कैन प्रति तैयार रखें:
              </p>

              <div className="space-y-2.5">
                {service.requiredDocuments && service.requiredDocuments.length > 0 ? (
                  service.requiredDocuments.map((doc, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-800"
                    >
                      <div className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-sm font-semibold text-navy-900 dark:text-white">{doc}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400">
                        अनिवार्य (Mandatory)
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-sm text-navy-500">Aadhaar Card and Mobile Number required.</div>
                )}

                {service.optionalDocuments && service.optionalDocuments.map((doc, idx) => (
                  <div 
                    key={`opt-${idx}`}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-navy-50/60 dark:bg-navy-800/30 border border-dashed border-navy-200 dark:border-navy-700"
                  >
                    <div className="flex items-center gap-3">
                      <Info className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-sm text-navy-700 dark:text-navy-300">{doc}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium uppercase bg-navy-200 text-navy-700 dark:bg-navy-700 dark:text-navy-300">
                      ऐच्छिक (Optional)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Who Can Apply & Eligibility */}
            <div className="bg-white dark:bg-navy-900 p-6 rounded-3xl shadow-sm border border-navy-100 dark:border-navy-800">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-saffron-600" />
                <span>पात्रता मानदंड (Eligibility & Who Can Apply)</span>
              </h2>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-navy-50 dark:bg-navy-800/50">
                  <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider block mb-1">कौन आवेदन कर सकता है (Who Can Apply):</span>
                  <p className="text-sm font-medium text-navy-900 dark:text-white">
                    {service.whoCanApplyHi || service.whoCanApply}
                  </p>
                </div>

                {service.eligibility && service.eligibility.length > 0 && (
                  <ul className="space-y-2 pt-2">
                    {service.eligibility.map((el, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-navy-700 dark:text-navy-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron-500 mt-2 shrink-0" />
                        <span>{el}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* 4. Application Steps Flow */}
            <div className="bg-white dark:bg-navy-900 p-6 rounded-3xl shadow-sm border border-navy-100 dark:border-navy-800">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">
                <span>आवेदन प्रक्रिया के चरण (Step-by-Step Procedure)</span>
              </h2>
              <div className="space-y-4">
                {(service.stepsHi || service.steps || []).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-saffron-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-navy-800 dark:text-navy-200 leading-snug">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Non-Negotiable Official Disclaimer Box */}
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong className="font-bold block text-sm">महत्वपूर्ण वैधानिक सूचना (Official Disclaimer):</strong>
                <p>
                  “प्रधान डिजिटल सेवाएं एक निजी डिजिटल सहायता मंच है। सरकारी सेवाएं आधिकारिक पोर्टलों और लागू सरकारी नियमों के माध्यम से संसाधित की जाती हैं। हम कोई सरकारी विभाग नहीं हैं।”
                </p>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 pt-0.5">
                  “Pradhan Digital Services is a private digital assistance platform. Government services are processed through official portals and applicable government rules. We are not a government department.”
                </p>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            
            {/* Official Source & Verification Card */}
            <div className="bg-white dark:bg-navy-900 p-6 rounded-3xl shadow-sm border border-navy-100 dark:border-navy-800 space-y-4">
              <h3 className="font-bold text-base text-navy-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-saffron-600" />
                <span>आधिकारिक विभाग एवं पोर्टल (Official Portal)</span>
              </h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-navy-400 block mb-0.5">संबंधित विभाग:</span>
                  <span className="font-semibold text-navy-800 dark:text-navy-200">
                    {service.department || "Government of India / MP State"}
                  </span>
                </div>

                {service.officialHelpline && (
                  <div>
                    <span className="text-navy-400 block mb-0.5">आधिकारिक हेल्पलाइन:</span>
                    <span className="font-mono font-bold text-navy-900 dark:text-white">
                      {service.officialHelpline}
                    </span>
                  </div>
                )}

                {service.officialWebsiteUrl && (
                  <div>
                    <span className="text-navy-400 block mb-0.5">आधिकारिक वेब पोर्टल:</span>
                    <a
                      href={service.officialWebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-blue-600 hover:underline break-all inline-flex items-center gap-1"
                    >
                      <span>{service.officialWebsiteUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}

                <div className="pt-2 text-[11px] text-navy-500 italic">
                  * Official portal link provided for citizen assistance.
                </div>
              </div>
            </div>

            {/* Direct Help / WhatsApp Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">क्या आपको फॉर्म भरने में मदद चाहिए?</h3>
                <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                  हमारे डिजिटल सेवा सहायक से सीधे WhatsApp पर बात करें और अपने दस्तावेज़ भेजकर त्वरित आवेदन करवाएं।
                </p>
              </div>
              <a
                href={whatsAppUrl(prefillWaText)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-center rounded-xl transition text-sm shadow-sm"
              >
                WhatsApp पर संपर्क करें
              </a>
            </div>

            {/* Related Category Services */}
            {related.length > 0 && (
              <div className="bg-white dark:bg-navy-900 p-6 rounded-3xl shadow-sm border border-navy-100 dark:border-navy-800">
                <h3 className="font-bold text-base text-navy-900 dark:text-white mb-3">
                  संबंधित अन्य सेवाएं (Related Services)
                </h3>
                <div className="divide-y divide-navy-100 dark:divide-navy-800">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/services/${rel.slug}`}
                      className="py-3 flex items-center justify-between group block"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-sm font-semibold text-navy-800 dark:text-navy-200 group-hover:text-saffron-600 transition truncate">
                          {rel.name}
                        </div>
                        {rel.nameHi && (
                          <div className="text-xs text-navy-500 dark:text-navy-400 truncate">
                            {rel.nameHi}
                          </div>
                        )}
                      </div>
                      <ArrowLeft className="w-4 h-4 text-navy-400 group-hover:text-saffron-600 rotate-180 shrink-0 transition" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

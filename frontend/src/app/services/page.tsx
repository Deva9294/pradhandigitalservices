"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Search, ExternalLink, ArrowRight, Shield, Clock, 
  MessageCircle, UploadCloud, CheckCircle, Building2, FileText, Check 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MASTER_SERVICES, ServiceCatalogueItem } from "@/data/servicesCatalogue";
import { whatsAppUrl } from "@/lib/utils";

const CATEGORIES_LIST = [
  { slug: "all", name: "All Services", nameHi: "सभी सेवाएं" },
  { slug: "identity", name: "Aadhaar, PAN, Voter & Digital Docs", nameHi: "1. Aadhaar, PAN, Voter एवं डिजिटल दस्तावेज़" },
  { slug: "certificates", name: "Certificates & Public Services", nameHi: "2. प्रमाण-पत्र एवं लोक सेवा" },
  { slug: "ration-food", name: "Ration, Food & LPG Services", nameHi: "3. राशन, खाद्य एवं LPG सेवाएँ" },
  { slug: "rto-vehicle", name: "Driving Licence, RTO & Vehicle", nameHi: "4. Driving Licence, RTO एवं वाहन सेवाएँ" },
  { slug: "passport-police", name: "Passport, Police & Legal", nameHi: "5. Passport, Police एवं कानूनी सेवाएँ" },
  { slug: "municipal", name: "Municipal & Panchayat", nameHi: "6. नगर पालिका एवं पंचायत सेवाएँ" },
  { slug: "land-revenue", name: "Land & Revenue Services", nameHi: "7. भूमि एवं राजस्व सेवाएँ" },
  { slug: "agriculture", name: "Agriculture & Farmer Welfare", nameHi: "8. कृषि एवं किसान सेवाएँ" },
  { slug: "health", name: "Health & Disability Services", nameHi: "9. स्वास्थ्य एवं दिव्यांग सेवाएँ" },
  { slug: "education", name: "Education & Scholarship", nameHi: "10. शिक्षा एवं छात्रवृत्ति सेवाएँ" },
  { slug: "jobs-exams", name: "Government Jobs & Exams", nameHi: "11. सरकारी नौकरी एवं परीक्षा सेवाएँ" },
  { slug: "labour", name: "Employment & Labour Services", nameHi: "12. रोजगार एवं श्रम सेवाएँ" },
  { slug: "business", name: "Business, GST & MSME", nameHi: "13. Business, GST एवं MSME सेवाएँ" },
  { slug: "banking", name: "Banking, AEPS & Insurance", nameHi: "14. बैंकिंग, AEPS एवं बीमा सेवाएँ" },
  { slug: "utilities", name: "Recharge, Bills & Utilities", nameHi: "15. रिचार्ज, बिल एवं यूटिलिटी सेवाएँ" },
  { slug: "travel", name: "Travel, Ticket & Courier", nameHi: "16. यात्रा, टिकट एवं कूरियर सेवाएँ" },
  { slug: "tools", name: "Document & Photo Tools", nameHi: "17. Document एवं Photo Tools" },
];

function ServicesContent() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";

  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [search, setSearch] = useState(initialQuery);

  const filtered = useMemo(() => {
    let list = MASTER_SERVICES;
    if (categoryFilter && categoryFilter !== "all") {
      list = list.filter((s) => s.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.nameHi && s.nameHi.includes(q)) ||
          s.slug.toLowerCase().includes(q) ||
          (s.department && s.department.toLowerCase().includes(q)) ||
          (s.description && s.description.toLowerCase().includes(q)) ||
          (s.descriptionHi && s.descriptionHi.includes(q))
      );
    }
    return list;
  }, [categoryFilter, search]);

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title & Non-Negotiable Disclaimer */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-100 dark:bg-saffron-950/50 text-saffron-700 dark:text-saffron-400 text-xs font-bold uppercase tracking-wider">
            <span>डिजिटल सेवा केंद्र एवं आधिकारिक पोर्टल डायरेक्टरी</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white tracking-tight">
            {lang === "hi" ? "समस्त ऑनलाइन सेवाएं एवं सरकारी पोर्टल" : "All Online Services & Official Portals"}
          </h1>
          <p className="text-sm text-navy-600 dark:text-navy-300 leading-relaxed">
            {lang === "hi"
              ? "आधार, पैन, समग्र, राशन, प्रमाण पत्र, आरटीओ, कृषि, छात्रवृत्ति एवं भर्ती फॉर्म की जानकारी, सरकारी लिंक व सहायता।"
              : "Comprehensive portal directory and facilitation for Aadhaar, PAN, Samagra, Ration, Certificates, RTO, Agriculture & Jobs."}
          </p>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-200 inline-block text-left mt-2">
            <strong>वैधानिक सूचना: </strong>
            “प्रधान डिजिटल सेवाएं एक निजी डिजिटल सहायता मंच है। सरकारी सेवाएं आधिकारिक पोर्टलों और लागू सरकारी नियमों के माध्यम से संसाधित की जाती हैं। हम कोई सरकारी विभाग नहीं हैं।”
          </div>
        </div>

        {/* Search Bar - Prompt Rule: “आप कौन-सी सेवा चाहते हैं?” */}
        <div className="bg-white dark:bg-navy-900 p-4 sm:p-6 rounded-3xl shadow-sm border border-navy-100 dark:border-navy-800 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-saffron-600" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "hi" ? "आप कौन-सी सेवा चाहते हैं? (जैसे: आधार, पैन, खसरा, जाति प्रमाण पत्र, ई-उपार्जन...)" : "What service are you looking for? (e.g., Aadhaar, PAN, Khasra, Caste Cert...)"}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-navy-50/50 dark:bg-navy-800 text-navy-900 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-base"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES_LIST.map((cat) => {
              const active = categoryFilter === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setCategoryFilter(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                    active
                      ? "bg-saffron-600 text-white shadow-md shadow-saffron-600/20"
                      : "bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 hover:bg-navy-200 dark:hover:bg-navy-700"
                  }`}
                >
                  {lang === "hi" ? cat.nameHi : cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-navy-500 px-2">
          <span>कुल उपलब्ध सेवाएं: {filtered.length}</span>
          <span>आधिकारिक लिंक व शुल्क सहित</span>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => {
            const govFee = service.governmentFee || 0;
            const srvFee = service.serviceCharge || 50;
            const total = govFee + srvFee;
            const waText = `Hi Pradhan Digital Services, I want to enquire about ${service.name} (${service.nameHi}). Please help.`;

            return (
              <div 
                key={service.slug}
                className="bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col justify-between hover:shadow-xl hover:border-saffron-500/40 transition group"
              >
                <div>
                  {/* Category & Department Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-saffron-600 dark:text-saffron-400 uppercase tracking-wider">
                      {service.subcategory || service.category}
                    </span>
                    {service.isPopular && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 uppercase">
                        लोकप्रिय (Popular)
                      </span>
                    )}
                  </div>

                  {/* Service Titles */}
                  <Link href={`/services/${service.slug}`} className="block group-hover:text-saffron-600 transition">
                    <h3 className="font-bold text-lg text-navy-900 dark:text-white leading-tight">
                      {service.name}
                    </h3>
                    {service.nameHi && (
                      <div className="text-sm font-semibold text-saffron-600 dark:text-saffron-400 mt-1">
                        {service.nameHi}
                      </div>
                    )}
                  </Link>

                  {/* Description */}
                  <p className="text-xs text-navy-600 dark:text-navy-300 line-clamp-2 mt-2 leading-relaxed">
                    {lang === "hi" && service.descriptionHi ? service.descriptionHi : service.description}
                  </p>

                  {/* Department & Processing Time */}
                  <div className="mt-4 pt-3 border-t border-navy-100 dark:border-navy-800 space-y-1.5 text-xs text-navy-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-navy-400 shrink-0" />
                      <span className="truncate">{service.department || "Government Portal"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>समय: {service.processingTimeHi || service.processingTime}</span>
                    </div>
                  </div>

                  {/* Fee Badges */}
                  <div className="mt-3 flex items-center justify-between p-2.5 bg-navy-50 dark:bg-navy-800/60 rounded-xl text-xs font-mono">
                    <span className="text-navy-600 dark:text-navy-300">
                      Govt: ₹{govFee} + PDS: ₹{srvFee}
                    </span>
                    <span className="font-bold text-navy-900 dark:text-white text-sm">
                      Total: ₹{total}
                    </span>
                  </div>
                </div>

                {/* Mandated Action Buttons in Service Card (Prompt Section 3) */}
                <div className="pt-4 mt-4 border-t border-navy-100 dark:border-navy-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* 1. सेवा की जानकारी */}
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 dark:hover:bg-navy-700 text-navy-900 dark:text-white font-semibold text-xs transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-saffron-600" />
                      <span>सेवा की जानकारी</span>
                    </Link>

                    {/* 2. दस्तावेज़ अपलोड करें */}
                    <Link
                      href={`/login?redirect=/services/${service.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white font-semibold text-xs transition shadow-sm"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>आवेदन करें</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* 3. Official Website खोलें */}
                    {service.officialWebsiteUrl ? (
                      <a
                        href={service.directApplyUrl || service.officialWebsiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-navy-200 dark:border-navy-700 hover:bg-navy-50 dark:hover:bg-navy-800 text-navy-700 dark:text-navy-300 text-[11px] font-medium transition"
                        title="Official Department Website"
                      >
                        <ExternalLink className="w-3 h-3 text-blue-600" />
                        <span>Official Website</span>
                      </a>
                    ) : (
                      <div className="text-[11px] text-navy-400 py-1.5 px-2 text-center">पोर्टल लिंक उपलब्ध</div>
                    )}

                    {/* 4. WhatsApp करें */}
                    <a
                      href={whatsAppUrl(waText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium transition"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp करें</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 space-y-3">
            <p className="text-navy-500 text-base">
              {lang === "hi" ? "कोई सेवा नहीं मिली। कृपया अन्य कीवर्ड खोजें।" : "No services found. Try another search keyword or category."}
            </p>
            <button
              onClick={() => { setSearch(""); setCategoryFilter("all"); }}
              className="px-4 py-2 bg-saffron-600 text-white font-semibold rounded-xl text-xs"
            >
              रीसेट करें (Reset Filters)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center text-navy-400">Loading services catalogue...</div>}>
      <ServicesContent />
    </Suspense>
  );
}

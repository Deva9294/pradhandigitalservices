"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Sparkles, Check, ArrowRight, Smartphone, ShieldCheck, 
  DownloadCloud, Star, Zap, HelpCircle 
} from "lucide-react";
import { whatsAppUrl } from "@/lib/utils";

export default function PremiumAndAppSection() {
  const { lang } = useLanguage();

  const plans = [
    {
      id: "monthly",
      name: "Monthly Member",
      nameHi: "मासिक सदस्यता (Monthly)",
      price: "₹99",
      period: "/ month",
      periodHi: "/ माह",
      tagline: "Ideal for frequent job applicants and monthly certificate needs",
      taglineHi: "नियमित नौकरी आवेदकों एवं मासिक प्रमाण पत्र कार्यों हेतु उत्तम",
      features: [
        { en: "Zero PDS service fee on up to 3 applications each month", hi: "प्रतिमाह 3 सरकारी आवेदनों पर शून्य PDS सर्विस चार्ज" },
        { en: "1 Free laminated physical doorstep delivery per month", hi: "प्रतिमाह 1 निःशुल्क लैमिनेटेड स्पीड पोस्ट होम डिलीवरी" },
        { en: "Priority WhatsApp desk support with expert operators", hi: "प्राथमिकता व्हाट्सएप ऑपरेटर सहायता" },
        { en: "Instant SMS/WhatsApp deadline & admit card alerts", hi: "एडमिट कार्ड एवं परीक्षा अलर्ट सूचना" }
      ],
      popular: false
    },
    {
      id: "yearly",
      name: "Annual Citizen Pro",
      nameHi: "वार्षिक नागरिक प्रो (Annual Pro)",
      price: "₹499",
      period: "/ year",
      periodHi: "/ वर्ष (Save 58%)",
      tagline: "Complete 365-day digital coverage for your entire family",
      taglineHi: "संपूर्ण परिवार के डिजिटल कार्यों हेतु 365 दिन का पूर्ण कवरेज",
      features: [
        { en: "Unlimited Zero PDS service fee on all applications all year", hi: "पूरे वर्ष सभी सरकारी आवेदनों पर असीमित 0 सर्विस फीस" },
        { en: "6 Free laminated Speed Post dispatches anywhere in India", hi: "भारत में कहीं भी 6 निःशुल्क स्पीड पोस्ट दस्तावेज़ डिलीवरी" },
        { en: "Dedicated personal digital assistant operator", hi: "समर्पित डिजिटल सेवा ऑपरेटर" },
        { en: "Free MP Rojgar Panjiyan & Samagra e-KYC renewals", hi: "निःशुल्क रोजगार पंजीयन एवं समग्र ई-केवाईसी नवीनीकरण" },
        { en: "Guaranteed error-free application submission guarantee", hi: "त्रुटि-मुक्त फॉर्म सबमिशन की गारंटी" }
      ],
      popular: true
    }
  ];

  return (
    <section className="py-16 bg-[#071333] text-white border-t border-white/5 relative">
      <div className="container mx-auto px-4">
        
        {/* Section J: Premium Membership Plans */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/15 border border-saffron-500/30 text-saffron-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === "hi" ? "पारदर्शी सदस्यता योजनाएं" : "Transparent Membership Plans"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {lang === "hi" ? "प्राइम सदस्यता: बचत एवं प्राथमिकता सहायता" : "PDS Premium: Priority Assistance & Zero Service Fees"}
          </h2>
          <p className="text-saffron-200/80 text-xs md:text-sm mt-2 max-w-xl mx-auto">
            {lang === "hi"
              ? "पारदर्शी मूल्य निर्धारण। बिना किसी छिपे शुल्क के सरकारी आवेदनों पर शून्य PDS सर्विस चार्ज एवं मुफ्त होम डिलीवरी पाएं।"
              : "Clear, upfront pricing with no hidden fees. Save money on every form filing with included free doorstep dispatches."}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between space-y-6 transition-all duration-300 relative ${
                plan.popular
                  ? "bg-gradient-to-b from-[#0F2259] to-[#0A1B4D] border-saffron-500 shadow-xl shadow-saffron-500/10"
                  : "bg-[#0A1B4D]/70 border-white/10 hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-saffron-500 text-navy-950 font-extrabold text-[11px] uppercase tracking-wider shadow">
                  ★ Most Popular &amp; Best Value
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {lang === "hi" ? plan.nameHi : plan.name}
                  </h3>
                  <p className="text-xs text-saffron-200/70 mt-1">
                    {lang === "hi" ? plan.taglineHi : plan.tagline}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 py-2 border-y border-white/10">
                  <span className="text-3xl sm:text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-saffron-300 font-semibold">
                    {lang === "hi" ? plan.periodHi : plan.period}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 text-xs text-white/90">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{lang === "hi" ? feat.hi : feat.en}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/premium?plan=${plan.id}`}
                className={`w-full py-3 rounded-xl font-bold text-xs text-center transition flex items-center justify-center gap-2 ${
                  plan.popular
                    ? "bg-saffron-500 hover:bg-saffron-400 text-navy-950 shadow-lg"
                    : "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                }`}
              >
                <span>{lang === "hi" ? "यह प्लान चुनें" : "Select Plan"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Section K: Real Web App / PWA Installation (No Fake Store Badges) */}
        <div className="glass-panel max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0A1B4D]/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "आधिकारिक वेब ऐप (PWA)" : "Official Progressive Web App"}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {lang === "hi" ? "बिना ऐप स्टोर डाउनलोड के तुरंत फोन में जोड़ें" : "Add PDS to Your Home Screen Instantly"}
            </h3>
            <p className="text-xs text-saffron-200/80 leading-relaxed">
              {lang === "hi"
                ? "फोन की मेमोरी खर्च किए बिना (0 MB), सीधे Chrome या Safari ब्राउज़र से 'Add to Home Screen' करें। तेज़ लोडिंग, सीधे वैकेंसी अलर्ट एवं रसीद डाउनलोड।"
                : "No heavy app store downloads. Simply tap 'Add to Home Screen' in Chrome or Safari. 0 MB storage, instant offline load, and direct service receipts."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href={whatsAppUrl("नमस्ते, मुझे PDS वेब ऐप इनस्टॉल करने में सहायता चाहिए।")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
            >
              <Smartphone className="w-4 h-4" />
              <span>{lang === "hi" ? "PWA इनस्टॉल गाइड" : "How to Install (PWA)"}</span>
            </a>
            <Link
              href="/track-application"
              className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold text-xs transition"
            >
              {lang === "hi" ? "आवेदन ट्रैक करें" : "Track Request"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

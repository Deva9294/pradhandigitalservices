"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { DigitalServicesHeroIllustration } from "@/components/ui/VectorIllustrations";

export default function HeroSection() {
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/services?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const popularSearches = lang === "hi" 
    ? ["आधार कार्ड", "पैन कार्ड", "समग्र ई-केवाईसी", "पीएम किसान", "वैकेंसी", "आय प्रमाण पत्र"]
    : ["Aadhaar", "PAN Card", "Samagra KYC", "PM Kisan", "Jobs", "Income Certificate"];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A1B4D] via-[#0D1F57] to-[#0A1B4D] text-white pt-10 md:pt-14 pb-14 md:pb-16 border-b border-white/10">
      {/* Subtle background ambient lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text & Search Column (7 Cols on desktop) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/15 border border-saffron-500/30 text-saffron-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "विश्वसनीय निजी डिजिटल सेवा मंच" : "Trusted Digital Assistance Platform"}</span>
            </div>

            {/* Clear Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.65rem] font-extrabold text-white tracking-tight leading-tight">
              {lang === "hi" ? "अब ऑनलाइन काम, घर बैठे" : "Digital & Govt Services, From Home"}
            </h1>

            {/* Sub-headline */}
            <p className="text-sm md:text-base text-saffron-200/90 max-w-xl leading-relaxed">
              {lang === "hi"
                ? "आधार, पैन, प्रमाण पत्र, सरकारी योजनाएं, भर्ती फॉर्म एवं बिल भुगतान — साइबर कैफे जाए बिना, घर बैठे पूर्ण कराएं।"
                : "Aadhaar, PAN, certificates, government schemes, recruitment forms, and bill payments — processed safely without visiting cyber cafes."}
            </p>

            {/* Prominent Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl pt-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={lang === "hi" ? "आप कौन-सी सेवा चाहते हैं? (उदा. आधार, पैन, खसरा...)" : "What service are you looking for? (e.g. Aadhaar, PAN...)"}
                  className="w-full pl-11 pr-28 py-4 rounded-2xl bg-white text-navy-950 placeholder-navy-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-saffron-500 shadow-xl"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-navy-950 font-bold text-xs transition flex items-center gap-1 shadow"
                >
                  <span>{lang === "hi" ? "खोजें" : "Search"}</span>
                </button>
              </div>

              {/* Popular Searches */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-xs text-saffron-200/80">
                <span className="font-semibold">{lang === "hi" ? "लोकप्रिय:" : "Popular:"}</span>
                {popularSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      router.push(`/services?q=${encodeURIComponent(item)}`);
                    }}
                    className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-[11px] transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </form>

            {/* Primary Actions: "सेवा चुनें" & "अपना Status देखें" */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/services"
                className="px-6 py-3 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-navy-950 font-extrabold text-sm transition flex items-center gap-2 shadow-lg hover:shadow-saffron-500/20"
              >
                <span>{lang === "hi" ? "सेवा चुनें" : "Select Service"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/track-application"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-saffron-300" />
                <span>{lang === "hi" ? "अपना Status देखें" : "Track Status"}</span>
              </Link>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 text-xs text-white/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{lang === "hi" ? "आधिकारिक पोर्टल सत्यापन" : "Official Portal Links"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{lang === "hi" ? "सुरक्षित दस्तावेज़ हैंडलिंग" : "Secure Document Vault"}</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{lang === "hi" ? "घर बैठे स्पीड पोस्ट डिलीवरी" : "Home Speed Post Delivery"}</span>
              </div>
            </div>
          </div>

          {/* Right Vector Illustration Column (5 Cols on desktop) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative p-2 rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm">
              <DigitalServicesHeroIllustration className="w-full max-w-sm sm:max-w-md h-auto drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

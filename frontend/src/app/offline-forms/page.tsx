"use client";

import { useState } from "react";
import Link from "next/link";
import { FileDown, Search, IndianRupee, Shield, Calendar, Building2, Globe, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import BrandLogo from "@/components/ui/BrandLogo";
import { offlineForms } from "@/data/offlineForms";
import { siteConfig } from "@/config/site";
import { FormCardSkeleton } from "@/components/common/Skeleton";
import { Suspense } from "react";

export default function OfflineFormsPage() {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(offlineForms.map((f) => f.category)))];

  const filtered = offlineForms.filter((f) => {
    const matchCat = category === "All" || f.category === category;
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.nameHi.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-saffron-500/15 p-3 shadow-xl">
            <BrandLogo compact />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {lang === "hi" ? "ऑफलाइन सरकारी फॉर्म" : "Offline Government Forms"}
          </h1>
          <p className="text-saffron-200/90 text-sm">
            {lang === "hi" ? "सुरक्षित PDF डाउनलोड • सभी राज्यों के लिए" : "Secure PDF download • Available for all states"}
          </p>
        </div>

        <div className="p-4 glass-panel border border-white/10 mb-6 flex gap-3 max-w-3xl mx-auto">
          <Shield className="w-5 h-5 text-saffron-300 shrink-0 mt-0.5" />
          <p className="text-sm text-saffron-200/90">{lang === "hi" ? siteConfig.disclaimer.hi : siteConfig.disclaimer.en}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto glass-panel rounded-[32px] border border-white/10 p-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-saffron-300" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "hi" ? "फॉर्म खोजें..." : "Search forms..."}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-white/10 bg-navy-900 text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 rounded-2xl border border-white/10 bg-navy-900 text-white">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          <Suspense fallback={
            Array.from({ length: 6 }).map((_, i) => <FormCardSkeleton key={i} />)
          }>
            {filtered.map((form) => (
              <div key={form.id} className="p-5 glass-panel rounded-[28px] border border-white/10 hover:border-saffron-300 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-saffron-500/15 flex items-center justify-center shrink-0">
                      <FileDown className="w-6 h-6 text-saffron-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{lang === "hi" ? form.nameHi : form.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-saffron-200/80">{form.category}</span>
                        {form.state && <span className="text-xs text-saffron-200/60">• {form.state}</span>}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${form.price === 0 ? "bg-green-500/20 text-green-300" : "bg-saffron-500/20 text-saffron-300"}`}>
                    {form.price === 0 ? (lang === "hi" ? "मुफ्त" : "FREE") : (lang === "hi" ? `₹${form.price} शुल्क` : `₹${form.price} Fee`)}
                  </span>
                </div>
                
                <p className="text-sm text-saffron-200/80 mb-4 line-clamp-2">{lang === "hi" ? form.descriptionHi : form.description}</p>
                
                <div className="flex flex-wrap gap-3 text-xs text-saffron-200/70 mb-4">
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {form.department || (lang === "hi" ? "सरकारी विभाग" : "Government Dept")}</span>
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {form.language || (lang === "hi" ? "हिंदी/अंग्रेजी" : "Hindi/English")}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {form.updated || (lang === "hi" ? "अपडेटेड" : "Updated")}</span>
                </div>

                <div className="flex gap-2">
                  <Link 
                    href={`/offline-forms/${form.slug}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 hover:shadow-md transition text-sm"
                  >
                    <IndianRupee className="w-4 h-4" /> {form.price} — {lang === "hi" ? "डाउनलोड" : "Download"}
                  </Link>
                  {form.preview && (
                    <button className="p-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition">
                      <Eye className="w-4 h-4 text-saffron-300" />
                    </button>
                  )}
                </div>
                
                {form.price !== 0 && (
                  <p className="text-xs text-saffron-200/50 mt-3 text-center">
                    {lang === "hi" ? "* प्लेटफ़ॉर्म सेवा शुल्क" : "* Platform service fee"}
                  </p>
                )}
              </div>
            ))}
          </Suspense>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-saffron-200/60 text-lg">{lang === "hi" ? "कोई फॉर्म नहीं मिला" : "No forms found"}</p>
            <p className="text-saffron-200/40 text-sm mt-2">{lang === "hi" ? "अपने फ़िल्टर समायोजित करें" : "Adjust your filters"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

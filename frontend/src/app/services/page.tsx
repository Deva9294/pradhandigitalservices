"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { serviceCategories, allServices } from "@/data/services";
import { DISCLAIMER, DISCLAIMER_HI } from "@/lib/utils";

function ServicesContent() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";
  const query = searchParams.get("q") || "";
  const [search, setSearch] = useState(query);

  const filtered = useMemo(() => {
    let services = allServices;
    if (categoryFilter) {
      services = services.filter((s) => s.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      services = services.filter(
        (s) => s.name.toLowerCase().includes(q) || s.nameHi.includes(q) || s.slug.includes(q)
      );
    }
    return services;
  }, [categoryFilter, search]);

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {lang === "hi" ? "सभी सरकारी सेवाएं" : "All Government Services"}
          </h1>
          <p className="text-saffron-200/90 text-sm max-w-2xl mx-auto">
            {lang === "hi" ? DISCLAIMER_HI : DISCLAIMER}
          </p>
        </div>

        <div className="glass-panel rounded-[32px] border border-white/10 p-6 flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-saffron-300" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-white/10 bg-navy-900 text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/services" className={`px-3 py-2 rounded-2xl text-sm font-medium ${!categoryFilter ? "bg-saffron-500 text-white" : "bg-navy-900 text-white border border-white/10"}`}>
              All
            </Link>
            {serviceCategories.map((cat) => (
              <Link key={cat.id} href={`/services?category=${cat.slug}`}
                className={`px-3 py-2 rounded-2xl text-sm font-medium ${categoryFilter === cat.slug ? "bg-saffron-500 text-white" : "bg-navy-900 text-white border border-white/10 hover:border-saffron-400"}`}>
                {lang === "hi" ? cat.nameHi : cat.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`}
              className="p-6 glass-panel rounded-[28px] border border-white/10 hover:border-saffron-400 hover:shadow-2xl transition group">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-saffron-400 font-medium">{lang === "hi" ? service.categoryNameHi : service.categoryName}</span>
                  <h3 className="font-bold text-white mt-1 group-hover:text-saffron-300 transition">
                    {lang === "hi" ? service.nameHi : service.name}
                  </h3>
                  <p className="text-sm text-saffron-200/80 mt-1">{lang === "hi" ? service.descriptionHi : service.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-saffron-300 group-hover:text-saffron-500 shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-saffron-200/80 py-12">{t.common.noResults}</p>
        )}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center">Loading...</div>}>
      <ServicesContent />
    </Suspense>
  );
}

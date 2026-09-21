"use client";

import { useState, Suspense } from "react";
import { Calendar, Clock, ArrowRight, Search, TrendingUp, ExternalLink, Newspaper } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { NewsCardSkeleton } from "@/components/common/Skeleton";

const newsItems = [
  {
    id: 1,
    title: "Aadhaar Card Update: New Rules for 2026",
    titleHi: "आधार कार्ड अपडेट: 2026 के लिए नए नियम",
    category: "Government",
    date: "2026-07-20",
    excerpt: "UIDAI has announced new rules for Aadhaar card updates. Learn about the changes and how they affect you.",
    excerptHi: "UIDAI ने आधार कार्ड अपडेट के लिए नए नियमों की घोषणा की है। बदलावों और उनके प्रभाव के बारे में जानें।",
    source: "UIDAI Official",
    sourceUrl: "https://uidai.gov.in",
    featured: true,
  },
  {
    id: 2,
    title: "PAN Card Application Made Easier",
    titleHi: "PAN कार्ड आवेदन अब आसान",
    category: "Financial",
    date: "2026-07-18",
    excerpt: "New online process makes PAN card application faster and more convenient for all citizens.",
    excerptHi: "नई ऑनलाइन प्रक्रिया सभी नागरिकों के लिए PAN कार्ड आवेदन को तेज और अधिक सुविधाजनक बनाती है।",
    source: "Income Tax Department",
    sourceUrl: "https://incometax.gov.in",
    featured: false,
  },
  {
    id: 3,
    title: "Government Job Vacancies: 50,000+ Posts",
    titleHi: "सरकारी नौकरी भर्तियां: 50,000+ पद",
    category: "Employment",
    date: "2026-07-15",
    excerpt: "Multiple government departments have announced massive recruitment drives across India.",
    excerptHi: "भारत भर में कई सरकारी विभागों ने विशाल भर्ती अभियानों की घोषणा की है।",
    source: "Employment News",
    sourceUrl: "https://employmentnews.gov.in",
    featured: true,
  },
  {
    id: 4,
    title: "Digital India: New Services Launched",
    titleHi: "डिजिटल इंडिया: नई सेवाएं शुरू",
    category: "Technology",
    date: "2026-07-12",
    excerpt: "Government launches new digital services to make citizen services more accessible.",
    excerptHi: "सरकार ने नागरिक सेवाओं को अधिक सुलभ बनाने के लिए नई डिजिटल सेवाएं शुरू की हैं।",
    source: "Digital India",
    sourceUrl: "https://digitalindia.gov.in",
    featured: false,
  },
  {
    id: 5,
    title: "Passport Services: Online Appointment Update",
    titleHi: "पासपोर्ट सेवाएं: ऑनलाइन अपॉइंटमेंट अपडेट",
    category: "Government",
    date: "2026-07-10",
    excerpt: "New appointment booking system for passport services reduces waiting time significantly.",
    excerptHi: "पासपोर्ट सेवाओं के लिए नई अपॉइंटमेंट बुकिंग प्रणाली प्रतीक्षा समय को काफी कम करती है।",
    source: "Passport Seva",
    sourceUrl: "https://passportindia.gov.in",
    featured: false,
  },
  {
    id: 6,
    title: "GST Registration: Simplified Process",
    titleHi: "GST पंजीकरण: सरल प्रक्रिया",
    category: "Financial",
    date: "2026-07-08",
    excerpt: "GST registration process has been simplified for small businesses and startups.",
    excerptHi: "छोटे व्यवसायों और स्टार्टअप के लिए GST पंजीकरण प्रक्रिया को सरल बनाया गया है।",
    source: "GST Portal",
    sourceUrl: "https://gst.gov.in",
    featured: false,
  },
];

export default function NewsPage() {
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Government", "Financial", "Employment", "Technology"];

  const filtered = newsItems.filter((item) => {
    const matchCat = category === "All" || item.category === category;
    const matchSearch = !search || 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.titleHi.includes(search);
    return matchCat && matchSearch;
  });

  const featured = newsItems.filter((item) => item.featured);
  const regular = filtered.filter((item) => !item.featured);

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-saffron-500/15 mb-4">
            <Newspaper className="w-8 h-8 text-saffron-600" />
          </div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
            {lang === "hi" ? "ताज़ा समाचार" : "Latest News"}
          </h1>
          <p className="text-navy-600 dark:text-navy-400">
            {lang === "hi" ? "सरकारी सेवाओं और अपडेट के बारे में जानें" : "Stay updated on government services and news"}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "hi" ? "समाचार खोजें..." : "Search news..."}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Featured News */}
        {(category === "All" || !search) && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-saffron-600" />
              <h2 className="text-xl font-bold text-navy-900 dark:text-white">
                {lang === "hi" ? "विशेष समाचार" : "Featured News"}
              </h2>
            </div>
            <Suspense fallback={<NewsCardSkeleton />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featured.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-navy-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition group border border-navy-100 dark:border-navy-700"
                  >
                    <div className="h-48 bg-gradient-to-br from-saffron-100 to-saffron-200 dark:from-saffron-900/20 dark:to-saffron-800/20 flex items-center justify-center">
                      <Newspaper className="w-16 h-16 text-saffron-600 dark:text-saffron-400" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="px-3 py-1 bg-saffron-100 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-400 text-xs font-medium rounded-full">
                          {item.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-navy-500">
                          <Calendar className="w-3 h-3" /> {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2 group-hover:text-saffron-600 transition">
                        {lang === "hi" ? item.titleHi : item.title}
                      </h3>
                      <p className="text-sm text-navy-600 dark:text-navy-400 mb-4">
                        {lang === "hi" ? item.excerptHi : item.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <a 
                          href={item.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-navy-500 hover:text-saffron-600 transition"
                        >
                          <ExternalLink className="w-3 h-3" /> {item.source}
                        </a>
                        <button className="flex items-center gap-2 text-saffron-600 hover:text-saffron-700 text-sm font-medium">
                          {lang === "hi" ? "और पढ़ें" : "Read More"} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Suspense>
          </div>
        )}

        {/* Regular News */}
        <div>
          <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-6">
            {lang === "hi" ? "सभी समाचार" : "All News"}
          </h2>
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)}
            </div>
          }>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-navy-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group border border-navy-100 dark:border-navy-700"
              >
                <div className="h-40 bg-gradient-to-br from-navy-100 to-navy-200 dark:from-navy-800 dark:to-navy-900 flex items-center justify-center">
                  <Newspaper className="w-12 h-12 text-navy-400 dark:text-navy-600" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="px-2 py-0.5 bg-navy-100 dark:bg-navy-900 text-navy-700 dark:text-navy-400 text-xs font-medium rounded-full">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-navy-500">
                      <Clock className="w-3 h-3" /> {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy-900 dark:text-white mb-2 group-hover:text-saffron-600 transition line-clamp-2">
                    {lang === "hi" ? item.titleHi : item.title}
                  </h3>
                  <p className="text-sm text-navy-600 dark:text-navy-400 line-clamp-2 mb-3">
                    {lang === "hi" ? item.excerptHi : item.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <a 
                      href={item.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-navy-500 hover:text-saffron-600 transition"
                    >
                      <ExternalLink className="w-3 h-3" /> {item.source}
                    </a>
                    <button className="text-saffron-600 hover:text-saffron-700 text-sm font-medium">
                      {lang === "hi" ? "और पढ़ें" : "Read More"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Suspense>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 mx-auto mb-4 text-navy-300" />
            <p className="text-navy-500 text-lg">{lang === "hi" ? "कोई समाचार नहीं मिला" : "No news found"}</p>
            <p className="text-navy-400 text-sm mt-2">{lang === "hi" ? "अपने फ़िल्टर समायोजित करें" : "Adjust your filters"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const news = [
  { id: 1, title: "SSC CGL 2026 Notification Released", titleHi: "SSC CGL 2026 अधिसूचना जारी", date: "2026-07-15", category: "Jobs" },
  { id: 2, title: "PM Kisan 18th Installment Update", titleHi: "PM किसान 18वीं किस्त अपडेट", date: "2026-07-10", category: "Schemes" },
  { id: 3, title: "New Aadhaar Update Process 2026", titleHi: "नई आधार अपडेट प्रक्रिया 2026", date: "2026-07-05", category: "Identity" },
];

export default function NewsSection() {
  const { lang, t } = useLanguage();

  return (
    <section className="py-16 bg-white dark:bg-navy-950">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white">{t.sections.latestNews}</h2>
          <Link href="/news" className="text-saffron-600 text-sm font-medium flex items-center gap-1 hover:underline">
            {t.common.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`}
              className="group p-6 glass-panel rounded-[28px] border border-white/10 hover:border-saffron-300 hover:shadow-2xl transition">
              <div className="flex items-center gap-2 mb-3">
                <Newspaper className="w-4 h-4 text-saffron-500" />
                <span className="text-xs text-saffron-600 font-medium">{item.category}</span>
                <span className="text-xs text-navy-400 ml-auto">{item.date}</span>
              </div>
              <h3 className="font-bold text-navy-900 dark:text-white group-hover:text-saffron-600 transition">
                {lang === "hi" ? item.titleHi : item.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

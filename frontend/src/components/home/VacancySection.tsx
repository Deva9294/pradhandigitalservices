"use client";

import Link from "next/link";
import { Calendar, MapPin, GraduationCap, ExternalLink, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { sampleVacancies } from "@/data/vacancies";

export default function VacancySection() {
  const { lang, t } = useLanguage();

  return (
    <section className="py-16 bg-white dark:bg-navy-950">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white">
            {t.sections.vacancyUpdates}
          </h2>
          <Link href="/vacancies" className="text-saffron-600 text-sm font-medium hover:underline">
            {t.common.viewAll} →
          </Link>
        </div>
        <div className="grid gap-4">
          {sampleVacancies.slice(0, 4).map((v) => (
            <div key={v.id} className="p-5 glass-panel rounded-[28px] hover:border-saffron-300 transition border border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-saffron-100 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-300 text-xs font-medium rounded-full">
                      {v.category}
                    </span>
                    <span className="text-xs text-navy-500">{v.totalPosts} posts</span>
                  </div>
                  <h3 className="font-bold text-navy-900 dark:text-white">{lang === "hi" ? v.titleHi : v.title}</h3>
                  <p className="text-sm text-navy-600 dark:text-navy-400">{v.organization}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-navy-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {v.state}</span>
                    <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {v.qualification}</span>
                    <span className="flex items-center gap-1 text-red-500"><Calendar className="w-3 h-3" /> Last: {v.lastDate}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {v.notificationPdf && (
                    <a href={v.notificationPdf} className="px-3 py-2 border border-navy-200 dark:border-navy-600 rounded-lg text-xs flex items-center gap-1 hover:bg-navy-50 dark:hover:bg-navy-700">
                      <FileText className="w-3 h-3" /> PDF
                    </a>
                  )}
                  <a href={v.applyLink} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 bg-saffron-600 text-white text-sm font-medium rounded-lg flex items-center gap-1 hover:bg-saffron-500 transition">
                    {t.common.applyNow} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

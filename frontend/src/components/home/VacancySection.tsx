"use client";

import Link from "next/link";
import { Calendar, MapPin, GraduationCap, ExternalLink, FileText, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { sampleVacancies } from "@/data/vacancies";

export default function VacancySection() {
  const { lang, t } = useLanguage();

  return (
    <section className="py-16 bg-navy-950 text-white border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              {lang === "hi" ? "सत्यापित सरकारी नौकरियां" : "Verified Recruitment Alerts"}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              {lang === "hi" ? "नवीनतम वैकेंसी अपडेट" : "Latest Vacancy Updates"}
            </h2>
          </div>
          <Link 
            href="/vacancy-update" 
            className="inline-flex items-center gap-1.5 text-saffron-400 text-sm font-bold hover:text-saffron-300 transition"
          >
            <span>{lang === "hi" ? "सभी भर्तियां देखें" : "View All Vacancies"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleVacancies.slice(0, 6).map((v) => {
            const slugOrId = v.slug || v.id;
            return (
              <div 
                key={v.id || v.slug} 
                className="p-5 glass-panel rounded-2xl hover:border-saffron-400/50 transition border border-white/10 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-blue-500/15 text-blue-300 font-semibold text-[11px] rounded-full border border-blue-500/20">
                      {v.recruitingAuthority || v.organization}
                    </span>
                    <span className="text-[11px] text-saffron-300 font-medium">
                      {v.totalPosts.toLocaleString()} {lang === "hi" ? "पद" : "posts"}
                    </span>
                  </div>

                  <Link href={`/vacancy-update/${slugOrId}`} className="block group">
                    <h3 className="font-bold text-white text-base group-hover:text-saffron-400 transition-colors line-clamp-1">
                      {lang === "hi" && v.titleHi ? v.titleHi : v.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-saffron-200/70 truncate">{v.department}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-saffron-200/80 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-saffron-400" /> 
                      {v.locationScope === "MP" ? "Madhya Pradesh" : "All India"}
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-saffron-400" /> 
                      <span className="truncate max-w-[140px]">{v.qualification}</span>
                    </span>
                    <span className="flex items-center gap-1 text-amber-300 font-semibold">
                      <Calendar className="w-3.5 h-3.5" /> 
                      Last: {v.lastDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <Link
                    href={`/vacancy-update/${slugOrId}`}
                    className="flex-1 px-3 py-2 bg-saffron-600 hover:bg-saffron-500 text-white text-xs font-bold rounded-xl text-center transition flex items-center justify-center gap-1 shadow"
                  >
                    <span>{lang === "hi" ? "पूर्ण विवरण" : "Details"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {(v.applyUrl || v.applyLink) && (
                    <a
                      href={v.applyUrl || v.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-navy-900 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition"
                    >
                      <span>Official</span>
                      <ExternalLink className="w-3 h-3 text-saffron-300" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

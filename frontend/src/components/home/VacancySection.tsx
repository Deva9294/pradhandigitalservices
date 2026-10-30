"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, GraduationCap, ExternalLink, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { vacancyApi } from "@/lib/api";
import type { Vacancy } from "@/data/vacancies";

export default function VacancySection() {
  const { lang } = useLanguage();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadLatest = async () => {
      try {
        const response = await vacancyApi.getAll({ tab: "active", page: 1, limit: 6 });
        if (!active) return;
        const records = Array.isArray(response.data?.vacancies) ? response.data.vacancies : [];
        const sorted = records
          .filter((v: any) => v?.slug && (v?.title || v?.titleHi))
          .sort((a: any, b: any) =>
            new Date(b.publishedAt || b.createdAt || 0).getTime() -
            new Date(a.publishedAt || a.createdAt || 0).getTime()
          );
        setVacancies(sorted);
      } catch {
        if (active) setVacancies([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadLatest();
    const refresh = window.setInterval(loadLatest, 5 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(refresh);
    };
  }, []);

  return (
    <section className="py-16 bg-navy-950 text-white border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              {lang === "hi" ? "नवीनतम भर्ती अपडेट" : "Latest Recruitment Alerts"}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              {lang === "hi" ? "नवीनतम वैकेंसी अपडेट" : "Latest Vacancy Updates"}
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              {lang === "hi" ? "वैकेंसी डेटाबेस से अपडेट — हर 5 मिनट में रिफ्रेश" : "Live from vacancy database — refreshes every 5 minutes"}
            </p>
          </div>
          <Link href="/vacancy-update" className="inline-flex items-center gap-1.5 text-saffron-400 text-sm font-bold hover:text-saffron-300 transition">
            <span>{lang === "hi" ? "सभी भर्तियां देखें" : "View All Vacancies"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((item) => <div key={item} className="h-44 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />)}
          </div>
        ) : vacancies.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.map((v) => {
              const slug = v.slug;
              const title = lang === "hi" && v.titleHi ? v.titleHi : v.title;
              return (
                <article key={String((v as any)._id || v.id || slug)} className="p-5 glass-panel rounded-2xl hover:border-saffron-400/50 transition border border-white/10 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-blue-500/15 text-blue-300 font-semibold text-[11px] rounded-full border border-blue-500/20">
                        {v.recruitingAuthority || v.organization || v.department}
                      </span>
                      <span className="text-[11px] text-saffron-300 font-medium">
                        {(Number(v.totalPosts) || 0).toLocaleString()} {lang === "hi" ? "पद" : "posts"}
                      </span>
                    </div>
                    <Link href={`/vacancy-update/${slug}`} className="block group">
                      <h3 className="font-bold text-white text-base group-hover:text-saffron-400 transition-colors line-clamp-2">{title}</h3>
                    </Link>
                    <p className="text-xs text-saffron-200/70 truncate">{v.department}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-saffron-200/80 pt-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-saffron-400" />{v.locationScope === "MP" ? "Madhya Pradesh" : v.locationScope || "All India"}</span>
                      <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-saffron-400" /><span className="truncate max-w-[160px]">{v.qualification || "See notification"}</span></span>
                      {v.lastDate && <span className="flex items-center gap-1 text-amber-300 font-semibold"><Calendar className="w-3.5 h-3.5" />{lang === "hi" ? "अंतिम तिथि:" : "Last date:"} {new Date(v.lastDate).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN")}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <Link href={`/vacancy-update/${slug}`} className="flex-1 px-3 py-2 bg-saffron-600 hover:bg-saffron-500 text-white text-xs font-bold rounded-xl text-center transition flex items-center justify-center gap-1 shadow">
                      {lang === "hi" ? "पूर्ण विवरण" : "Details"} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {(v.applyUrl || v.applyLink) && <a href={v.applyUrl || v.applyLink} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-navy-900 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition">Official <ExternalLink className="w-3 h-3 text-saffron-300" /></a>}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <RefreshCw className="w-8 h-8 mx-auto mb-3 text-saffron-400" />
            <p className="font-semibold">{lang === "hi" ? "अभी कोई सक्रिय वैकेंसी उपलब्ध नहीं है" : "No active vacancies available right now"}</p>
            <p className="text-sm text-slate-400 mt-1">{lang === "hi" ? "नई भर्ती जुड़ते ही यह सेक्शन अपने आप अपडेट होगा।" : "This section will update when new vacancies are added."}</p>
            <Link href="/vacancy-update" className="inline-flex mt-4 text-saffron-400 font-semibold text-sm">{lang === "hi" ? "वैकेंसी पेज देखें" : "Open vacancy page"} <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </div>
        )}
      </div>
    </section>
  );
}

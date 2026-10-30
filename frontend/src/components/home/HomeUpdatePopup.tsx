"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, X, ArrowRight, BriefcaseBusiness, Layers3, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { vacancyApi, default as api } from "@/lib/api";

type UpdateVacancy = { _id?: string; id?: string; slug: string; title: string; titleHi?: string; recruitingAuthority?: string; totalPosts?: number };
type ServiceCategory = { _id?: string; slug: string; name: string; nameHi?: string; description?: string };

export default function HomeUpdatePopup() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [vacancies, setVacancies] = useState<UpdateVacancy[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  useEffect(() => {
    try {
      if (window.localStorage.getItem("pds-home-updates-seen-v1")) return;
      window.localStorage.setItem("pds-home-updates-seen-v1", "1");
      setVisible(true);
    } catch {
      setVisible(false);
    }

    let active = true;
    Promise.all([
      vacancyApi.getAll({ tab: "active", page: 1, limit: 4 }),
      api.get("/services/categories"),
    ]).then(([vacancyResponse, categoryResponse]) => {
      if (!active) return;
      const vacancyItems = Array.isArray(vacancyResponse.data?.vacancies) ? vacancyResponse.data.vacancies : [];
      const categoryItems = Array.isArray(categoryResponse.data?.categories) ? categoryResponse.data.categories : [];
      setVacancies(vacancyItems.filter((v: any) => v?.slug).slice(0, 4));
      setCategories(categoryItems.slice(0, 6));
    }).catch(() => {
      // The welcome popup remains useful with the portal links if an API is temporarily unavailable.
    });

    return () => { active = false; };
  }, []);

  if (!visible) return null;
  const close = () => setVisible(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-5" role="dialog" aria-modal="true" aria-labelledby="pds-welcome-title">
      <section className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl border border-white/15 bg-white text-slate-900 shadow-2xl dark:bg-navy-950 dark:text-white">
        <button type="button" onClick={close} aria-label={lang === "hi" ? "बंद करें" : "Close"} className="absolute right-3 top-3 z-10 rounded-full bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
          <X className="h-5 w-5" />
        </button>
        <div className="bg-gradient-to-r from-[#0A1B4D] to-[#173B80] px-6 py-6 pr-14 text-white">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold"><Sparkles className="h-4 w-4 text-orange-300" /> {lang === "hi" ? "आपके लिए नया अपडेट" : "What's new"}</div>
          <h2 id="pds-welcome-title" className="text-2xl font-extrabold">{lang === "hi" ? "Pradhan Digital Services में आपका स्वागत है" : "Welcome to Pradhan Digital Services"}</h2>
          <p className="mt-2 text-sm text-blue-100">{lang === "hi" ? "नवीनतम भर्ती और उपलब्ध डिजिटल सेवाएं एक ही जगह।" : "Latest recruitment alerts and digital services in one place."}</p>
        </div>
        <div className="grid gap-5 p-5 sm:p-6">
          <div>
            <div className="mb-3 flex items-center gap-2"><BriefcaseBusiness className="h-5 w-5 text-orange-500" /><h3 className="font-bold">{lang === "hi" ? "नवीनतम वैकेंसी" : "Latest Vacancies"}</h3></div>
            {vacancies.length ? <ul className="space-y-2">{vacancies.map((v) => <li key={String(v._id || v.id || v.slug)}><Link onClick={close} href={`/vacancy-update/${v.slug}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-sm hover:border-orange-400 dark:border-white/10 dark:hover:border-orange-400"><span className="min-w-0"><span className="block truncate font-semibold">{lang === "hi" && v.titleHi ? v.titleHi : v.title}</span><span className="text-xs text-slate-500 dark:text-slate-400">{v.recruitingAuthority || "Recruitment"} · {(Number(v.totalPosts) || 0).toLocaleString()} {lang === "hi" ? "पद" : "posts"}</span></span><ArrowRight className="h-4 w-4 shrink-0 text-orange-500" /></Link></li>)}</ul> : <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">{lang === "hi" ? "नई वैकेंसी जुड़ते ही यहां दिखाई देगी।" : "New vacancies will appear here when published."}</p>}
            <Link onClick={close} href="/vacancy-update" className="mt-2 inline-flex items-center text-sm font-semibold text-orange-600 dark:text-orange-400">{lang === "hi" ? "सभी वैकेंसी देखें" : "View all vacancies"} <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2"><Layers3 className="h-5 w-5 text-orange-500" /><h3 className="font-bold">{lang === "hi" ? "पोर्टल पर उपलब्ध सेवाएं" : "Services available on the portal"}</h3></div>
            {categories.length ? <div className="flex flex-wrap gap-2">{categories.map((c) => <Link onClick={close} key={String(c._id || c.slug)} href="/services" className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium hover:border-orange-400 dark:border-white/10">{lang === "hi" && c.nameHi ? c.nameHi : c.name}</Link>)}</div> : <p className="text-sm text-slate-500 dark:text-slate-400">{lang === "hi" ? "सरकारी एवं डिजिटल सेवाओं की सूची देखने के लिए सेवाएं खोलें।" : "Explore government and digital services in the services catalogue."}</p>}
            <Link onClick={close} href="/services" className="mt-3 inline-flex items-center text-sm font-semibold text-orange-600 dark:text-orange-400">{lang === "hi" ? "सभी सेवाएं देखें" : "Explore all services"} <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 dark:border-white/10">
          <span className="text-xs text-slate-500 dark:text-slate-400">{lang === "hi" ? "यह संदेश पहली विज़िट पर एक बार दिखेगा।" : "Shown once on your first visit to this browser."}</span>
          <button type="button" onClick={close} className="rounded-xl bg-[#FF7A00] px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600">{lang === "hi" ? "समझ गया" : "Got it"}</button>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { Search, MapPin, GraduationCap, Calendar, ExternalLink, Filter, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { sampleVacancies, indianStates, qualifications } from "@/data/vacancies";
import { VacancyCardSkeleton } from "@/components/common/Skeleton";

const departments = ["All Departments", "SSC", "UPSC", "Railways", "Banking", "Defence", "Teaching", "Police", "State Govt", "Central Govt"];
const categories = ["All Types", "Government", "Private"];

export default function VacanciesPage() {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [state, setState] = useState("All India");
  const [qualification, setQualification] = useState("All");
  const [department, setDepartment] = useState("All Departments");
  const [category, setCategory] = useState("All Types");

  const filtered = useMemo(() => {
    return sampleVacancies.filter((v) => {
      const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.organization.toLowerCase().includes(search.toLowerCase());
      const matchState = state === "All India" || v.state === state || v.state === "All India";
      const matchQual = qualification === "All" || v.qualification === qualification;
      const matchDept = department === "All Departments" || v.department === department;
      const matchCat = category === "All Types" || v.type === category.toLowerCase();
      return matchSearch && matchState && matchQual && matchDept && matchCat;
    });
  }, [search, state, qualification, department, category]);

  const getStatusBadge = (lastDate: string) => {
    const today = new Date();
    const last = new Date(lastDate);
    const daysLeft = Math.ceil((last.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { text: "CLOSED", color: "bg-red-500/20 text-red-300" };
    if (daysLeft <= 7) return { text: "ENDING SOON", color: "bg-amber-500/20 text-amber-300" };
    if (daysLeft <= 30) return { text: "CLOSING SOON", color: "bg-orange-500/20 text-orange-300" };
    return { text: "NEW", color: "bg-green-500/20 text-green-300" };
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {lang === "hi" ? "सरकारी नौकरी भर्तियां" : "Government Job Vacancies"}
          </h1>
          <p className="text-saffron-200/90 text-sm">{lang === "hi" ? "रोज़ाना अपडेट • खोजें • आवेदन करें" : "Daily updates • Search • Apply"}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 p-6 glass-panel rounded-[32px] border border-white/10">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-300" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={lang === "hi" ? "नौकरी खोजें..." : "Search jobs..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-white/10 bg-navy-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500" />
          </div>
          <select value={state} onChange={(e) => setState(e.target.value)}
            className="px-3 py-2.5 rounded-2xl border border-white/10 bg-navy-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500">
            {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={qualification} onChange={(e) => setQualification(e.target.value)}
            className="px-3 py-2.5 rounded-2xl border border-white/10 bg-navy-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500">
            {qualifications.map((q) => <option key={q} value={q}>{q}</option>)}
          </select>
          <select value={department} onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-2.5 rounded-2xl border border-white/10 bg-navy-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500">
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-saffron-200/80">
            <Filter className="w-4 h-4 text-saffron-300" /> {filtered.length} {lang === "hi" ? "भर्तियां मिलीं" : "vacancies found"}
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-white/10 bg-navy-900 text-white text-xs focus:outline-none focus:ring-2 focus:ring-saffron-500">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-4">
          <Suspense fallback={<VacancyCardSkeleton />}>
            {filtered.map((v) => {
              const status = getStatusBadge(v.lastDate);
              return (
                <div key={v.id} className="p-5 glass-panel rounded-[28px] border border-white/10 hover:border-saffron-400 transition">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}>{status.text}</span>
                        <span className="px-2 py-0.5 bg-saffron-100/15 text-saffron-200 text-xs font-medium rounded-full">{v.category}</span>
                        <span className="text-xs text-saffron-200/80">{v.totalPosts} posts</span>
                      </div>
                      <h2 className="text-lg font-bold text-white">{lang === "hi" ? v.titleHi : v.title}</h2>
                      <div className="flex items-center gap-2 text-sm text-saffron-200/80 mb-2">
                        <Building2 className="w-4 h-4" /> {v.organization}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-saffron-200/80">
                        <span className="flex items-center gap-1 text-saffron-200/80"><MapPin className="w-3 h-3" /> {v.state}</span>
                        <span className="flex items-center gap-1 text-saffron-200/80"><GraduationCap className="w-3 h-3" /> {v.qualification}</span>
                        <span className="flex items-center gap-1 text-saffron-300 font-medium"><Calendar className="w-3 h-3" /> {lang === "hi" ? "अंतिम तिथि:" : "Last Date:"} {v.lastDate}</span>
                      </div>
                    </div>
                    <a href={v.applyLink} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 px-5 py-2.5 bg-saffron-600 text-white text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-saffron-500 transition">
                      {t.common.applyNow} <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </Suspense>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-saffron-200/60 text-lg">{lang === "hi" ? "कोई भर्ती नहीं मिली" : "No vacancies found"}</p>
            <p className="text-saffron-200/40 text-sm mt-2">{lang === "hi" ? "अपने फ़िल्टर समायोजित करें" : "Adjust your filters"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

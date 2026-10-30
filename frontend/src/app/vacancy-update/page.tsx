"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { 
  Search, MapPin, GraduationCap, Calendar, ExternalLink, Filter, 
  Building2, Users, Clock, AlertTriangle, ShieldCheck, CheckCircle2, 
  FileText, ArrowRight, Phone, MessageSquare, RefreshCw, Award, 
  DownloadCloud, HelpCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { indianStates, qualifications, recruitmentAuthorities, Vacancy } from "@/data/vacancies";
import { vacancyApi } from "@/lib/api";
import { whatsAppUrl, telSupportUrl } from "@/lib/utils";

type TabType = 
  | 'active' 
  | 'closing_soon' 
  | 'upcoming' 
  | 'admit_cards' 
  | 'results' 
  | 'answer_keys' 
  | 'exam_notices' 
  | 'offline_forms' 
  | 'archive';

interface TabItem {
  id: TabType;
  labelEn: string;
  labelHi: string;
  badge?: number;
}

export default function VacancyUpdatePage() {
  const { lang } = useLanguage();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState<"all" | "MP" | "All India">("all");
  const [authority, setAuthority] = useState("All Authorities");
  const [qualification, setQualification] = useState("All");
  const [mode, setMode] = useState<"all" | "online" | "offline">("all");
  const [feeExemptOnly, setFeeExemptOnly] = useState(false);
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({});
  const [syncing, setSyncing] = useState(false);

  const handleLiveSync = async () => {
    try {
      setSyncing(true);
      await vacancyApi.sync();
      const res = await vacancyApi.getAll({ tab: activeTab });
      if (res.data?.success && Array.isArray(res.data.vacancies)) {
        setVacancies(res.data.vacancies);
      }
      const countsRes = await vacancyApi.getSummaryCounts();
      if (countsRes.data?.success && countsRes.data.counts) {
        setTabCounts(countsRes.data.counts);
      }
    } catch {
      // ignore
    } finally {
      setSyncing(false);
    }
  };

  // Fetch real data from backend API with fallback
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        // Load tab counts
        try {
          const countsRes = await vacancyApi.getSummaryCounts();
          if (countsRes.data?.success && isMounted) {
            setTabCounts(countsRes.data.counts || {});
          }
        } catch {
          // ignore counts error
        }

        // Load vacancies for current tab
        const res = await vacancyApi.getAll({
          tab: activeTab,
          scope: scope === "all" ? "" : scope,
          authority: authority === "All Authorities" ? "" : authority,
          qualification: qualification === "All" ? "" : qualification,
          mode: mode === "all" ? "" : mode,
          feeExempt: feeExemptOnly ? "true" : "",
          search: search.trim()
        });

        if (res.data?.success && Array.isArray(res.data.vacancies) && res.data.vacancies.length > 0 && isMounted) {
          setVacancies(res.data.vacancies);
        } else if (isMounted) {
          // Fallback to sampleVacancies with dynamic client-side filtering
          setVacancies([]);
        }
      } catch (err) {
        if (isMounted) {
          setVacancies([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [activeTab, scope, authority, qualification, mode, feeExemptOnly, search]);

  // Client-side filtering fallback
  const filteredVacancies = useMemo(() => {
    const now = new Date();
    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return vacancies.filter((v) => {
      // 1. Tab check
      const last = v.lastDate ? new Date(v.lastDate) : null;
      const start = v.startDate ? new Date(v.startDate) : null;

      if (activeTab === 'closing_soon') {
        if (!last || last < now || last > sevenDays) return false;
      } else if (activeTab === 'upcoming') {
        if (!start || start <= now) return false;
      } else if (activeTab === 'admit_cards') {
        if (!v.admitCardUrl && !v.admitCardDate) return false;
      } else if (activeTab === 'results') {
        if (!v.resultUrl && !v.scorecardUrl && !v.meritListUrl) return false;
      } else if (activeTab === 'answer_keys') {
        if (!v.answerKeyUrl) return false;
      } else if (activeTab === 'exam_notices') {
        if (!v.examDate && !v.examDateNote && !v.syllabusUrl) return false;
      } else if (activeTab === 'offline_forms') {
        if (v.applicationMode !== 'offline' && v.applicationMode !== 'both' && !v.offlineFormDetails) return false;
      } else if (activeTab === 'archive') {
        if (v.status !== 'archived' && v.status !== 'closed' && (!last || last >= now)) return false;
      } else if (activeTab === 'active') {
        if (v.status === 'archived' || v.status === 'closed' || v.status === 'cancelled') return false;
        if (start && start > now) return false;
        if (last && last < now) return false;
      }

      // 2. Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = (v.title || "").toLowerCase().includes(q) || (v.titleHi || "").toLowerCase().includes(q);
        const matchOrg = (v.organization || "").toLowerCase().includes(q) || (v.department || "").toLowerCase().includes(q);
        const matchAdvt = (v.advertisementNumber || "").toLowerCase().includes(q);
        if (!matchTitle && !matchOrg && !matchAdvt) return false;
      }

      // 3. Scope
      if (scope === "MP" && v.locationScope !== "MP" && !v.state.toLowerCase().includes("madhya")) return false;
      if (scope === "All India" && v.locationScope !== "All India" && v.state !== "All India") return false;

      // 4. Authority
      if (authority !== "All Authorities" && v.recruitingAuthority !== authority && !v.department.includes(authority)) return false;

      // 5. Qualification
      if (qualification !== "All") {
        const qual = (v.qualification || "") + (v.qualificationLevel || "");
        if (!qual.toLowerCase().includes(qualification.toLowerCase().replace(" pass", ""))) return false;
      }

      // 6. Mode
      if (mode !== "all" && v.applicationMode && v.applicationMode !== mode && v.applicationMode !== "both") return false;

      // 7. Fee exempt
      if (feeExemptOnly && !v.isFeeExempt && (v.feeDetails?.general || 0) > 0) return false;

      return true;
    });
  }, [vacancies, activeTab, search, scope, authority, qualification, mode, feeExemptOnly]);

  const tabs: TabItem[] = [
    { id: 'active', labelEn: 'Active Vacancies', labelHi: 'सक्रिय भर्तियां', badge: tabCounts.active },
    { id: 'closing_soon', labelEn: 'Closing Soon', labelHi: 'जल्द समाप्त', badge: tabCounts.closing_soon },
    { id: 'upcoming', labelEn: 'Upcoming', labelHi: 'आगामी भर्तियां', badge: tabCounts.upcoming },
    { id: 'admit_cards', labelEn: 'Admit Cards', labelHi: 'प्रवेश पत्र', badge: tabCounts.admit_cards },
    { id: 'results', labelEn: 'Results', labelHi: 'रिजल्ट / परिणाम', badge: tabCounts.results },
    { id: 'answer_keys', labelEn: 'Answer Keys', labelHi: 'उत्तर कुंजी', badge: tabCounts.answer_keys },
    { id: 'exam_notices', labelEn: 'Exam Notices', labelHi: 'परीक्षा सूचना', badge: tabCounts.exam_notices },
    { id: 'offline_forms', labelEn: 'Offline Forms', labelHi: 'ऑफलाइन फॉर्म', badge: tabCounts.offline_forms },
    { id: 'archive', labelEn: 'Archive', labelHi: 'आर्काइव', badge: tabCounts.archive },
  ];

  // Helper to format days remaining
  const getDeadlineMeta = (lastDateStr?: string) => {
    if (!lastDateStr) return null;
    const now = new Date();
    const last = new Date(lastDateStr);
    const msDiff = last.getTime() - now.getTime();
    const days = Math.ceil(msDiff / (1000 * 60 * 60 * 24));

    if (days < 0) {
      return { status: 'expired', textEn: 'Application Closed', textHi: 'आवेदन समाप्त', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
    }
    if (days === 0) {
      return { status: 'urgent', textEn: 'Ends Today (23:59 IST)', textHi: 'आज अंतिम दिन (23:59 IST)', color: 'bg-red-600 text-white animate-pulse' };
    }
    if (days <= 3) {
      return { status: 'urgent', textEn: `${days} Days Left!`, textHi: `केवल ${days} दिन शेष!`, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    }
    if (days <= 7) {
      return { status: 'closing', textEn: `${days} Days Left`, textHi: `${days} दिन बाकी`, color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
    }
    return { status: 'open', textEn: 'Active Application', textHi: 'आवेदन खुला है', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Hero Header */}
      <div className="relative border-b border-white/10 bg-gradient-to-b from-navy-900 to-navy-950 pt-8 pb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                {lang === "hi" ? "सत्यापित भर्ती सूचना पोर्टल" : "Verified Recruitment Information Module"}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {lang === "hi" ? "वैकेंसी अपडेट" : "Vacancy Update"}
              </h1>
              <p className="text-saffron-200/80 text-sm md:text-base mt-1 max-w-2xl">
                {lang === "hi" 
                  ? "मध्य प्रदेश एवं अखिल भारतीय सरकारी भर्तियां, महत्वपूर्ण तिथियां, पात्रता, दस्तावेज चेकलिस्ट एवं सहायता।"
                  : "Madhya Pradesh & All India verified recruitments, IST deadlines, document checklists, and PDS filing assistance."}
              </p>
            </div>

            {/* Quick Helpline Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleLiveSync}
                disabled={syncing}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-saffron-500/30 text-saffron-300 text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-saffron-400" : ""}`} />
                <span>{syncing ? (lang === "hi" ? "सिंक हो रहा है..." : "Syncing...") : (lang === "hi" ? "ताज़ा भर्तियां सिंक करें" : "Live Sync")}</span>
              </button>
              <a
                href={whatsAppUrl("नमस्ते, मुझे भर्ती/वैकेंसी फॉर्म भरने में सहायता चाहिए।")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg transition"
              >
                <MessageSquare className="w-4 h-4" />
                {lang === "hi" ? "व्हाट्सएप सहायता" : "WhatsApp Desk"}
              </a>
              <a
                href={telSupportUrl()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white text-xs font-semibold shadow-lg transition"
              >
                <Phone className="w-4 h-4" />
                {lang === "hi" ? "हेल्पलाइन कॉल" : "Call Helpline"}
              </a>
            </div>
          </div>

          {/* Scope Selector (MP vs Central) */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <button
              onClick={() => setScope("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                scope === "all"
                  ? "bg-saffron-500 text-white border-saffron-400 shadow-md"
                  : "bg-navy-900/80 text-saffron-200/80 border-white/10 hover:border-white/20"
              }`}
            >
              {lang === "hi" ? "सभी भर्तियां (All)" : "All Jobs"}
            </button>
            <button
              onClick={() => setScope("MP")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                scope === "MP"
                  ? "bg-saffron-500 text-white border-saffron-400 shadow-md"
                  : "bg-navy-900/80 text-saffron-200/80 border-white/10 hover:border-white/20"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              {lang === "hi" ? "मध्य प्रदेश भर्तियां (MP Govt)" : "Madhya Pradesh Govt"}
            </button>
            <button
              onClick={() => setScope("All India")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                scope === "All India"
                  ? "bg-saffron-500 text-white border-saffron-400 shadow-md"
                  : "bg-navy-900/80 text-saffron-200/80 border-white/10 hover:border-white/20"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-300" />
              {lang === "hi" ? "अखिल भारतीय / केंद्र सरकार (Central)" : "All India / Central Govt"}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filter Toolbar */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-300" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === "hi" ? "पद, विभाग या विज्ञापन क्रमांक खोजें..." : "Search jobs, department, advt no..."}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-navy-900 text-white text-xs placeholder:text-saffron-200/50 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            {/* Recruiting Authority */}
            <div>
              <select
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-navy-900 text-white text-xs focus:outline-none focus:ring-2 focus:ring-saffron-500"
              >
                {recruitmentAuthorities.map((auth) => (
                  <option key={auth} value={auth}>{auth}</option>
                ))}
              </select>
            </div>

            {/* Qualification */}
            <div>
              <select
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-navy-900 text-white text-xs focus:outline-none focus:ring-2 focus:ring-saffron-500"
              >
                {qualifications.map((q) => (
                  <option key={q} value={q}>
                    {lang === "hi" ? `योग्यता: ${q}` : `Qualification: ${q}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Switcher */}
            <div>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-navy-900 text-white text-xs focus:outline-none focus:ring-2 focus:ring-saffron-500"
              >
                <option value="all">{lang === "hi" ? "सभी मोड (Online & Offline)" : "All Modes (Online & Offline)"}</option>
                <option value="online">{lang === "hi" ? "केवल ऑनलाइन आवेदन" : "Online Only"}</option>
                <option value="offline">{lang === "hi" ? "केवल ऑफलाइन फॉर्म" : "Offline Only"}</option>
              </select>
            </div>
          </div>

          {/* Fee Exempt Checkbox & Clear Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs text-saffron-200/80">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={feeExemptOnly}
                onChange={(e) => setFeeExemptOnly(e.target.checked)}
                className="rounded border-white/20 text-saffron-500 focus:ring-saffron-400 bg-navy-900"
              />
              <span>{lang === "hi" ? "केवल निःशुल्क / फीस मुक्त भर्तियां (Fee Exempt Only)" : "Fee Exempt Applications Only"}</span>
            </label>

            <div className="flex items-center gap-3">
              <span>
                {lang === "hi" 
                  ? `कुल ${filteredVacancies.length} भर्तियां उपलब्ध` 
                  : `${filteredVacancies.length} vacancies matched`}
              </span>
              {(search || scope !== "all" || authority !== "All Authorities" || qualification !== "All" || mode !== "all" || feeExemptOnly) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setScope("all");
                    setAuthority("All Authorities");
                    setQualification("All");
                    setMode("all");
                    setFeeExemptOnly(false);
                  }}
                  className="text-xs text-saffron-400 hover:underline"
                >
                  {lang === "hi" ? "फिल्टर हटाएं" : "Reset Filters"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 9 Section Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-white/10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition shrink-0 ${
                  isActive
                    ? "bg-saffron-500 text-white border-saffron-400 shadow-md"
                    : "bg-navy-900/60 text-saffron-200/80 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                <span>{lang === "hi" ? tab.labelHi : tab.labelEn}</span>
                {typeof tab.badge === "number" && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-white text-saffron-600" : "bg-saffron-500/20 text-saffron-300"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Vacancies List */}
        {filteredVacancies.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-white/10">
            <HelpCircle className="w-12 h-12 text-saffron-400/50 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              {lang === "hi" ? "कोई भर्ती नहीं मिली" : "No Vacancies Found"}
            </h3>
            <p className="text-saffron-200/70 text-xs max-w-md mx-auto mb-4">
              {lang === "hi" 
                ? "आपके द्वारा चयनित फिल्टर या सर्च के लिए इस सेक्शन में कोई भर्ती उपलब्ध नहीं है। कृपया फिल्टर बदलकर देखें।"
                : "No recruitment updates match your search criteria. Try modifying your filters."}
            </p>
            <button
              onClick={() => {
                setActiveTab('active');
                setSearch("");
                setScope("all");
                setAuthority("All Authorities");
                setQualification("All");
              }}
              className="px-4 py-2 rounded-xl bg-saffron-500 text-white text-xs font-semibold"
            >
              {lang === "hi" ? "सभी सक्रिय भर्तियां देखें" : "View Active Vacancies"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVacancies.map((vacancy) => {
              const deadline = getDeadlineMeta(vacancy.lastDate);
              const slugOrId = vacancy.slug || vacancy.id;

              return (
                <div
                  key={vacancy.id || vacancy.slug}
                  className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-saffron-400/50 transition-all duration-200 shadow-md"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Main Info */}
                    <div className="flex-1 space-y-2">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {vacancy.recruitingAuthority && (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-semibold border border-blue-500/20">
                            {vacancy.recruitingAuthority}
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full bg-saffron-500/15 text-saffron-300 font-medium border border-saffron-500/20">
                          {vacancy.locationScope === "MP" ? "मध्य प्रदेश (MP)" : "All India"}
                        </span>
                        {vacancy.applicationMode === "offline" && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                            {lang === "hi" ? "ऑफलाइन फॉर्म" : "Offline Form"}
                          </span>
                        )}
                        {vacancy.isFeeExempt && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                            {lang === "hi" ? "निःशुल्क (Fee Exempt)" : "Fee Exempt"}
                          </span>
                        )}
                        {deadline && (
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${deadline.color}`}>
                            {lang === "hi" ? deadline.textHi : deadline.textEn}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <Link href={`/vacancy-update/${slugOrId}`} className="block group">
                        <h2 className="text-base md:text-lg font-bold text-white group-hover:text-saffron-400 transition-colors">
                          {lang === "hi" && vacancy.titleHi ? vacancy.titleHi : vacancy.title}
                        </h2>
                      </Link>

                      {/* Department */}
                      <div className="flex items-center gap-1.5 text-xs text-saffron-200/80">
                        <Building2 className="w-3.5 h-3.5 text-saffron-400 shrink-0" />
                        <span>{lang === "hi" && vacancy.departmentHi ? vacancy.departmentHi : vacancy.department}</span>
                        {vacancy.advertisementNumber && (
                          <span className="text-saffron-300/60 ml-1">
                            • Advt: {vacancy.advertisementNumber}
                          </span>
                        )}
                      </div>

                      {/* Key Attributes Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2 text-xs text-saffron-200/90">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-saffron-400 shrink-0" />
                          <span><strong>{vacancy.totalPosts.toLocaleString()}</strong> {lang === "hi" ? "पद" : "Posts"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-saffron-400 shrink-0" />
                          <span className="truncate" title={vacancy.qualification}>{vacancy.qualification}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-saffron-400 shrink-0" />
                          <span>{lang === "hi" ? "अंतिम तिथि:" : "Last Date:"} <strong>{vacancy.lastDate}</strong></span>
                        </div>
                        {vacancy.salary && (
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-emerald-400 font-semibold">{vacancy.salary}</span>
                          </div>
                        )}
                      </div>

                      {/* Fee Preview */}
                      {vacancy.feeDetails && (
                        <div className="text-[11px] text-saffron-200/70 pt-1">
                          {vacancy.feeDetails.note ? (
                            <span>{vacancy.feeDetails.note}</span>
                          ) : (
                            <span>
                              {lang === "hi" ? "सरकारी फीस:" : "Govt Fee:"} UR/Gen: ₹{vacancy.feeDetails.general ?? "—"} | SC/ST/Female: ₹{vacancy.feeDetails.sc ?? "—"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Dual Action CTAs */}
                    <div className="flex flex-row lg:flex-col items-center gap-2 shrink-0 pt-2 lg:pt-0">
                      {/* View Details Permanent Link */}
                      <Link
                        href={`/vacancy-update/${slugOrId}`}
                        className="w-full lg:w-44 px-4 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow"
                      >
                        <span>{lang === "hi" ? "विवरण देखें" : "View Details"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {/* Official Website or Form */}
                      {(vacancy.applyUrl || vacancy.applyLink || vacancy.officialWebsiteUrl) && (
                        <a
                          href={vacancy.applyUrl || vacancy.applyLink || vacancy.officialWebsiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full lg:w-44 px-3 py-2 rounded-xl border border-white/20 bg-navy-900/80 hover:bg-white/10 text-white text-[11px] font-medium text-center transition flex items-center justify-center gap-1"
                        >
                          <span>{lang === "hi" ? "Official पोर्टल" : "Official Portal"}</span>
                          <ExternalLink className="w-3 h-3 text-saffron-300" />
                        </a>
                      )}

                      {/* PDS Assist Button */}
                      {vacancy.pdsAssistance?.isAvailable && (
                        <a
                          href={whatsAppUrl(`नमस्ते, मुझे "${vacancy.title}" का आवेदन फॉर्म भरवाना है। कृपया सहायता करें।`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full lg:w-44 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium text-center transition flex items-center justify-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>{lang === "hi" ? "PDS से फॉर्म भरवाएं" : "PDS Form Filing"}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mandatory PDS Non-Government Disclaimer */}
        <div className="mt-10 p-5 rounded-2xl bg-navy-900/90 border border-saffron-500/20 text-xs text-saffron-200/80 leading-relaxed shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-saffron-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-1">
                {lang === "hi" ? "महत्वपूर्ण वैधानिक अस्वीकरण (Disclaimer):" : "Official Statutory Disclaimer:"}
              </p>
              <p>
                {lang === "hi"
                  ? "“Pradhan Digital Services एक निजी डिजिटल सहायता (CSC-स्टाइल) सेवा मंच है। सभी सरकारी सेवाएं एवं भर्तियां संबंधित आधिकारिक पोर्टलों और शासकीय नियमों के अधीन ही संसाधित की जाती हैं। हम कोई सरकारी विभाग या सरकारी उपक्रम नहीं हैं।”"
                  : "“Pradhan Digital Services is a private digital assistance platform. Government services are processed through official portals and applicable government rules. We are not a government department.”"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

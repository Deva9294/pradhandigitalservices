"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Pause, ExternalLink, FileText, Clock, Ticket, BarChart3, Bell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { vacancyApi } from "@/lib/api";

type MarqueeItem = {
  id: string;
  title: string;
  titleHi: string;
  url: string;
  type: "vacancy" | "deadline" | "admit_card" | "result" | "notice";
  priority: "normal" | "urgent" | "critical";
};

export default function MarqueeSection() {
  const { lang } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [items, setItems] = useState<MarqueeItem[]>([]);

  useEffect(() => {
    let active = true;
    const loadLatest = async () => {
      try {
        const response = await vacancyApi.getAll({ tab: "active", page: 1, limit: 12 });
        if (!active) return;
        const records = Array.isArray(response.data?.vacancies) ? response.data.vacancies : [];
        const latest = records
          .filter((v: any) => v?.slug && (v?.title || v?.titleHi))
          .sort((a: any, b: any) =>
            new Date(b.publishedAt || b.createdAt || 0).getTime() -
            new Date(a.publishedAt || a.createdAt || 0).getTime()
          )
          .map((v: any) => {
            const closing = v.lastDate && new Date(v.lastDate).getTime() - Date.now() <= 7 * 86400000;
            return {
              id: String(v._id || v.id || v.slug),
              title: v.title || v.titleHi,
              titleHi: v.titleHi || v.title,
              url: `/vacancy-update/${v.slug}`,
              type: "vacancy" as const,
              priority: closing ? "urgent" as const : "normal" as const,
            };
          });
        setItems(latest);
      } catch {
        // Keep the ticker empty rather than showing stale or fabricated vacancy alerts.
      }
    };

    loadLatest();
    const refresh = window.setInterval(loadLatest, 5 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(refresh);
    };
  }, []);

  const iconFor = (type: MarqueeItem["type"]) => {
    if (type === "deadline") return <Clock className="w-3.5 h-3.5 text-red-400" />;
    if (type === "admit_card") return <Ticket className="w-3.5 h-3.5 text-purple-400" />;
    if (type === "result") return <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />;
    if (type === "notice") return <Bell className="w-3.5 h-3.5 text-amber-400" />;
    return <FileText className="w-3.5 h-3.5 text-blue-400" />;
  };

  if (!items.length) return null;
  const loopItems = [...items, ...items];

  return (
    <div className="bg-navy-50 dark:bg-navy-900 border-y border-navy-200 dark:border-navy-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 py-2.5">
          <button
            type="button"
            onClick={() => setIsPaused((value) => !value)}
            className="flex-shrink-0 p-2 rounded-full hover:bg-navy-200 dark:hover:bg-navy-800 transition"
            aria-label={isPaused ? "Play marquee" : "Pause marquee"}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <span className="flex-shrink-0 text-sm font-semibold text-navy-700 dark:text-navy-200">
            {lang === "hi" ? "ताज़ा वैकेंसी:" : "Latest Vacancies:"}
          </span>
          <div
            className="flex-1 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <div
              className="flex w-max gap-6"
              style={{
                animation: isPaused ? "none" : "pds-marquee 12s linear infinite",
                willChange: "transform",
              }}
            >
              {loopItems.map((item, index) => (
                <Link
                  key={`${item.id}-${index}`}
                  href={item.url}
                  className="flex items-center gap-2 flex-shrink-0 px-4 py-2 bg-white dark:bg-navy-800 rounded-lg border border-navy-200 dark:border-navy-700 hover:border-saffron-500 dark:hover:border-saffron-400 transition group"
                >
                  <span className={`w-2 h-2 rounded-full ${item.priority === "urgent" ? "bg-orange-500" : "bg-green-500"}`} />
                  <span className="flex items-center">{iconFor(item.type)}</span>
                  <span className="text-sm text-navy-700 dark:text-navy-200 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition">
                    {lang === "hi" ? item.titleHi : item.title}
                  </span>
                  <ExternalLink className="w-3 h-3 text-navy-400 group-hover:text-saffron-500 transition" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes pds-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="pds-marquee"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Play, Pause, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

interface MarqueeItem {
  id: string;
  type: "vacancy" | "deadline" | "admit_card" | "result" | "scheme" | "notice";
  title: string;
  titleHi: string;
  url: string;
  priority: "normal" | "urgent" | "critical";
}

// Sample data - in production, this would come from the API
const sampleMarqueeItems: MarqueeItem[] = [
  {
    id: "1",
    type: "vacancy",
    title: "MP Police Constable Recruitment 2026 - 4000 Posts",
    titleHi: "एमपी पुलिस कांस्टेबल भर्ती 2026 - 4000 पद",
    url: "/vacancies/mp-police-constable-2026",
    priority: "urgent"
  },
  {
    id: "2",
    type: "deadline",
    title: "UPSC CSE 2026 Application Deadline: March 31",
    titleHi: "यूपीएससी सीएसई 2026 आवेदन की अंतिम तिथि: 31 मार्च",
    url: "/vacancies/upsc-cse-2026",
    priority: "critical"
  },
  {
    id: "3",
    type: "admit_card",
    title: "SSC CGL 2026 Tier 1 Admit Card Released",
    titleHi: "एसएससी सीजीएल 2026 टियर 1 प्रवेश पत्र जारी",
    url: "/admit-cards/ssc-cgl-2026",
    priority: "normal"
  },
  {
    id: "4",
    type: "result",
    title: "CBSE Board Exam 2026 Class 10 Results Declared",
    titleHi: "सीबीएसई बोर्ड परीक्षा 2026 कक्षा 10 के परिणाम घोषित",
    url: "/results/cbse-class-10-2026",
    priority: "normal"
  },
  {
    id: "5",
    type: "scheme",
    title: "PM Kisan 15th Installment Released - Check Status",
    titleHi: "पीएम किसान 15वीं किस्त जारी - स्थिति जांचें",
    url: "/government-schemes/pm-kisan-15th-installment",
    priority: "urgent"
  },
];

export default function MarqueeSection() {
  const { lang } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [items, setItems] = useState<MarqueeItem[]>(sampleMarqueeItems);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500";
      case "urgent": return "bg-orange-500";
      default: return "bg-green-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "vacancy": return "📋";
      case "deadline": return "⏰";
      case "admit_card": return "🎫";
      case "result": return "📊";
      case "scheme": return "🎁";
      case "notice": return "📢";
      default: return "📌";
    }
  };

  return (
    <div className="bg-navy-50 dark:bg-navy-900 border-y border-navy-200 dark:border-navy-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-3">
          {/* Control Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex-shrink-0 p-2 rounded-full hover:bg-navy-200 dark:hover:bg-navy-800 transition"
            aria-label={isPaused ? "Play marquee" : "Pause marquee"}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Label */}
          <span className="flex-shrink-0 text-sm font-medium text-navy-700 dark:text-navy-200">
            {lang === "hi" ? "ताज़ा अपडेट:" : "Latest Updates:"}
          </span>

          {/* Marquee Container */}
          <div 
            className="flex-1 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div 
              className={`flex gap-8 ${isPaused ? '' : 'animate-marquee'}`}
              style={{
                animation: isPaused ? 'none' : 'marquee 30s linear infinite',
              }}
            >
              {/* Duplicate items for seamless loop */}
              {[...items, ...items].map((item, index) => (
                <Link
                  key={`${item.id}-${index}`}
                  href={item.url}
                  className="flex items-center gap-2 flex-shrink-0 px-4 py-2 bg-white dark:bg-navy-800 rounded-lg border border-navy-200 dark:border-navy-700 hover:border-saffron-500 dark:hover:border-saffron-400 transition group"
                >
                  {/* Priority Indicator */}
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority)}`} />
                  
                  {/* Type Icon */}
                  <span className="text-lg">{getTypeIcon(item.type)}</span>
                  
                  {/* Title */}
                  <span className="text-sm text-navy-700 dark:text-navy-200 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition">
                    {lang === "hi" ? item.titleHi : item.title}
                  </span>
                  
                  {/* External Link Icon */}
                  <ExternalLink className="w-3 h-3 text-navy-400 group-hover:text-saffron-500 transition" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
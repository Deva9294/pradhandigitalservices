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
    title: "MP Police Constable (GD & Radio) 2026 - 7500 Posts Open",
    titleHi: "एमपी पुलिस आरक्षक (जीडी व रेडियो) 2026 - 7500 पद आवेदन शुरू",
    url: "/vacancy-update/mp-police-constable-gd-radio-recruitment-2026",
    priority: "urgent"
  },
  {
    id: "2",
    type: "deadline",
    title: "Railway RRB ALP & Technician - Deadline Approaching!",
    titleHi: "रेलवे आरआरबी एएलपी एवं तकनीशियन - अंतिम तिथि निकट!",
    url: "/vacancy-update/rrb-alp-technician-centralized-recruitment-2026",
    priority: "critical"
  },
  {
    id: "3",
    type: "vacancy",
    title: "MPESB Sub Engineer & Group 3 Combined Exam 2026 - Apply Online",
    titleHi: "एमपीईएसबी उप अभियंता एवं ग्रुप-3 भर्ती 2026 - ऑनलाइन आवेदन जारी",
    url: "/vacancy-update/mpesb-group-3-sub-engineer-recruitment-2026",
    priority: "urgent"
  },
  {
    id: "4",
    type: "admit_card",
    title: "SSC CGL 2026 Application Portal Active - Live Photo Standard",
    titleHi: "एसएससी सीजीएल 2026 आवेदन पोर्टल सक्रिय - लाइव फोटो नियम लागू",
    url: "/vacancy-update/ssc-combined-graduate-level-cgl-exam-2026",
    priority: "normal"
  },
  {
    id: "5",
    type: "scheme",
    title: "PM Kisan Samman Nidhi & Ladli Behna Yojana Status Verification",
    titleHi: "पीएम किसान सम्मान निधि एवं लाड़ली बहना योजना स्थिति जांचें",
    url: "/services",
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
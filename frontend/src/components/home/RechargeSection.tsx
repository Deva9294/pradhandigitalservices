"use client";

import Link from "next/link";
import { Smartphone, Tv, Zap, Droplets, Flame, Wifi, Shield, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const rechargeItems = [
  { icon: Smartphone, name: "Mobile Recharge", nameHi: "मोबाइल रिचार्ज", slug: "mobile-recharge", color: "from-saffron-500 to-saffron-600" },
  { icon: Tv, name: "DTH Recharge", nameHi: "DTH रिचार्ज", slug: "dth-recharge", color: "from-saffron-500 to-saffron-600" },
  { icon: Zap, name: "FASTag", nameHi: "FASTag", slug: "fastag-recharge", color: "from-saffron-500 to-saffron-600" },
  { icon: Zap, name: "Electricity", nameHi: "बिजली", slug: "electricity-bill", color: "from-saffron-500 to-saffron-600" },
  { icon: Droplets, name: "Water Bill", nameHi: "पानी बिल", slug: "water-bill", color: "from-saffron-500 to-saffron-600" },
  { icon: Flame, name: "Gas Bill", nameHi: "गैस बिल", slug: "gas-bill", color: "from-saffron-500 to-saffron-600" },
  { icon: Wifi, name: "Broadband", nameHi: "ब्रॉडबैंड", slug: "broadband-bill", color: "from-saffron-500 to-saffron-600" },
  { icon: Shield, name: "Insurance", nameHi: "बीमा", slug: "insurance-premium", color: "from-saffron-500 to-saffron-600" },
  { icon: CreditCard, name: "Credit Card", nameHi: "क्रेडिट कार्ड", slug: "credit-card-bill", color: "from-saffron-500 to-saffron-600" },
];

export default function RechargeSection() {
  const { lang, t } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-br from-navy-900 to-navy-800 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">{t.sections.recharge}</h2>
        <p className="text-navy-300 text-center mb-8 text-sm">
          {lang === "hi" ? "तुरंत रिचार्ज और बिल भुगतान" : "Instant recharge & bill payments"}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {rechargeItems.map((item) => (
            <Link key={item.slug} href={`/recharge/${item.slug}`}
              className="group flex flex-col items-center p-4 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/20 transition-all hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-2 group-hover:scale-110 transition`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-center font-medium text-white/90 leading-tight">
                {lang === "hi" ? item.nameHi : item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

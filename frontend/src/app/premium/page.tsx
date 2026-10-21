"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Check, ArrowRight, ShieldCheck, 
  HelpCircle, Star, Phone, MessageSquare, Zap, Crown 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { whatsAppUrl, telSupportUrl } from "@/lib/utils";

export default function PremiumPage() {
  const { lang } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  return (
    <div className="min-h-screen bg-[#F6F8FC] dark:bg-navy-950 text-navy-900 dark:text-white">
      {/* Top Hero */}
      <div className="bg-gradient-to-b from-[#0A1B4D] to-[#071333] text-white py-14 border-b border-white/10">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-saffron-500/20 border border-saffron-500/30 text-saffron-300 text-xs font-semibold mb-3">
            <Crown className="w-3.5 h-3.5 text-saffron-400" />
            <span>PDS Citizen Premium Membership</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {lang === "hi" ? "सरकारी सेवाओं पर 0 सर्विस फीस" : "Save on Every Service Application"}
          </h1>
          <p className="text-sm md:text-base text-saffron-200/80 mt-3 leading-relaxed">
            {lang === "hi"
              ? "PDS प्रीमियम सदस्यता के साथ सभी ऑनलाइन सरकारी फॉर्मों पर शून्य ऑपरेटर चार्ज एवं निःशुल्क स्पीड पोस्ट होम डिलीवरी प्राप्त करें।"
              : "Zero service charges on all government form fillings, priority operator assistance, and free doorstep Speed Post dispatches."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Toggle Switch */}
        <div className="flex justify-center mb-10">
          <div className="p-1 rounded-2xl bg-navy-100 dark:bg-navy-900 border border-navy-200 dark:border-white/10 flex items-center gap-1">
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                selectedPlan === "monthly"
                  ? "bg-saffron-500 text-navy-950 shadow"
                  : "text-navy-700 dark:text-white/80 hover:text-navy-950"
              }`}
            >
              Monthly (मासिक - ₹99/माह)
            </button>
            <button
              onClick={() => setSelectedPlan("yearly")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedPlan === "yearly"
                  ? "bg-saffron-500 text-navy-950 shadow"
                  : "text-navy-700 dark:text-white/80 hover:text-navy-950"
              }`}
            >
              <span>Annual Pro (वार्षिक - ₹499/वर्ष)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-extrabold">Save 58%</span>
            </button>
          </div>
        </div>

        {/* 2 Detailed Plan Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Plan 1: Monthly */}
          <div className={`p-8 rounded-3xl border transition-all space-y-6 flex flex-col justify-between ${
            selectedPlan === "monthly"
              ? "bg-white dark:bg-navy-900 border-saffron-500 shadow-xl ring-2 ring-saffron-500/20"
              : "bg-white/60 dark:bg-navy-900/60 border-navy-200 dark:border-white/10"
          }`}>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-saffron-600 dark:text-saffron-400 uppercase tracking-wider">
                  Flexible Option
                </span>
                <h3 className="text-2xl font-black text-navy-900 dark:text-white mt-1">Monthly Plan</h3>
                <p className="text-xs text-navy-500 dark:text-white/60 mt-1">
                  Ideal for candidates filling exam forms or urgent monthly certificates.
                </p>
              </div>

              <div className="flex items-baseline gap-1 py-3 border-y border-navy-100 dark:border-white/10">
                <span className="text-4xl font-black text-navy-900 dark:text-white">₹99</span>
                <span className="text-xs text-navy-500 dark:text-white/60 font-semibold">/ month</span>
              </div>

              <ul className="space-y-3 text-xs text-navy-700 dark:text-white/90">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Zero PDS service fee</strong> on up to 3 applications per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>1 Free Laminated Speed Post</strong> dispatch per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Priority WhatsApp desk with expert operators</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Direct admit card and result notifications</span>
                </li>
              </ul>
            </div>

            <a
              href={whatsAppUrl("नमस्ते, मुझे PDS Monthly Premium (₹99) प्लान लेना है।")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white dark:bg-white/10 dark:hover:bg-white/20 font-bold text-xs text-center transition flex items-center justify-center gap-1.5 shadow"
            >
              <span>Get Monthly Pro (₹99)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Plan 2: Annual */}
          <div className={`p-8 rounded-3xl border transition-all space-y-6 flex flex-col justify-between relative ${
            selectedPlan === "yearly"
              ? "bg-white dark:bg-navy-900 border-saffron-500 shadow-2xl ring-2 ring-saffron-500/30"
              : "bg-white/60 dark:bg-navy-900/60 border-navy-200 dark:border-white/10"
          }`}>
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-saffron-500 text-navy-950 font-extrabold text-[11px] uppercase tracking-wider shadow">
              ★ Best Value • 365 Days
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-saffron-600 dark:text-saffron-400 uppercase tracking-wider">
                  Full Year Peace of Mind
                </span>
                <h3 className="text-2xl font-black text-navy-900 dark:text-white mt-1">Annual Citizen Pro</h3>
                <p className="text-xs text-navy-500 dark:text-white/60 mt-1">
                  Complete digital service assistance for your entire household all year.
                </p>
              </div>

              <div className="flex items-baseline gap-1 py-3 border-y border-navy-100 dark:border-white/10">
                <span className="text-4xl font-black text-navy-900 dark:text-white">₹499</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">/ year (Just ₹41/month)</span>
              </div>

              <ul className="space-y-3 text-xs text-navy-700 dark:text-white/90">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Unlimited Zero PDS service fee</strong> on all jobs &amp; certificates</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>6 Free Laminated Speed Post</strong> dispatches anywhere in India</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Free MP Rojgar Panjiyan &amp; Samagra e-KYC renewals</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Guaranteed error-free application submission guarantee</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Dedicated phone &amp; WhatsApp operator hotline</span>
                </li>
              </ul>
            </div>

            <a
              href={whatsAppUrl("नमस्ते, मुझे PDS Annual Pro (₹499) वार्षिक प्लान लेना है।")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-navy-950 font-black text-xs text-center transition flex items-center justify-center gap-1.5 shadow-lg"
            >
              <span>Activate Annual Pro (₹499)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Benefits Breakdown Banner */}
        <div className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-white/10 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-saffron-500" />
            <span>Why Join Pradhan Digital Services Premium?</span>
          </h3>
          <p className="text-xs text-navy-600 dark:text-white/80 leading-relaxed">
            Standard cyber cafes and online kiosks charge ₹50 to ₹100 per form filling, plus additional fees for printing and lamination. With PDS Premium, active job seekers and families save thousands of rupees annually while enjoying certified error-free application processing and doorstep post deliveries.
          </p>
        </div>
      </div>
    </div>
  );
}

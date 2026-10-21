"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { 
  OnlineApplicationsIllustration, 
  VerificationIllustration, 
  HomeDeliveryIllustration 
} from "@/components/ui/VectorIllustrations";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const { lang } = useLanguage();

  const stages = [
    {
      number: "01",
      badge: "Stage 1: Submitted",
      badgeHi: "चरण 1: आवेदन सबमिशन",
      illustration: OnlineApplicationsIllustration,
      title: "1. Online Application Submission",
      titleHi: "1. ऑनलाइन आवेदन एवं दस्तावेज़ सबमिशन",
      description: "Select your desired digital service, enter basic applicant details, and upload required documents securely without visiting cyber cafes.",
      descriptionHi: "अपनी आवश्यकतानुसार सेवा चुनें, आवेदक विवरण भरें एवं आवश्यक दस्तावेज़ सुरक्षित रूप से अपलोड करें।"
    },
    {
      number: "02",
      badge: "Stage 2: Review / Pending",
      badgeHi: "चरण 2: समीक्षा एवं प्रोसेसिंग",
      illustration: VerificationIllustration,
      title: "2. Staff Verification & Processing",
      titleHi: "2. कर्मचारी सत्यापन एवं आधिकारिक प्रोसेसिंग",
      description: "Trained PDS operators verify document guidelines, perform compliance checks, and submit your application through the official government portal.",
      descriptionHi: "प्रशिक्षित PDS ऑपरेटर दस्तावेज़ों की जांच कर सरकारी नियमों अनुसार आधिकारिक पोर्टल पर फॉर्म प्रोसेस करते हैं।"
    },
    {
      number: "03",
      badge: "Stage 3: Done",
      badgeHi: "चरण 3: पूर्ण एवं दस्तावेज़ डिलीवरी",
      illustration: HomeDeliveryIllustration,
      title: "3. Digital Download & Home Delivery",
      titleHi: "3. डिजिटल डाउनलोड एवं होम डिलीवरी",
      description: "Receive instantaneous application acknowledgement. Download final verified PDF from your locker or opt for doorstep laminated Speed Post delivery.",
      descriptionHi: "स्वीकृति रसीद तुरंत प्राप्त करें। डिजिटल लॉकर से सत्यापित PDF डाउनलोड करें या घर बैठे स्पीड पोस्ट डिलीवरी प्राप्त करें।"
    }
  ];

  return (
    <section className="py-16 bg-[#071333] text-white border-t border-white/5 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/15 border border-saffron-500/30 text-saffron-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === "hi" ? "पारदर्शी 3-चरणीय कार्यप्रणाली" : "Transparent 3-Stage Workflow"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {lang === "hi" ? "सेवा प्रक्रिया: यह कैसे काम करता है?" : "How It Works: 3 Simple Stages"}
          </h2>
          <p className="text-saffron-200/80 text-xs md:text-sm mt-2">
            {lang === "hi"
              ? "पारदर्शी, सरल और समयबद्ध — आवेदन से लेकर अंतिम दस्तावेज़ प्राप्ति तक।"
              : "Clear, predictable and reliable — from initial submission to final document delivery."}
          </p>
        </div>

        {/* 3 Stages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {stages.map((stage, idx) => (
            <div
              key={stage.number}
              className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0A1B4D]/60 hover:border-saffron-400/50 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-lg bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 text-xs font-bold">
                    {lang === "hi" ? stage.badgeHi : stage.badge}
                  </span>
                  <span className="text-2xl font-black text-white/20">{stage.number}</span>
                </div>

                {/* Vector Illustration */}
                <div className="py-2 flex justify-center">
                  <stage.illustration size={72} className="w-18 h-18 drop-shadow-md" />
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-white mt-3 mb-2">
                  {lang === "hi" ? stage.titleHi : stage.title}
                </h3>
                <p className="text-xs text-saffron-200/80 leading-relaxed">
                  {lang === "hi" ? stage.descriptionHi : stage.description}
                </p>
              </div>

              {/* Bottom stage connector info */}
              <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {idx === 0 
                    ? (lang === "hi" ? "त्वरित रसीद उत्पन्न" : "Instant Receipt Generated")
                    : idx === 1 
                    ? (lang === "hi" ? "विशेषज्ञ ऑपरेटर समीक्षा" : "Expert Operator Review")
                    : (lang === "hi" ? "सत्यापित PDF व ट्रैकिंग" : "Verified PDF & Tracking")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-navy-900 to-[#0A1B4D] border border-saffron-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-white text-base">
              {lang === "hi" ? "क्या आपको कोई ऑनलाइन फॉर्म भरवाना है?" : "Ready to file an application or download certificates?"}
            </h4>
            <p className="text-xs text-saffron-200/80">
              {lang === "hi" ? "हमारी टीम सुरक्षित और न्यूनतम शुल्क में सहायता प्रदान करती है।" : "Our operators ensure zero errors and prompt delivery."}
            </p>
          </div>
          <Link
            href="/services"
            className="px-6 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-navy-950 font-extrabold text-xs transition flex items-center gap-1.5 shrink-0 shadow-lg"
          >
            <span>{lang === "hi" ? "सेवाएं देखें" : "Explore Services"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

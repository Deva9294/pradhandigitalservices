"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Smartphone, DownloadCloud, QrCode, ShieldCheck, BellRing, 
  Camera, Zap, CheckCircle2, Star, ArrowRight, MessageSquare, 
  FileCheck2, Clock, Sparkles, ExternalLink, HelpCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { whatsAppUrl } from "@/lib/utils";

export default function PradhanESevaAppSection() {
  const { lang } = useLanguage();
  const [showQrModal, setShowQrModal] = useState(false);

  const features = [
    {
      icon: Zap,
      titleHi: "450+ सरकारी एवं डिजिटल सेवाएं",
      titleEn: "450+ Citizen & Digital Services",
      descHi: "आधार, पैन, समग्र ई-केवाईसी, खसरा-खतौनी, राशन, ड्राइविंग लाइसेंस व सभी लोक सेवाएं एक ऐप में।",
      descEn: "Aadhaar, PAN, Samagra e-KYC, Land Records, Ration, DL and government schemes in one app."
    },
    {
      icon: BellRing,
      titleHi: "भर्ती एवं एडमिट कार्ड तुरंत अलर्ट",
      titleEn: "Instant Vacancy & Exam Alerts",
      descHi: "MPESB, MPPSC, पुलिस, पटवारी, रेलवे व SSC की नई भर्ती और एडमिट कार्ड आते ही सीधे फोन पर नोटिफिकेशन।",
      descEn: "Instant push notifications the moment new MP & Central government vacancies or admit cards are released."
    },
    {
      icon: Camera,
      titleHi: "स्मार्ट डॉक्यूमेंट स्कैनर व रिसाइजर",
      titleEn: "Smart Mobile Document Scanner",
      descHi: "मोबाइल कैमरे से दस्तावेज़ स्कैन करें और सरकारी फॉर्म के अनुसार 50KB/100KB में ऑटोमैटिक रिसाइज़ करें।",
      descEn: "Scan required documents via phone camera and automatically compress to 50KB/100KB government criteria."
    },
    {
      icon: ShieldCheck,
      titleHi: "लाइव आवेदन स्थिति व डिजिटल रसीद",
      titleEn: "Real-time Tracking & e-Receipts",
      descHi: "अपने आवेदन की वर्तमान स्थिति (Submitted, Under Review, Completed) देखें और अधिकृत रसीद डाउनलोड करें।",
      descEn: "Check live application progress at every stage and download official digitally signed acknowledgments."
    }
  ];

  return (
    <section id="pradhan-eseva-app" className="py-20 bg-gradient-to-b from-[#071333] via-[#0A1B4D] to-[#071333] text-white border-t border-saffron-500/20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header Badge */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-500/15 border border-saffron-500/30 text-saffron-300 text-xs font-bold mb-3 shadow-inner">
            <Smartphone className="w-4 h-4 text-saffron-400" />
            <span>{lang === "hi" ? "आधिकारिक मोबाइल ऐप्लिकेशन" : "Official Android Application"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-extrabold text-[10px]">v2.4 Live</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {lang === "hi" ? (
              <>
                डाउनलोड करें <span className="text-saffron-400">Pradhan eSeva</span> ऐप
              </>
            ) : (
              <>
                Download <span className="text-saffron-400">Pradhan eSeva</span> App
              </>
            )}
          </h2>

          <p className="text-saffron-200/80 text-sm sm:text-base mt-3 leading-relaxed">
            {lang === "hi"
              ? "अब सभी ऑनलाइन सेवाएं, फॉर्म सबमिशन, खसरा नकल और सरकारी नौकरी अपडेट आपके मोबाइल में। घर बैठे सुरक्षित आवेदन करें और रसीद पाएं।"
              : "Access 450+ digital citizen services, application tracking, land records, and instant MP recruitment alerts on your Android device."}
          </p>
        </div>

        {/* Main Content Grid: App Showcase + Download Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left Column (7 cols): App Highlights & Download CTAs */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Quick App Metrics / Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-white">4.8 / 5.0</span>
                <span className="text-white/60">(10k+ नागरिक)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white/90">{lang === "hi" ? "100% सुरक्षित एवं सत्यापित" : "100% Safe & Verified"}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <Clock className="w-4 h-4 text-saffron-400" />
                <span className="font-semibold text-white/90">Lightweight ~12 MB</span>
              </div>
            </div>

            {/* Features 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feat, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-saffron-500/40 hover:bg-white/[0.07] transition-all duration-300 space-y-2 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron-500/20 to-saffron-600/10 border border-saffron-500/30 flex items-center justify-center text-saffron-400 group-hover:scale-110 transition-transform">
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white">
                    {lang === "hi" ? feat.titleHi : feat.titleEn}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {lang === "hi" ? feat.descHi : feat.descEn}
                  </p>
                </div>
              ))}
            </div>

            {/* Download Buttons / Primary Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                
                {/* 1. Direct APK Download Button */}
                <a
                  href="/apps/pradhan-eseva.apk"
                  download="pradhan-eseva.apk"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-400 hover:to-amber-400 text-navy-950 font-extrabold text-sm transition-all shadow-xl shadow-saffron-500/20 flex items-center justify-center gap-2.5 group"
                >
                  <DownloadCloud className="w-5 h-5 text-navy-950 group-hover:-translate-y-0.5 transition-transform" />
                  <div className="text-left leading-tight">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-navy-950/80">Direct Android APK</div>
                    <div className="text-sm font-black">Pradhan eSeva (APK) डाउनलोड</div>
                  </div>
                </a>

                {/* 2. Instant PWA Web App Button */}
                <a
                  href={whatsAppUrl("नमस्ते, मुझे Pradhan eSeva Android App डाउनलोड लिंक एवं सहायता चाहिए।")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{lang === "hi" ? "व्हाट्सएप पर ऐप लिंक मंगाएं" : "Get App Link on WhatsApp"}</span>
                </a>

                {/* 3. QR Code Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowQrModal(!showQrModal)}
                  className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  title="Scan QR Code to Download"
                >
                  <QrCode className="w-4 h-4 text-saffron-400" />
                  <span>{lang === "hi" ? "QR स्कैन" : "Scan QR"}</span>
                </button>
              </div>

              {/* Install PWA Prompt Tip */}
              <div className="flex items-center gap-2 text-xs text-saffron-200/70 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {lang === "hi"
                    ? "बिना डाउनलोड किए सीधे क्रोम में 'Add to Home Screen' करके 0 MB में तुरंत उपयोग करें।"
                    : "Or tap 'Add to Home Screen' in Chrome browser to use with 0 MB storage instantly."}
                </span>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Smartphone Realistic App Frame Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            
            {/* Phone Mockup Wrapper */}
            <div className="relative w-full max-w-[310px] rounded-[44px] border-[6px] border-[#1D2947] bg-[#0A1B4D] shadow-[0_0_50px_rgba(255,122,0,0.25)] p-3 overflow-hidden">
              
              {/* Phone Speaker & Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#14203D] rounded-full z-20 flex items-center justify-center">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>

              {/* App Screen Content */}
              <div className="rounded-[34px] bg-[#071333] border border-white/10 overflow-hidden pt-8 pb-4 px-3.5 space-y-3.5 text-xs select-none">
                
                {/* App Top Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-500 to-amber-500 p-0.5 shadow">
                      <Image
                        src="/logo-icon-transparent.png"
                        alt="Pradhan eSeva Logo"
                        width={32}
                        height={32}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div>
                      <div className="font-black text-white text-xs leading-none">Pradhan eSeva</div>
                      <div className="text-[9px] font-bold text-saffron-400 uppercase tracking-wider mt-0.5">डिजिटल सेवा केंद्र</div>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>

                {/* App Search Bar Simulation */}
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-white/50 text-[10px]">
                  <span>🔍</span>
                  <span>खसरा, आधार, पैन, एडमिट कार्ड...</span>
                </div>

                {/* Quick Service Cards 2x3 Grid */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-saffron-300 uppercase tracking-wider">लोकप्रिय सेवाएँ (Popular)</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { title: "आधार कार्ड सेवा", badge: "UIDAI", color: "from-blue-600/20 to-blue-900/20" },
                      { title: "पैन कार्ड सुधार", badge: "NSDL", color: "from-amber-600/20 to-amber-900/20" },
                      { title: "खसरा नकल बी-1", badge: "भूलेख", color: "from-emerald-600/20 to-emerald-900/20" },
                      { title: "समग्र ई-केवाईसी", badge: "Samagra", color: "from-purple-600/20 to-purple-900/20" },
                      { title: "वैकेंसी अपडेट", badge: "Recruit", color: "from-red-600/20 to-red-900/20" },
                      { title: "राशन पात्रता पर्ची", badge: "Food", color: "from-teal-600/20 to-teal-900/20" },
                    ].map((item, i) => (
                      <div key={i} className={`p-2 rounded-xl bg-gradient-to-br ${item.color} border border-white/10 space-y-1`}>
                        <div className="text-[8px] font-extrabold text-saffron-400 uppercase">{item.badge}</div>
                        <div className="text-[11px] font-bold text-white leading-tight">{item.title}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Live Status Simulation Card */}
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-navy-900 border border-emerald-500/30 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-white/70">आवेदन #PDS-2026-8941</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      सत्यापित (Done)
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-white">मूल निवासी प्रमाण पत्र रसीद जारी</div>
                </div>

                {/* Bottom App Navigation Bar Simulation */}
                <div className="pt-1 flex items-center justify-around border-t border-white/10 text-[9px] text-white/60">
                  <span className="text-saffron-400 font-bold">🏠 होम</span>
                  <span>📋 सेवाएँ</span>
                  <span>🎯 भर्ती</span>
                  <span>👤 खाता</span>
                </div>

              </div>

              {/* Home indicator bar */}
              <div className="w-24 h-1 bg-white/30 rounded-full mx-auto mt-2" />
            </div>

          </div>

        </div>

        {/* QR Code Modal Popup (Accessible if clicked) */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
            <div className="bg-[#0A1B4D] border border-saffron-500/40 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
              
              <div className="w-12 h-12 rounded-2xl bg-saffron-500/20 border border-saffron-500/40 mx-auto flex items-center justify-center text-saffron-400">
                <QrCode className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-white">
                {lang === "hi" ? "कैमरे से स्कैन कर डाउनलोड करें" : "Scan to Download Android App"}
              </h3>

              <div className="p-4 bg-white rounded-2xl inline-block shadow-inner mx-auto">
                {/* Embedded SVG QR representation pointing to pradhandigitalservices.in/apps */}
                <svg className="w-40 h-40" viewBox="0 0 100 100">
                  <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,10 h20 v10 h-20 z M40,40 h20 v20 h-20 z M10,40 h15 v15 h-15 z M75,40 h15 v15 h-15 z M70,70 h15 v15 h-15 z M45,75 h20 v20 h-20 z M85,85 h15 v15 h-15 z" fill="#0A1B4D" />
                </svg>
              </div>

              <p className="text-xs text-saffron-200/80 leading-relaxed">
                {lang === "hi" 
                  ? "अपने स्मार्टफोन के कैमरे से इस QR कोड को स्कैन करें और सीधे 'Pradhan eSeva' ऐप इंस्टॉल करें।"
                  : "Point your phone camera at this QR code to download the official Pradhan eSeva Android App."}
              </p>

              <div className="pt-2">
                <a
                  href="/apps/pradhan-eseva.apk"
                  download="pradhan-eseva.apk"
                  className="w-full py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-navy-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>सीधे APK डाउनलोड करें (12 MB)</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

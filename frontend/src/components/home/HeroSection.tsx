"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Phone, MessageCircle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { WHATSAPP_NUMBER, SUPPORT_NUMBER } from "@/lib/utils";

export default function HeroSection() {
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/services?q=${encodeURIComponent(query.trim())}`);
  };

  const popularSearches = lang === "hi" 
    ? ["आधार", "पैन कार्ड", "आयुष्मान", "पीएम किसान", "जीएसटी", "वोटर कार्ड"]
    : ["Aadhaar", "PAN Card", "Ayushman", "PM Kisan", "GST", "Voter ID"];

  const trustIndicators = lang === "hi"
    ? [
        { icon: CheckCircle, text: "आधिकारिक पोर्टल लिंक" },
        { icon: CheckCircle, text: "सुरक्षित दस्तावेज़ हैंडलिंग" },
        { icon: CheckCircle, text: "पारदर्शी सेवा शुल्क" },
        { icon: CheckCircle, text: "हिंदी/अंग्रेज़ी सहायता" },
      ]
    : [
        { icon: CheckCircle, text: "Official Portal Links" },
        { icon: CheckCircle, text: "Secure Document Handling" },
        { icon: CheckCircle, text: "Transparent Service Charges" },
        { icon: CheckCircle, text: "Hindi/English Assistance" },
      ];

  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-saffron-500/10 border border-saffron-500/30 rounded-full text-saffron-300 text-sm mb-8">
            🇮🇳 {lang === "hi" ? "भारत का विश्वसनीय डिजिटल सेवा पोर्टल" : "India's Trusted Digital Seva Portal"}
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {lang === "hi" ? "सभी डिजिटल सेवाएँ, एक ही स्थान पर" : "All Digital Services, One Place"}
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-saffron-300 font-medium mb-4">
            {lang === "hi" 
              ? "सरकारी फॉर्म, ऑनलाइन आवेदन, भर्ती अपडेट, बिल भुगतान, रिचार्ज और दस्तावेज़ सेवाएँ—अब आसान और भरोसेमंद तरीके से।"
              : "Government forms, online applications, recruitment updates, bill payments, recharge and document services — now easy and reliable."
            }
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === "hi" ? "आधार, पैन, आयुष्मान, पीएम किसान, जीएसटी खोजें..." : "Search Aadhaar, PAN, Ayushman, PM Kisan, GST..."}
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-white text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 shadow-lg"
              />
            </div>
            
            {/* Popular Searches */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-navy-300">{lang === "hi" ? "लोकप्रिय:" : "Popular:"}</span>
              {popularSearches.map((search) => (
                <button
                  key={search}
                  type="button"
                  onClick={() => setQuery(search)}
                  className="text-sm text-saffron-300 hover:text-saffron-200 transition"
                >
                  {search}
                </button>
              ))}
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link 
              href="/services" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-saffron-600 text-white font-semibold rounded-lg hover:bg-saffron-700 transition shadow-lg"
            >
              {lang === "hi" ? "सभी सेवाएँ देखें" : "View All Services"} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/track-application" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition"
            >
              {lang === "hi" ? "आवेदन ट्रैक करें" : "Track Application"}
            </Link>
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              {lang === "hi" ? "WhatsApp सहायता" : "WhatsApp Support"}
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            {trustIndicators.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 justify-center p-3 bg-white/5 rounded-lg border border-white/10">
                <Icon className="w-5 h-5 text-saffron-400 flex-shrink-0" />
                <span className="text-sm text-navy-200">{text}</span>
              </div>
            ))}
          </div>

          {/* Contact Support */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-navy-300">
            <a 
              href={`tel:${SUPPORT_NUMBER}`} 
              className="flex items-center gap-2 hover:text-saffron-300 transition"
            >
              <Phone className="w-4 h-4" />
              {SUPPORT_NUMBER}
            </a>
            <span>|</span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {lang === "hi" ? "सुरक्षित भुगतान" : "Secure Payment"}
            </span>
            <span>|</span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {lang === "hi" ? "24/7 सहायता" : "24/7 Support"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="h-1 bg-gradient-to-r from-saffron-600 via-white to-green-600" />
    </section>
  );
}

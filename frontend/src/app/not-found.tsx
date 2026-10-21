"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Search, Phone, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { whatsAppUrl, telSupportUrl, SUPPORT_NUMBER } from "@/lib/utils";

export default function NotFound() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-[80vh] bg-navy-50 dark:bg-navy-950 flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg mx-auto">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="text-8xl md:text-9xl font-black text-navy-200 dark:text-navy-800 animate-fade-in">4</span>
            <div className="relative w-20 h-20 md:w-24 md:h-24 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <Image
                src="/brand-icon.svg"
                alt="Pradhan Digital Services"
                fill
                className="object-contain rounded-2xl"
              />
            </div>
            <span className="text-8xl md:text-9xl font-black text-navy-200 dark:text-navy-800 animate-fade-in" style={{ animationDelay: "0.2s" }}>4</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white mb-3">
          {lang === "hi" ? "पेज नहीं मिला" : "Page Not Found"}
        </h1>
        <p className="text-navy-600 dark:text-navy-400 mb-8 leading-relaxed">
          {lang === "hi"
            ? "आप जो पेज खोज रहे हैं वह मौजूद नहीं है या स्थानांतरित कर दिया गया है। कृपया होमपेज पर वापस जाएँ या सहायता के लिए संपर्क करें।"
            : "The page you are looking for doesn't exist or has been moved. Please go back to the homepage or contact us for assistance."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 transition shadow-md"
          >
            <Home className="w-5 h-5" />
            {lang === "hi" ? "होमपेज पर जाएँ" : "Go to Homepage"}
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white font-semibold rounded-xl hover:bg-navy-200 dark:hover:bg-navy-700 transition"
          >
            <Search className="w-5 h-5" />
            {lang === "hi" ? "सेवाएँ खोजें" : "Browse Services"}
          </Link>
        </div>

        {/* Help Section */}
        <div className="p-4 bg-white dark:bg-navy-800 rounded-2xl border border-navy-200 dark:border-navy-700 shadow-sm">
          <p className="text-sm text-navy-600 dark:text-navy-400 mb-3">
            {lang === "hi" ? "सहायता चाहिए?" : "Need help?"}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={whatsAppUrl("Hi, I need help finding a page on your website.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <a
              href={telSupportUrl()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition text-sm font-medium"
            >
              <Phone className="w-4 h-4" />
              {SUPPORT_NUMBER}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

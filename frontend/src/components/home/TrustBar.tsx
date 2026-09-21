"use client";

import { Shield, Link, Zap, Languages, Receipt } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const trustItems = [
  { 
    icon: Shield, 
    text: "Secure Platform", 
    textHi: "सुरक्षित प्लेटफ़ॉर्म" 
  },
  { 
    icon: Link, 
    text: "Official Portal Links", 
    textHi: "आधिकारिक पोर्टल लिंक" 
  },
  { 
    icon: Zap, 
    text: "Fast Assistance", 
    textHi: "त्वरित सहायता" 
  },
  { 
    icon: Languages, 
    text: "Hindi & English", 
    textHi: "हिंदी और अंग्रेजी" 
  },
  { 
    icon: Receipt, 
    text: "Transparent Charges", 
    textHi: "पारदर्शी शुल्क" 
  },
];

export default function TrustBar() {
  const { lang } = useLanguage();

  return (
    <section className="py-6 bg-white dark:bg-navy-900 border-b border-navy-100 dark:border-navy-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {trustItems.map((item) => (
            <div key={item.text} className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-saffron-50 dark:bg-saffron-900/20 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-saffron-600 dark:text-saffron-400" />
              </div>
              <span className="text-sm font-medium text-navy-700 dark:text-navy-300">
                {lang === "hi" ? item.textHi : item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

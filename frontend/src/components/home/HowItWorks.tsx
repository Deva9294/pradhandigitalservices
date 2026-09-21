"use client";

import { Search, FileCheck, ExternalLink, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const steps = [
  {
    icon: Search,
    title: "Select Service",
    titleHi: "सेवा चुनें",
    description: "Browse and select the government service you need",
    descriptionHi: "आवश्यक सरकारी सेवा ब्राउज़ करें और चुनें"
  },
  {
    icon: FileCheck,
    title: "Check Requirements",
    titleHi: "आवश्यकताएं जांचें",
    description: "Review documents and eligibility criteria",
    descriptionHi: "दस्तावेज और पात्रता मानदंड समीक्षा करें"
  },
  {
    icon: ExternalLink,
    title: "Visit Official Portal",
    titleHi: "आधिकारिक पोर्टल पर जाएं",
    description: "Apply through verified government websites",
    descriptionHi: "सत्यापित सरकारी वेबसाइटों के माध्यम से आवेदन करें"
  },
  {
    icon: CheckCircle2,
    title: "Track & Complete",
    titleHi: "ट्रैक और पूरा करें",
    description: "Monitor application status and get assistance",
    descriptionHi: "आवेदन स्थिति की निगरानी करें और सहायता प्राप्त करें"
  },
];

export default function HowItWorks() {
  const { lang } = useLanguage();

  return (
    <section className="py-16 bg-navy-50 dark:bg-navy-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white text-center mb-12">
          {lang === "hi" ? "यह कैसे काम करता है" : "How It Works"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-saffron-500 flex items-center justify-center shadow-lg">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-navy-800 border-2 border-saffron-500 flex items-center justify-center text-sm font-bold text-saffron-600">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-bold text-navy-900 dark:text-white mb-2">
                  {lang === "hi" ? step.titleHi : step.title}
                </h3>
                <p className="text-sm text-navy-600 dark:text-navy-400 leading-relaxed">
                  {lang === "hi" ? step.descriptionHi : step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-saffron-300 to-transparent -translate-x-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

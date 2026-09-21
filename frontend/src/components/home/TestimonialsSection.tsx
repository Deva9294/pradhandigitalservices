"use client";

import { Layers, ShieldCheck, Headphones, Globe, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const features = [
  { 
    icon: Layers, 
    title: "Multiple Services", 
    titleHi: "बहुत सारी सेवाएं",
    description: "All government and digital services in one platform",
    descriptionHi: "सभी सरकारी और डिजिटल सेवाएं एक प्लेटफ़ॉर्म पर"
  },
  { 
    icon: ShieldCheck, 
    title: "Secure Assistance", 
    titleHi: "सुरक्षित सहायता",
    description: "Safe and secure application process",
    descriptionHi: "सुरक्षित और सुरक्षित आवेदन प्रक्रिया"
  },
  { 
    icon: Headphones, 
    title: "Easy Process", 
    titleHi: "आसान प्रक्रिया",
    description: "Simple steps designed for everyone",
    descriptionHi: "सभी के लिए सरल चरण"
  },
  { 
    icon: Globe, 
    title: "Hindi Support", 
    titleHi: "हिंदी सहायता",
    description: "Complete support in Hindi and English",
    descriptionHi: "हिंदी और अंग्रेजी में पूर्ण सहायता"
  },
];

export default function WhyChooseUsSection() {
  const { lang, t } = useLanguage();

  return (
    <section className="py-16 bg-white dark:bg-navy-950">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white text-center mb-8">
          {lang === "hi" ? "हमें क्यों चुनें?" : "Why Choose Pradhan Digital Services"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="p-6 glass-panel rounded-[28px] relative overflow-hidden hover:shadow-xl transition">
              <div className="w-14 h-14 rounded-2xl bg-saffron-500 flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-navy-900 dark:text-white mb-2">
                {lang === "hi" ? feature.titleHi : feature.title}
              </h3>
              <p className="text-sm text-navy-600 dark:text-navy-400 leading-relaxed">
                {lang === "hi" ? feature.descriptionHi : feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

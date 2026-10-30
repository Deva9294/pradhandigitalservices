"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  FileText, Search, Download, Briefcase, Ticket, 
  Smartphone, Zap, Upload, MessageCircle
} from "lucide-react";
import { whatsAppUrl } from "@/lib/utils";

interface QuickAction {
  icon: any;
  label: string;
  labelHi: string;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    icon: FileText,
    label: "Apply for Service",
    labelHi: "सेवा के लिए आवेदन करें",
    href: "/services",
    color: "bg-blue-500"
  },
  {
    icon: Search,
    label: "Track Application",
    labelHi: "आवेदन ट्रैक करें",
    href: "/track-application",
    color: "bg-green-500"
  },
  {
    icon: Download,
    label: "Download Form",
    labelHi: "फॉर्म डाउनलोड करें",
    href: "/offline-forms",
    color: "bg-purple-500"
  },
  {
    icon: Briefcase,
    label: "Vacancy Update",
    labelHi: "वैकेंसी अपडेट",
    href: "/vacancy-update",
    color: "bg-orange-500"
  },
  {
    icon: Ticket,
    label: "Admit Card",
    labelHi: "प्रवेश पत्र",
    href: "/admit-cards",
    color: "bg-pink-500"
  },
  {
    icon: Search,
    label: "Check Result",
    labelHi: "परिणाम जांचें",
    href: "/results",
    color: "bg-teal-500"
  },
  {
    icon: Smartphone,
    label: "Mobile Recharge",
    labelHi: "मोबाइल रिचार्ज",
    href: "/recharge",
    color: "bg-red-500"
  },
  {
    icon: Zap,
    label: "Electricity Bill",
    labelHi: "बिजली बिल",
    href: "/recharge?category=electricity",
    color: "bg-yellow-500"
  },
  {
    icon: Upload,
    label: "Upload Documents",
    labelHi: "दस्तावेज़ अपलोड करें",
    href: "/document-tools",
    color: "bg-indigo-500"
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Support",
    labelHi: "WhatsApp सहायता",
    href: whatsAppUrl(),
    color: "bg-green-600"
  },
];

export default function QuickActions() {
  const { lang } = useLanguage();

  return (
    <section className="section bg-white dark:bg-navy-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white mb-2">
            {lang === "hi" ? "त्वरित कार्य" : "Quick Actions"}
          </h2>
          <p className="text-navy-600 dark:text-navy-300">
            {lang === "hi" ? "सभी सेवाएं एक क्लिक में" : "All services at one click"}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const isExternal = action.href.startsWith('http');
            
            return (
              <Link
                key={action.href}
                href={action.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group flex flex-col items-center p-5 sm:p-6 bg-white dark:bg-navy-800 rounded-3xl border border-slate-100 dark:border-navy-700 shadow-sm hover:border-orange-300 hover:shadow-xl transition-all duration-200"
              >
                <div className={`w-14 h-14 ${action.color} rounded-2xl shadow-sm flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-navy-900 dark:text-white text-center group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                  {lang === "hi" ? action.labelHi : action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
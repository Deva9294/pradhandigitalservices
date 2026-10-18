"use client";

import { FileImage, FileText, Scissors, Minimize2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { telSupportUrl, whatsAppUrl } from "@/lib/utils";

const tools = [
  { icon: FileImage, name: "JPG to PDF", nameHi: "JPG से PDF" },
  { icon: FileText, name: "PDF Merge / Split", nameHi: "PDF मर्ज / स्प्लिट" },
  { icon: Minimize2, name: "Compress PDF / Image", nameHi: "PDF / इमेज कंप्रेस" },
  { icon: Scissors, name: "Photo & Signature Crop", nameHi: "फोटो और हस्ताक्षर क्रॉप" },
];

export default function DocumentToolsPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 overflow-x-hidden">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
          {lang === "hi" ? "दस्तावेज़ उपकरण" : "Document Tools"}
        </h1>
        <p className="text-navy-600 dark:text-navy-400 mb-8 max-w-2xl">
          {lang === "hi"
            ? "पासपोर्ट फोटो, हस्ताक्षर और PDF सहायता के लिए हमारी टीम से संपर्क करें।"
            : "Get assisted document preparation for passport photos, signatures, and PDF files."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tools.map((tool) => (
            <div key={tool.name} className="p-5 rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700">
              <tool.icon className="w-8 h-8 text-saffron-600 mb-3" />
              <h2 className="font-semibold text-navy-900 dark:text-white">
                {lang === "hi" ? tool.nameHi : tool.name}
              </h2>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <a
            href={whatsAppUrl("Hi, I need help with document tools at Pradhan Digital Services.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-3 bg-green-600 text-white font-semibold rounded-xl"
          >
            {lang === "hi" ? "WhatsApp पूछताछ" : "Direct WhatsApp Inquiry"}
          </a>
          <a href={telSupportUrl()} className="flex-1 text-center py-3 bg-saffron-600 text-white font-semibold rounded-xl">
            {lang === "hi" ? "अभी कॉल करें" : "Call Now"}
          </a>
        </div>
      </div>
    </div>
  );
}

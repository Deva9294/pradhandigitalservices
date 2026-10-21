"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  PdfDownloadIllustration, 
  HomeDeliveryIllustration 
} from "@/components/ui/VectorIllustrations";
import { ArrowRight, CheckCircle2, ShieldCheck, Download, Truck, MapPin } from "lucide-react";

export default function DeliverySection() {
  const { lang } = useLanguage();

  return (
    <section className="py-16 bg-[#0A1B4D] text-white border-t border-white/5 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/15 border border-saffron-500/30 text-saffron-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === "hi" ? "दोहरी डिलीवरी सुविधा" : "Dual Delivery Mechanism"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {lang === "hi" ? "डिजिटल डाउनलोड या घर बैठे स्पीड पोस्ट" : "Instant Digital PDF & Doorstep Physical Delivery"}
          </h2>
          <p className="text-saffron-200/80 text-xs md:text-sm mt-2">
            {lang === "hi"
              ? "आपके काम के दस्तावेज़ आपके व्यक्तिगत डैशबोर्ड लॉकर में तुरंत उपलब्ध होते हैं, तथा आवश्यकता होने पर लैमिनेटेड स्पीड पोस्ट द्वारा घर भेजे जाते हैं।"
              : "Access verified digital copies instantly in your account locker, or choose high-grade laminated Speed Post delivery to your home."}
          </p>
        </div>

        {/* 2 Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Option 1: Instant Digital PDF Locker */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#071333]/70 hover:border-saffron-400/40 transition flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
                  {lang === "hi" ? "तुरंत उपलब्ध • 100% निःशुल्क" : "Instant • 100% Free"}
                </span>
                <Download className="w-5 h-5 text-saffron-400" />
              </div>

              <div className="flex justify-center py-2">
                <PdfDownloadIllustration size={80} className="w-20 h-20 drop-shadow-md" />
              </div>

              <h3 className="text-xl font-bold text-white text-center">
                {lang === "hi" ? "डिजिटल अकाउंट डाउनलोड" : "Account Locker PDF Download"}
              </h3>

              <p className="text-xs text-saffron-200/80 leading-relaxed text-center">
                {lang === "hi"
                  ? "सभी संसाधित आवेदन, चालान, पावती रसीदें और मूल प्रमाण पत्र आपके व्यक्तिगत कस्टमर डैशबोर्ड में आजीवन सुरक्षित रहते हैं।"
                  : "All completed service receipts, official PDFs, and acknowledgements are stored securely in your dashboard for unlimited instant downloads."}
              </p>

              <div className="space-y-2 pt-2 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === "hi" ? "24/7 कभी भी कहीं से भी डाउनलोड करें" : "24/7 instant download anywhere"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === "hi" ? "मूल डिजिटल हस्ताक्षर एवं QR कोड युक्त" : "With digital signature & verified QR code"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === "hi" ? "वॉटरमार्क-मुक्त स्पष्ट प्रिंट योग्य PDF" : "High-resolution printable PDF format"}</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs text-center transition flex items-center justify-center gap-2"
            >
              <span>{lang === "hi" ? "डैशबोर्ड लॉकर देखें" : "View Account Locker"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Option 2: Doorstep Laminated Speed Post Delivery */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-saffron-500/30 bg-[#0D1F57]/60 hover:border-saffron-400 transition flex flex-col justify-between space-y-6 relative overflow-hidden">
            {/* Top Tag */}
            <div className="absolute top-0 right-0 bg-saffron-500 text-navy-950 font-extrabold text-[10px] uppercase px-4 py-1 rounded-bl-xl tracking-wider">
              Popular Service
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 text-xs font-bold">
                  {lang === "hi" ? "वैकल्पिक भौतिक डिलीवरी" : "Optional Physical Dispatch"}
                </span>
                <Truck className="w-5 h-5 text-saffron-400" />
              </div>

              <div className="flex justify-center py-2">
                <HomeDeliveryIllustration size={80} className="w-20 h-20 drop-shadow-md" />
              </div>

              <h3 className="text-xl font-bold text-white text-center">
                {lang === "hi" ? "घर बैठे स्पीड पोस्ट डिलीवरी" : "Doorstep Laminated Delivery"}
              </h3>

              <p className="text-xs text-saffron-200/80 leading-relaxed text-center">
                {lang === "hi"
                  ? "यदि आपको पीवीसी कार्ड, रंगीन लैमिनेटेड प्रमाण पत्र या मुद्रित फॉर्म चाहिए, तो हमारी टीम इंडिया पोस्ट स्पीड पोस्ट द्वारा सीधे आपके पते पर भेजती है।"
                  : "Request PVC cards, high-quality laminated certificates, or stamped physical forms dispatched directly to your address via India Post Speed Post."}
              </p>

              <div className="space-y-2 pt-2 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === "hi" ? "वाटरप्रूफ हेवी-ड्यूटी लैमिनेशन / PVC कार्ड" : "Waterproof heavy lamination / PVC Card"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === "hi" ? "स्पीड पोस्ट ट्रैकिंग नंबर (India Post Tracking)" : "Official India Post Tracking Consignment Number"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === "hi" ? "संपूर्ण मध्य प्रदेश एवं भारत में सुरक्षित डिलीवरी" : "Pan-MP & Pan-India secure delivery"}</span>
                </div>
              </div>
            </div>

            <Link
              href="/delivery"
              className="w-full py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-navy-950 font-extrabold text-xs text-center transition flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{lang === "hi" ? "डिलीवरी विवरण व ट्रैकिंग" : "Delivery Details & Tracking"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

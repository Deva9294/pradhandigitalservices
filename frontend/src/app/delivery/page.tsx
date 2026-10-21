"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Truck, Search, ShieldCheck, CheckCircle2, 
  MapPin, Clock, ExternalLink, Download, FileText 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  HomeDeliveryIllustration, 
  PdfDownloadIllustration 
} from "@/components/ui/VectorIllustrations";
import { whatsAppUrl } from "@/lib/utils";

export default function DeliveryPage() {
  const { lang } = useLanguage();
  const [consignmentNumber, setConsignmentNumber] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (consignmentNumber.trim()) {
      window.open(
        `https://www.indiapost.gov.in/_layouts/15/dptcpis.geonoo/tracking.aspx?articlenumber=${encodeURIComponent(consignmentNumber.trim())}`,
        "_blank"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] dark:bg-navy-950 text-navy-900 dark:text-white">
      {/* Header */}
      <div className="bg-[#0A1B4D] text-white py-12 border-b border-white/10">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-300 text-xs font-semibold mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>PDS Doorstep Speed Post Delivery</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {lang === "hi" ? "दस्तावेज़ होम डिलीवरी सेवा" : "Doorstep Document Delivery"}
          </h1>
          <p className="text-xs md:text-sm text-saffron-200/80 mt-2">
            {lang === "hi"
              ? "पीवीसी कार्ड, रंगीन लैमिनेटेड प्रमाण पत्र और आधिकारिक रसीदें — सीधे आपके घर के पते पर स्पीड पोस्ट द्वारा प्रेषित।"
              : "Laminated certificates, PVC smart cards, and stamped receipts delivered to your address via India Post Speed Post."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl space-y-10">
        
        {/* Speed Post Tracking Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-white/10 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-saffron-500" />
            <h2 className="text-lg font-bold text-navy-900 dark:text-white">
              {lang === "hi" ? "स्पीड पोस्ट कंसाइनमेंट ट्रैक करें" : "Track Speed Post Consignment"}
            </h2>
          </div>
          <p className="text-xs text-navy-600 dark:text-white/70">
            Enter your India Post 13-digit tracking number (e.g., EM894120392IN) provided in your SMS or Dashboard receipt.
          </p>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2 pt-1">
            <input
              type="text"
              required
              value={consignmentNumber}
              onChange={(e) => setConsignmentNumber(e.target.value.toUpperCase())}
              placeholder="e.g. EM123456789IN"
              className="flex-1 px-4 py-3 rounded-xl border border-navy-200 dark:border-white/10 bg-navy-50 dark:bg-navy-950 font-mono text-xs uppercase focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-navy-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow"
            >
              <span>Track Consignment</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* 2 Methods Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-saffron-500">
              <Download className="w-5 h-5" />
              <h3 className="font-bold text-base text-navy-900 dark:text-white">Digital Vault (Instant)</h3>
            </div>
            <p className="text-xs text-navy-600 dark:text-white/70 leading-relaxed">
              Every processed document is instantly made available in your Customer Dashboard for download in high-definition PDF format at zero additional cost.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-blue-500">
              <Truck className="w-5 h-5" />
              <h3 className="font-bold text-base text-navy-900 dark:text-white">Physical Speed Post</h3>
            </div>
            <p className="text-xs text-navy-600 dark:text-white/70 leading-relaxed">
              Dispatched within 24–48 hours of official approval via India Post Speed Post with tamper-evident waterproof packaging and online live tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

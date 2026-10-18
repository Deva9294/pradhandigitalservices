"use client";

import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { telSupportUrl, whatsAppUrl } from "@/lib/utils";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3">
      <div
        className={`hidden md:block transition-all duration-300 ${
          showTooltip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-navy-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
          WhatsApp or Call Now
        </div>
      </div>

      <a
        href={telSupportUrl()}
        className="w-12 h-12 md:w-14 md:h-14 bg-saffron-600 hover:bg-saffron-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300"
        aria-label="Call Now"
      >
        <Phone className="w-6 h-6" />
      </a>

      <a
        href={whatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 md:w-16 md:h-16 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300"
        aria-label="Direct WhatsApp Inquiry"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
      </a>
    </div>
  );
}

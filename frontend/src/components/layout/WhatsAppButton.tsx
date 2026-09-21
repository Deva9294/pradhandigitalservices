"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Desktop Tooltip */}
      <div 
        className={`hidden md:block transition-all duration-300 ${
          showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="bg-navy-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap mb-2">
          Need Help? Chat on WhatsApp
        </div>
      </div>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${siteConfig.whatsapp}?text=Hi, I need help with Pradhan Digital Services`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 md:w-16 md:h-16 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300"
        aria-label="WhatsApp Support"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
      </a>
    </div>
  );
}

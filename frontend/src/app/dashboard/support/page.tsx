"use client";

import Link from "next/link";
import { telSupportUrl, whatsAppUrl } from "@/lib/utils";

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-4">Support</h1>
      <div className="space-y-3">
        <a href={whatsAppUrl()} className="block text-center py-3 bg-green-600 text-white rounded-xl font-semibold">
          Direct WhatsApp Inquiry
        </a>
        <a href={telSupportUrl()} className="block text-center py-3 bg-saffron-600 text-white rounded-xl font-semibold">
          Call Now
        </a>
        <Link href="/contact" className="block text-center py-3 bg-navy-200 dark:bg-navy-800 rounded-xl font-semibold">
          Contact Form
        </Link>
      </div>
    </div>
  );
}

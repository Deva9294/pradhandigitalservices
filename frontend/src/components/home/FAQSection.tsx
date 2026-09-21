"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is Pradhan Digital Services a government website?",
    qHi: "क्या प्रधान डिजिटल सेवाएं एक सरकारी वेबसाइट है?",
    a: "No. We are a private facilitation platform that helps citizens access government services through official portals. We are NOT affiliated with any government department.",
    aHi: "नहीं। हम एक निजी सुविधा मंच हैं जो नागरिकों को आधिकारिक पोर्टल के माध्यम से सरकारी सेवाओं तक पहुंचने में मदद करते हैं।",
  },
  {
    q: "How do I download offline forms?",
    qHi: "ऑफलाइन फॉर्म कैसे डाउनलोड करें?",
    a: "Visit the Offline Forms page, select your form, pay ₹5 via UPI or Razorpay, and get a secure download link instantly in your account.",
    aHi: "ऑफलाइन फॉर्म पेज पर जाएं, फॉर्म चुनें, UPI या Razorpay से ₹5 भुगतान करें, और अपने खाते में तुरंत सुरक्षित डाउनलोड लिंक प्राप्त करें।",
  },
  {
    q: "How does OTP login work?",
    qHi: "OTP लॉगिन कैसे काम करता है?",
    a: "Enter your mobile number, receive an OTP via SMS, verify it, and you're logged in. No password needed.",
    aHi: "अपना मोबाइल नंबर दर्ज करें, SMS के माध्यम से OTP प्राप्त करें, सत्यापित करें, और आप लॉग इन हो जाएंगे।",
  },
  {
    q: "What payment methods are accepted?",
    qHi: "कौन से भुगतान तरीके स्वीकार किए जाते हैं?",
    a: "We accept UPI, Credit/Debit Cards, Net Banking, and Wallet balance through Razorpay payment gateway.",
    aHi: "हम UPI, क्रेडिट/डेबिट कार्ड, नेट बैंकिंग और Razorpay के माध्यम से वॉलेट बैलेंस स्वीकार करते हैं।",
  },
  {
    q: "How can I add money to my wallet?",
    qHi: "वॉलेट में पैसे कैसे जोड़ें?",
    a: "Go to Dashboard → Wallet → Add Money. Pay via UPI/Razorpay and the amount will be credited instantly with possible cashback.",
    aHi: "डैशबोर्ड → वॉलेट → पैसे जोड़ें पर जाएं। UPI/Razorpay से भुगतान करें और राशि तुरंत जमा हो जाएगी।",
  },
];

export default function FAQSection() {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 bg-navy-50 dark:bg-navy-900">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white text-center mb-8">
          {t.sections.faq}
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-navy-800 rounded-xl border border-navy-100 dark:border-navy-700 overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-navy-900 dark:text-white hover:bg-navy-50 dark:hover:bg-navy-700 transition">
                {lang === "hi" ? faq.qHi : faq.q}
                <ChevronDown className={cn("w-5 h-5 shrink-0 transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-navy-600 dark:text-navy-300 leading-relaxed">
                  {lang === "hi" ? faq.aHi : faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

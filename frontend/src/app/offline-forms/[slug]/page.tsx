"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FileDown, Shield, CreditCard, Wallet, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { offlineForms } from "@/data/offlineForms";
import { DISCLAIMER } from "@/lib/utils";
import RazorpayPayButton from "@/components/payment/RazorpayPayButton";

export default function FormDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { lang, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [purchased, setPurchased] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const form = offlineForms.find((f) => f.slug === slug);

  if (!form) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Form not found</h1>
        <Link href="/offline-forms" className="text-saffron-600 mt-4 inline-block">← Back to Forms</Link>
      </div>
    );
  }

  const handlePayment = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/offline-forms/${form.slug}`;
    }
  };

  if (purchased) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Payment Verified</h1>
        <p className="text-navy-600 dark:text-navy-300 mb-3">आपका Razorpay भुगतान सत्यापित हो गया है।</p>
        <p className="text-xs text-navy-500 mb-6">Payment ID: {paymentId}. इस फॉर्म का वास्तविक PDF download file अभी catalogue में configured नहीं है। कृपया सहायता टीम से संपर्क करें; दोबारा भुगतान न करें।</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-saffron-600 text-white font-semibold rounded-xl">Dashboard खोलें</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Link href="/offline-forms" className="text-sm text-saffron-600 hover:underline mb-6 inline-block">← Back to Forms</Link>

      <div className="p-8 bg-white dark:bg-navy-800 rounded-2xl border border-navy-100 dark:border-navy-700 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center">
            <FileDown className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900 dark:text-white">{lang === "hi" ? form.nameHi : form.name}</h1>
            <span className="text-navy-500 text-sm">{form.category}</span>
          </div>
        </div>

        <p className="text-navy-600 dark:text-navy-300 mb-6">{lang === "hi" ? form.descriptionHi : form.description}</p>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl mb-6 flex gap-2">
          <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">{DISCLAIMER}</p>
        </div>

        <div className="text-center p-6 bg-navy-50 dark:bg-navy-900 rounded-xl mb-6">
          <div className="text-4xl font-bold text-saffron-600">₹{form.price}</div>
          <div className="text-sm text-navy-500">One-time download fee</div>
        </div>

        <div className="space-y-3 mb-6">
          <p className="font-semibold text-sm">Secure payment</p>
          <p className="text-xs text-navy-500">UPI, Debit/Credit Card and Netbanking through Razorpay.</p>
        </div>

        <RazorpayPayButton
          amount={form.price}
          purpose={`Offline form download: ${form.name}`}
          type="form_download"
          metadata={{ formId: form.id, formSlug: form.slug }}
          className="w-full py-4 bg-saffron-600 text-white font-bold rounded-xl hover:bg-saffron-500 hover:shadow-lg transition inline-flex items-center justify-center gap-2"
          label={`${t.common.payAndDownload} — ₹${form.price}`}
          onSuccess={(payment) => { setPaymentId(payment?.paymentId || "Verified"); setPurchased(true); }}
        />

        {!isAuthenticated && (
          <p className="text-center text-sm text-navy-500 mt-4">
            <Link href={`/login?redirect=/offline-forms/${form.slug}`} className="text-saffron-600 hover:underline">Login</Link> required to download
          </p>
        )}
      </div>
    </div>
  );
}

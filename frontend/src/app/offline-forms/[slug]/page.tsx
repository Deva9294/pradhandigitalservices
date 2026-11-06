"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FileDown, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { offlineForms } from "@/data/offlineForms";
import { DISCLAIMER } from "@/lib/utils";

export default function FormDetailPage() {
  const params = useParams();
  const slug = String(params.slug || "");
  const { lang } = useLanguage();
  const form = offlineForms.find((item) => item.slug === slug);

  if (!form) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Form not found</h1>
        <Link href="/offline-forms" className="mt-4 inline-block text-orange-600">← Back to Forms</Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-2xl px-4 py-10">
      <Link href="/offline-forms" className="mb-6 inline-block text-sm text-orange-600 hover:underline">← Back to Forms</Link>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <FileDown className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{lang === "hi" ? form.nameHi : form.name}</h1>
            <p className="text-sm text-slate-500">{form.category}</p>
          </div>
        </div>
        <p className="mb-5 text-slate-600 dark:text-slate-300">{lang === "hi" ? form.descriptionHi : form.description}</p>
        <div className="mb-5 rounded-xl bg-amber-50 p-4 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          <ShieldAlert className="mr-2 inline h-4 w-4" />{DISCLAIMER}
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
          <h2 className="font-bold text-amber-900 dark:text-amber-200">अभी ऑनलाइन डाउनलोड उपलब्ध नहीं है</h2>
          <p className="mt-2 text-sm text-amber-800 dark:text-amber-100">
            इस फॉर्म की verified PDF file और automatic fulfilment अभी catalogue में configured नहीं है।
            इसलिए अभी इस पेज पर payment स्वीकार नहीं किया जाएगा। कृपया सहायता टीम से संपर्क करें।
          </p>
          <Link href="/contact" className="mt-4 inline-flex rounded-xl bg-[#0A1B4D] px-5 py-3 text-sm font-bold text-white">
            सहायता टीम से संपर्क करें
          </Link>
        </div>
      </section>
    </main>
  );
}

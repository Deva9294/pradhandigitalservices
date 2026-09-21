"use client";

import Link from "next/link";
import { FileDown, IndianRupee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { offlineForms } from "@/data/offlineForms";

export default function FormsSection() {
  const { lang, t } = useLanguage();

  return (
    <section className="py-16 bg-saffron-50 dark:bg-navy-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white">{t.sections.downloadForms}</h2>
          <p className="text-navy-600 dark:text-navy-400 mt-2 text-sm">
            {lang === "hi" ? "₹5 में सरकारी फॉर्म डाउनलोड करें" : "Download government forms for just ₹5"}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offlineForms.slice(0, 6).map((form) => (
            <div key={form.id} className="p-5 bg-white dark:bg-navy-800 rounded-2xl border border-navy-100 dark:border-navy-700 flex items-center justify-between gap-4 hover:shadow-lg transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <FileDown className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-navy-900 dark:text-white">
                    {lang === "hi" ? form.nameHi : form.name}
                  </h3>
                  <span className="text-xs text-navy-500">{form.category}</span>
                </div>
              </div>
              <Link href={`/offline-forms/${form.slug}`}
                className="shrink-0 flex items-center gap-1 px-3 py-2 bg-saffron-600 text-white text-xs font-semibold rounded-lg hover:bg-saffron-500 hover:shadow-md transition">
                <IndianRupee className="w-3 h-3" />5
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/offline-forms" className="inline-flex px-6 py-3 bg-navy-800 text-white font-semibold rounded-xl hover:bg-navy-700 transition">
            {t.common.viewAll} →
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { whatsAppUrl } from "@/lib/utils";

type ResourceItem = {
  _id?: string;
  slug?: string;
  name?: string;
  title?: string;
  nameHi?: string;
  description?: string;
  officialUrl?: string;
  applyUrl?: string;
  downloadUrl?: string;
};

export default function ResourceListPage({
  title,
  titleHi,
  endpoint,
  emptyHint,
}: {
  title: string;
  titleHi: string;
  endpoint: string;
  emptyHint?: string;
}) {
  const { lang } = useLanguage();
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data } = await api.get(endpoint);
        if (!cancelled) setItems(data?.data ?? []);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 overflow-x-hidden">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
          {lang === "hi" ? titleHi : title}
        </h1>
        <p className="text-navy-600 dark:text-navy-400 mb-8">
          {emptyHint ||
            (lang === "hi"
              ? "आधिकारिक जानकारी के लिए सहायता से संपर्क करें।"
              : "Contact support for official assistance and latest updates.")}
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-saffron-600" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-navy-800 p-8 text-center">
            <p className="text-navy-600 dark:text-navy-300 mb-4">
              {lang === "hi"
                ? "अभी कोई रिकॉर्ड उपलब्ध नहीं है। WhatsApp पर पूछताछ करें।"
                : "No records are available yet. Send a WhatsApp inquiry for help."}
            </p>
            <a
              href={whatsAppUrl(`Hi, I need help with ${title} (Rehti, Sehore, MP).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl"
            >
              {lang === "hi" ? "WhatsApp पूछताछ" : "Direct WhatsApp Inquiry"}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => {
              const heading = lang === "hi" ? item.nameHi || item.name || item.title : item.name || item.title;
              const link = item.officialUrl || item.applyUrl || item.downloadUrl;
              return (
                <article
                  key={item._id || item.slug || heading}
                  className="p-5 rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700"
                >
                  <h2 className="font-semibold text-navy-900 dark:text-white mb-2">{heading}</h2>
                  {item.description && (
                    <p className="text-sm text-navy-600 dark:text-navy-300 mb-3">{item.description}</p>
                  )}
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium"
                    >
                      Official Link <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

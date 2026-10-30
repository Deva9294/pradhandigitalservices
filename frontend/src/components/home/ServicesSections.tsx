"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Landmark, Building2, Shield, Smartphone, GraduationCap, BriefcaseBusiness, FileBadge, IdCard, WalletCards, Zap, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { popularServices, serviceCategories } from "@/config/services";
import ServiceIcon from "@/components/common/ServiceIcon";
import { ServiceCardSkeleton } from "@/components/common/Skeleton";

const categoryIconMap: Record<string, React.ElementType> = {
  identity: IdCard,
  certificates: FileBadge,
  schemes: Shield,
  business: Building2,
  recharge: Smartphone,
  education: GraduationCap,
  employment: BriefcaseBusiness,
  banking: WalletCards,
  bills: Zap,
};

export function PopularServicesSection() {
  const { lang, t } = useLanguage();

  return (
    <section className="py-16 bg-white dark:bg-navy-950">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white">
            {t.sections.popularServices}
          </h2>
          <Link href="/services" className="text-saffron-600 hover:text-saffron-500 flex items-center gap-1 text-sm font-medium">
            {t.common.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Suspense fallback={
            Array.from({ length: 12 }).map((_, i) => <ServiceCardSkeleton key={i} />)
          }>
            {popularServices.slice(0, 12).map((service) => (
              <div key={service.id} className="group p-5 bg-white dark:bg-navy-800 rounded-3xl border border-slate-100 dark:border-navy-700 hover:border-orange-300 hover:shadow-xl transition-all hover:-translate-y-1 text-center flex flex-col justify-between">
                <Link href={`/services/${service.slug}`} className="block">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white dark:bg-navy-900/90 border border-navy-100 dark:border-navy-700/60 shadow-sm flex items-center justify-center p-1.5 group-hover:scale-110 group-hover:border-saffron-400 group-hover:shadow-md transition">
                    <ServiceIcon
                      type={service.icon}
                      src={service.iconSrc}
                      slug={service.slug}
                      name={service.name}
                      fallback={service.iconFallback}
                      alt={service.name}
                      size={42}
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-navy-900 dark:text-white leading-tight mb-2 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition">
                    {lang === "hi" ? service.nameHi : service.name}
                  </h3>
                </Link>
                {service.officialUrl && (
                  <a 
                    href={service.officialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 text-[11px] text-saffron-600 hover:text-saffron-500 font-semibold mt-1 py-1 px-2 rounded-lg bg-saffron-50 dark:bg-saffron-950/40 hover:bg-saffron-100 transition"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {lang === "hi" ? "आधिकारिक पोर्टल" : "Official Portal"}
                  </a>
                )}
              </div>
            ))}
          </Suspense>
        </div>
      </div>
    </section>
  );
}

export function AllServicesSection() {
  const { lang, t } = useLanguage();

  return (
    <section className="py-16 bg-navy-50 dark:bg-navy-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white mb-8 text-center">
          {t.sections.allServices}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCategories.map((cat) => {
            const Icon = categoryIconMap[cat.id] || Landmark;
            return (
              <Link key={cat.id} href={`/services?category=${cat.slug}`}
                className="group p-7 bg-white dark:bg-navy-800 rounded-3xl border border-slate-100 dark:border-navy-700 hover:border-orange-300 hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-2xl bg-saffron-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-navy-900 dark:text-white mb-1">
                  {lang === "hi" ? cat.nameHi : cat.name}
                </h3>
                <p className="text-sm text-navy-500 dark:text-navy-400 mb-3">
                  {lang === "hi" ? "सभी सेवाएं उपलब्ध" : "All services available"}
                </p>
                <span className="text-xs text-saffron-600 font-medium flex items-center gap-1">
                  View Services <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

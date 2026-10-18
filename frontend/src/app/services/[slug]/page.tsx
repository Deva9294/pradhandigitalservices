import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ArrowLeft, Shield, Clock, FileText, CheckCircle } from "lucide-react";
import { allServices } from "@/data/services";
import { siteConfig } from "@/config/site";
import ServiceIcon from "@/components/common/ServiceIcon";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = allServices.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.name} - Apply Online`,
    description: service.description,
    openGraph: { title: `${service.name} | ${siteConfig.name}`, description: service.description },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = allServices.find((s) => s.slug === slug);
  if (!service) notFound();

  const related = allServices.filter((s) => s.category === service.category && s.id !== service.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="container mx-auto px-4 py-10">
        <Link href="/services" className="inline-flex items-center gap-1 text-sm text-saffron-600 mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <div className="p-6 glass-panel rounded-[32px] border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-saffron-500/15 flex items-center justify-center shrink-0">
                  <ServiceIcon
                    type={service.icon}
                    src={service.iconSrc}
                    fallback={service.iconFallback}
                    alt={service.name}
                    size={32}
                  />
                </div>
                <div>
                  <span className="text-sm text-saffron-600 font-medium">{service.categoryName}</span>
                  <h1 className="text-3xl font-bold text-navy-900 dark:text-white mt-1">{service.name}</h1>
                </div>
              </div>
              <p className="text-navy-600 dark:text-navy-300 leading-relaxed">{service.description}</p>
            </div>

            {/* Service Details */}
            <div className="p-6 glass-panel rounded-[32px] border border-white/10">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">Service Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-saffron-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-navy-500 dark:text-navy-400">Category</div>
                    <div className="font-medium text-navy-900 dark:text-white">{service.categoryName}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-saffron-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-navy-500 dark:text-navy-400">Processing Time</div>
                    <div className="font-medium text-navy-900 dark:text-white">7-30 Days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Required Documents */}
            <div className="p-6 glass-panel rounded-[32px] border border-white/10">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">Required Documents</h2>
              <ul className="space-y-2">
                {["Aadhaar Card", "PAN Card", "Passport Size Photo", "Address Proof", "Mobile Number"].map((doc) => (
                  <li key={doc} className="flex items-center gap-2 text-sm text-navy-700 dark:text-navy-300">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex gap-3">
              <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">{siteConfig.disclaimer.en}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link href="/login" className="px-6 py-3 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 transition">
                Apply Now via {siteConfig.name}
              </Link>
              {service.officialUrl && (
                <a href={service.officialUrl} target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 border border-navy-300 dark:border-navy-600 font-semibold rounded-xl flex items-center gap-2 hover:bg-navy-50 dark:hover:bg-navy-800 transition">
                  Official Portal <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 glass-panel rounded-[32px] border border-white/10">
              <h2 className="font-bold text-navy-900 dark:text-white mb-4">Related Services</h2>
              <div className="space-y-3">
                {related.map((s) => (
                  <Link key={s.id} href={`/services/${s.slug}`}
                    className="block p-4 bg-navy-50 dark:bg-navy-900 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-800 transition group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-saffron-500/15 flex items-center justify-center shrink-0">
                        <ServiceIcon
                          type={s.icon}
                          src={s.iconSrc}
                          fallback={s.iconFallback}
                          alt={s.name}
                          size={20}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-navy-900 dark:text-white truncate">{s.name}</div>
                        <div className="text-xs text-navy-500 truncate">{s.description}</div>
                      </div>
                    </div>
                  </Link>
                ))}
                {related.length === 0 && (
                  <p className="text-sm text-navy-500 dark:text-navy-400">No related services found.</p>
                )}
              </div>
            </div>

            <div className="p-6 glass-panel rounded-[32px] border border-white/10">
              <h2 className="font-bold text-navy-900 dark:text-white mb-4">Need Help?</h2>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-400 transition text-center"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

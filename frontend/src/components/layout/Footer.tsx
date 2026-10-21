"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { siteConfig } from "@/config/site";
import BrandLogo from "@/components/ui/BrandLogo";

export default function Footer() {
  const { lang, t } = useLanguage();

  const socialLinks = [
    { href: siteConfig.social.facebook, label: "Facebook" },
    { href: siteConfig.social.instagram, label: "Instagram" },
    { href: siteConfig.social.youtube, label: "YouTube" },
    { href: siteConfig.social.twitter, label: "Twitter" },
  ].filter(link => link.href); // Only show configured social links

  return (
    <footer className="bg-gradient-to-b from-navy-900 to-navy-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <BrandLogo size="lg" tagline="Digital Solutions | Real Results | Better Tomorrow" />
            </Link>
            <p className="text-xs text-navy-400 leading-relaxed">
              {siteConfig.description}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-4">
                {socialLinks.map((social) => (
                  <a 
                    key={social.label} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg bg-navy-800 flex items-center hover:bg-saffron-500 transition text-sm font-medium"
                    aria-label={social.label}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-saffron-400 mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2 text-sm text-navy-300">
              {[
                ["/", "Home"],
                ["/services", t.nav.services],
                ["/vacancies", t.nav.vacancies],
                ["/offline-forms", t.nav.forms],
                ["/recharge", t.nav.recharge],
                ["/news", t.nav.news],
                ["/contact", t.nav.contact],
              ].map(([href, label]) => (
                <li key={href as string}>
                  <Link href={href as string} className="hover:text-saffron-400 transition">{label as string}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-saffron-400 mb-4">{t.footer.services}</h3>
            <ul className="space-y-2 text-sm text-navy-300">
              {["Aadhaar Card", "PAN Card", "GST Registration", "PM Kisan", "Job Updates", "Bill Payment"].map((s) => (
                <li key={s}><Link href="/services" className="hover:text-saffron-400 transition">{s}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-saffron-400 mb-4">{t.footer.support}</h3>
            <ul className="space-y-3 text-sm text-navy-300">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-saffron-400" />
                <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-saffron-400" />
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-saffron-400 mt-0.5 shrink-0" />
                <span>{siteConfig.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 p-4 bg-navy-800/50 rounded-xl border border-navy-700">
          <p className="text-xs text-navy-400 leading-relaxed">
            <strong className="text-saffron-400">{t.footer.disclaimer}: </strong>
            {lang === "hi" ? siteConfig.disclaimer.hi : siteConfig.disclaimer.en}
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-navy-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-navy-400">
          <p>© {siteConfig.currentYear} {siteConfig.name}. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-saffron-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-saffron-400">Terms of Service</Link>
            <Link href="/refund" className="hover:text-saffron-400">Refund Policy</Link>
            <Link href="/disclaimer" className="hover:text-saffron-400">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

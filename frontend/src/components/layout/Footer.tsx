"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck, HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { siteConfig } from "@/config/site";
import BrandLogo from "@/components/ui/BrandLogo";
import { telSupportUrl, whatsAppUrl } from "@/lib/utils";

interface FooterProps {
  compact?: boolean;
}

export default function Footer({ compact = false }: FooterProps) {
  const { lang, t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: siteConfig.social.facebook, label: "Facebook" },
    { href: siteConfig.social.instagram, label: "Instagram" },
    { href: siteConfig.social.youtube, label: "YouTube" },
    { href: siteConfig.social.twitter, label: "Twitter" },
  ].filter(link => Boolean(link.href));

  if (compact) {
    return (
      <footer className="w-full bg-[#0A1B4D] text-white border-t border-white/10 pt-6 pb-8">
        <div className="container mx-auto px-4 text-center space-y-3">
          <p className="text-xs text-white/70">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="pt-2 border-t border-white/5">
            <p className="text-xs text-saffron-300 font-semibold tracking-wide">
              Design &amp; Managed by DevaCore Studios
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-[#0A1B4D] text-white border-t border-saffron-500/20 pt-12 pb-8">
      <div className="container mx-auto px-4">
        {/* 4 Balanced Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
          
          {/* COLUMN 1 — PRADHAN DIGITAL SERVICES */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <BrandLogo size="md" tagline="TRUST | DIGITAL | INNOVATION" />
            </Link>
            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              {lang === "hi"
                ? "मध्य प्रदेश एवं संपूर्ण भारत के नागरिकों के लिए विश्वसनीय निजी डिजिटल सहायता सेवा मंच। सरकारी सेवाएं आधिकारिक नियमों एवं पोर्टलों के माध्यम से सुरक्षित रूप से प्रोसेस की जाती हैं।"
                : "A trusted private digital assistance platform delivering online government services, job updates, and door-to-door document delivery assistance for citizens."}
            </p>

            <div className="space-y-2 text-xs text-white/80 pt-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-saffron-400 shrink-0" />
                <a href={telSupportUrl()} className="hover:text-saffron-400 transition font-medium">
                  {siteConfig.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-saffron-400 shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-saffron-400 transition font-medium">
                  {siteConfig.email}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-saffron-400 shrink-0 mt-0.5" />
                <span>{siteConfig.address}</span>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className="flex gap-2 pt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-saffron-500 hover:text-navy-950 text-xs font-semibold transition"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* COLUMN 2 — OUR SERVICES */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-saffron-400 uppercase tracking-wider">
              {lang === "hi" ? "प्रमुख सेवाएं" : "Our Services"}
            </h3>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/services" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "सभी सेवाएं (All Services)" : "All Services"}
                </Link>
              </li>
              <li>
                <Link href="/services#identity" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "आधार एवं पैन सेवाएं" : "Aadhaar & PAN Services"}
                </Link>
              </li>
              <li>
                <Link href="/services#certificates" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "आय, जाति एवं मूल निवास प्रमाण पत्र" : "Certificates (Income, Caste, Domicile)"}
                </Link>
              </li>
              <li>
                <Link href="/services#samagra" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "समग्र पोर्टल ई-केवाईसी" : "Samagra Portal e-KYC & Services"}
                </Link>
              </li>
              <li>
                <Link href="/government-schemes" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "सरकारी योजनाएं (PM Kisan, लाड़ली बहना)" : "Government Schemes"}
                </Link>
              </li>
              <li>
                <Link href="/offline-forms" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "ऑफलाइन फॉर्म एवं प्रारूप" : "Offline Forms & Templates"}
                </Link>
              </li>
              <li>
                <Link href="/recharge" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "मोबाइल रिचार्ज एवं बिल भुगतान" : "Recharge & Utility Bills"}
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — QUICK LINKS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-saffron-400 uppercase tracking-wider">
              {lang === "hi" ? "त्वरित लिंक" : "Quick Links"}
            </h3>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "होम (Home)" : "Home"}
                </Link>
              </li>
              <li>
                <Link href="/vacancy-update" className="hover:text-saffron-400 transition font-medium">
                  {lang === "hi" ? "वैकेंसी अपडेट (Vacancy Update)" : "Vacancy Update"}
                </Link>
              </li>
              <li>
                <Link href="/track-application" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "आवेदन ट्रैक करें (Track Request)" : "Track Request"}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "ग्राहक खाता (Customer Account)" : "Customer Account"}
                </Link>
              </li>
              <li>
                <Link href="/premium" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "प्रीमियम सदस्यता (Premium)" : "Premium"}
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "दस्तावेज़ होम डिलीवरी (Delivery)" : "Document Delivery"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "संपर्क एवं सहायता (Contact)" : "Contact"}
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4 — HELP & POLICIES */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-saffron-400 uppercase tracking-wider">
              {lang === "hi" ? "सहायता एवं नीतियां" : "Help & Policies"}
            </h3>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/about" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "हमारे बारे में" : "About Us"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "गोपनीयता नीति (Privacy Policy)" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "नियम व शर्तें (Terms of Service)" : "Terms"}
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "रिफंड एवं रद्दीकरण (Refund & Cancellation)" : "Refund/Cancellation"}
                </Link>
              </li>
              <li>
                <Link href="/delivery-policy" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "डिलीवरी नीति (Delivery Policy)" : "Delivery Policy"}
                </Link>
              </li>
              <li>
                <Link href="/subscription-terms" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "सब्सक्रिप्शन शर्तें (Subscription Terms)" : "Subscription Terms"}
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-saffron-400 transition">
                  {lang === "hi" ? "वैधानिक अस्वीकरण (Disclaimer)" : "Disclaimer"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Statutory Non-Government Disclaimer Card */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 leading-relaxed mb-8">
          <p>
            <strong className="text-saffron-400">
              {lang === "hi" ? "वैधानिक अस्वीकरण: " : "Statutory Disclaimer: "}
            </strong>
            {lang === "hi" ? siteConfig.disclaimer.hi : siteConfig.disclaimer.en}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent mb-6" />

        {/* Copyright Row */}
        <div className="text-center text-xs text-white/70 mb-3">
          <p>© {currentYear} Pradhan Digital Services. All rights reserved.</p>
        </div>

        {/* Final, separate, centred bottom row containing EXACTLY: Design & Managed by DevaCore Studios */}
        <div className="text-center pt-2">
          <p className="text-xs text-saffron-300 font-semibold tracking-wide">
            Design &amp; Managed by DevaCore Studios
          </p>
        </div>
      </div>
    </footer>
  );
}

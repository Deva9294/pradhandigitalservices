"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu, X, Phone, Globe, Sun, Moon, Search, Plus, Minus, 
  MapPin, Calendar, Shield, User, LogOut, MessageSquare,
  Sparkles, ExternalLink, Award, FileText, CheckCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import BrandLogo from "@/components/ui/BrandLogo";
import { cn, telSupportUrl, whatsAppUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const { lang, setLang, t } = useLanguage();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    setCurrentDate(now.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", options));
  }, [lang]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navLinks = [
    { href: "/", labelEn: "Home", labelHi: "होम" },
    { href: "/services", labelEn: "All Services", labelHi: "सभी सेवाएं" },
    { href: "/vacancy-update", labelEn: "Vacancy Update", labelHi: "वैकेंसी अपडेट" },
    { href: "/track-application", labelEn: "Track Request", labelHi: "आवेदन ट्रैक" },
    { href: "/premium", labelEn: "Premium", labelHi: "प्रीमियम" },
    { href: "/contact", labelEn: "Contact", labelHi: "संपर्क" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0A1B4D] text-white border-b border-white/10 shadow-md">
      {/* Utility Strip */}
      <div className="bg-[#071333] border-b border-white/5 py-1.5 text-[11px] text-white/80">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          {/* Support / Contact Left */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-saffron-300">
              <Shield className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "विश्वसनीय डिजिटल सहायता केंद्र" : "Private Digital Services Portal"}</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-white/60">
              <MapPin className="w-3 h-3 text-saffron-400" />
              <span>Rehti, Sehore (M.P.)</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 text-saffron-400" />
              <span>{currentDate}</span>
            </span>
          </div>

          {/* Contact Actions & Language Switcher Right */}
          <div className="flex items-center gap-3">
            <a
              href={telSupportUrl()}
              className="inline-flex items-center gap-1 hover:text-saffron-300 transition"
              aria-label="Call Helpline"
            >
              <Phone className="w-3 h-3 text-saffron-400" />
              <span className="hidden sm:inline">{siteConfig.phone}</span>
            </a>

            <span className="text-white/20">|</span>

            <a
              href={whatsAppUrl("नमस्ते, मुझे डिजिटल सेवा के बारे में जानकारी चाहिए।")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition"
              aria-label="WhatsApp Desk"
            >
              <MessageSquare className="w-3 h-3" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <span className="text-white/20">|</span>

            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-saffron-500 hover:text-navy-950 transition font-semibold"
              aria-label="Switch Language"
            >
              <Globe className="w-3 h-3 text-saffron-300" />
              <span>{lang === "en" ? "हिंदी" : "English"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="inline-block shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400 rounded-xl">
            <BrandLogo size="md" tagline="TRUST | DIGITAL | INNOVATION" />
          </Link>

          {/* Desktop Search Bar */}
          <form
            action="/services"
            className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-2"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-300/70" />
              <input
                type="search"
                name="q"
                placeholder={lang === "hi" ? "आप कौन-सी सेवा चाहते हैं? (आधार, पैन, खसरा...)" : "Search any service (Aadhaar, PAN, Jobs...)"}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/15 bg-navy-900/90 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs transition"
              />
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 transition whitespace-nowrap focus-visible:ring-2 focus-visible:ring-saffron-400"
              >
                {lang === "hi" ? item.labelHi : item.labelEn}
              </Link>
            ))}
          </nav>

          {/* Auth & Mobile Menu Button */}
          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-navy-950 text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{user?.name?.split(' ')[0] || "Dashboard"}</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-saffron-300 transition"
                    title="Admin Panel"
                  >
                    <Shield className="w-4 h-4" />
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="p-1.5 rounded-xl hover:bg-red-500/20 text-red-300 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-navy-950 text-xs font-bold transition shadow"
                >
                  {lang === "hi" ? "लॉगिन / रजिस्टर" : "Login / Register"}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition focus-visible:ring-2 focus-visible:ring-saffron-400"
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar below header */}
        <form
          action="/services"
          className="md:hidden mt-2.5"
          onSubmit={() => setOpen(false)}
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-300/70" />
            <input
              type="search"
              name="q"
              placeholder={lang === "hi" ? "आप कौन-सी सेवा चाहते हैं?" : "What service are you looking for?"}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/15 bg-navy-900 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs"
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="lg:hidden bg-[#071333] border-t border-white/10 px-4 py-4 space-y-3 animate-in fade-in duration-200">
          <nav className="space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-white/90 hover:bg-white/10 transition"
              >
                <span>{lang === "hi" ? item.labelHi : item.labelEn}</span>
                <span className="text-saffron-400 text-xs">→</span>
              </Link>
            ))}
          </nav>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2 text-xs">
            <a
              href={telSupportUrl()}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 text-white"
            >
              <Phone className="w-4 h-4 text-saffron-400" />
              <span>Helpline: {siteConfig.phone}</span>
            </a>
            <a
              href={whatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-600/20 text-emerald-300"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu, X, Phone, Globe, Sun, Moon, Search, Plus, Minus, 
  MapPin, Calendar, FileText, Shield, User, LogOut, 
  ExternalLink, Accessibility, Text
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import BrandLogo from "@/components/ui/BrandLogo";
import { cn, telSupportUrl, whatsAppUrl } from "@/lib/utils";

const MAIN_NAV_LINKS = [
  { href: "/", key: "home" as const },
  { href: "/services", key: "services" as const },
  { href: "/government-schemes", key: "schemes" as const },
  { href: "/vacancies", key: "vacancies" as const },
  { href: "/admit-cards", key: "admitCards" as const },
  { href: "/results", key: "results" as const },
  { href: "/exam-calendar", key: "examCalendar" as const },
  { href: "/offline-forms", key: "forms" as const },
  { href: "/document-tools", key: "documentTools" as const },
  { href: "/recharge", key: "recharge" as const },
  { href: "/track-application", key: "trackApplication" as const },
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
];

const MOBILE_NAV_CATEGORIES = [
  {
    title: "Services",
    items: [
      { href: "/services", label: "All Services" },
      { href: "/government-schemes", label: "Government Schemes" },
      { href: "/offline-forms", label: "Forms & Downloads" },
      { href: "/document-tools", label: "Document Tools" },
    ]
  },
  {
    title: "Jobs & Exams",
    items: [
      { href: "/vacancies", label: "Latest Vacancies" },
      { href: "/admit-cards", label: "Admit Cards" },
      { href: "/results", label: "Results" },
      { href: "/exam-calendar", label: "Exam Calendar" },
    ]
  },
  {
    title: "Payments",
    items: [
      { href: "/recharge", label: "Recharge & Bills" },
      { href: "/track-application", label: "Track Application" },
    ]
  },
  {
    title: "About",
    items: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact & Support" },
    ]
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [currentDate, setCurrentDate] = useState("");
  const [textSize, setTextSize] = useState<"sm" | "base" | "lg">("base");
  const { lang, setLang, t } = useLanguage();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
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

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const increaseTextSize = () => {
    setTextSize(prev => prev === "lg" ? "lg" : prev === "base" ? "lg" : "base");
  };

  const decreaseTextSize = () => {
    setTextSize(prev => prev === "sm" ? "sm" : prev === "base" ? "sm" : "base");
  };

  const textSizeClass = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg"
  }[textSize];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-navy-950 border-b border-navy-200 dark:border-navy-700 shadow-sm">
      {/* Top Information Bar */}
      <div className="bg-navy-900 text-white text-xs">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between py-2 gap-2">
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-flex items-center gap-1 opacity-90">
                <Shield className="w-3 h-3" />
                {lang === "hi" ? "निजी डिजिटल सेवा केंद्र" : "Private Digital Service Centre"}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 opacity-75">
                <MapPin className="w-3 h-3" />
                {lang === "hi" ? "मध्य प्रदेश, भारत" : "Madhya Pradesh, India"}
              </span>
            </div>
            
            <div className="flex items-center gap-3 md:gap-4">
              <span className="hidden sm:inline opacity-75">
                <Calendar className="w-3 h-3 inline mr-1" />
                {currentDate}
              </span>
              
              <a 
                href={telSupportUrl()} 
                className="flex items-center gap-1 hover:text-saffron-300 transition"
                aria-label="Call Now"
              >
                <Phone className="w-3 h-3" />
                <span className="hidden sm:inline">Call Now</span>
              </a>
              
              <a 
                href={whatsAppUrl()} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1 hover:text-saffron-300 transition"
                aria-label="Direct WhatsApp Inquiry"
              >
                <Phone className="w-3 h-3" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
              
              <button 
                onClick={() => setLang(lang === "en" ? "hi" : "en")} 
                className="flex items-center gap-1 hover:text-saffron-300 transition"
                aria-label="Switch language"
              >
                <Globe className="w-3 h-3" />
                {lang === "en" ? "हिंदी" : "English"}
              </button>
              
              <div className="flex items-center gap-1 border-l border-white/20 pl-3">
                <button 
                  onClick={decreaseTextSize}
                  className="p-1 hover:text-saffron-300 transition"
                  aria-label="Decrease text size"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <Accessibility className="w-3 h-3 opacity-60" />
                <button 
                  onClick={increaseTextSize}
                  className="p-1 hover:text-saffron-300 transition"
                  aria-label="Increase text size"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              
              {!isAuthenticated && (
                <div className="flex items-center gap-2 border-l border-white/20 pl-3">
                  <Link 
                    href="/login" 
                    className="hover:text-saffron-300 transition"
                  >
                    {lang === "hi" ? "लॉगिन" : "Login"}
                  </Link>
                  <span className="opacity-50">|</span>
                  <Link 
                    href="/login?role=register" 
                    className="hover:text-saffron-300 transition"
                  >
                    {lang === "hi" ? "रजिस्टर" : "Register"}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white dark:bg-navy-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <BrandLogo />
            </Link>

            {/* Search Bar - Desktop */}
            <form
              action="/services"
              className="hidden md:flex flex-1 max-w-xl mx-8"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                <input
                  type="search"
                  name="q"
                  id="global-search"
                  placeholder={lang === "hi" ? "आधार, पैन, आयुष्मान, पीएम किसान खोजें..." : "Search Aadhaar, PAN, Ayushman, PM Kisan..."}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800 text-navy-900 dark:text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition"
                />
              </div>
            </form>

            <div className="flex items-center gap-2 md:gap-3">
              {/* Track Application Button */}
              <Link 
                href="/track-application"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white rounded-lg hover:bg-navy-200 dark:hover:bg-navy-700 transition text-sm font-medium"
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline">
                  {lang === "hi" ? "आवेदन ट्रैक करें" : "Track Application"}
                </span>
              </Link>

              {/* Theme Toggle */}
              <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-800 transition text-navy-700 dark:text-navy-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 bg-saffron-600 text-white rounded-lg hover:bg-saffron-700 transition text-sm font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">
                      {lang === "hi" ? "डैशबोर्ड" : "Dashboard"}
                    </span>
                  </Link>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className="p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-800 text-saffron-600"
                      aria-label="Admin panel"
                    >
                      <Shield className="w-5 h-5" />
                    </Link>
                  )}
                  <button 
                    onClick={logout} 
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link 
                    href="/login?role=customer"
                    className="px-4 py-2 bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white rounded-lg hover:bg-navy-200 dark:hover:bg-navy-700 transition text-sm font-medium"
                  >
                    {lang === "hi" ? "ग्राहक लॉगिन" : "Customer Login"}
                  </Link>
                  <Link 
                    href="/login?role=agent"
                    className="px-4 py-2 bg-saffron-600 text-white rounded-lg hover:bg-saffron-700 transition text-sm font-medium"
                  >
                    {lang === "hi" ? "एजेंट लॉगिन" : "Agent Login"}
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setOpen(!open)} 
                className="lg:hidden p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-800"
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Desktop */}
      <nav className="hidden lg:block bg-navy-50 dark:bg-navy-900 border-t border-navy-200 dark:border-navy-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
            {MAIN_NAV_LINKS.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition
                  ${t.nav[link.key] 
                    ? 'text-navy-700 dark:text-navy-200 hover:bg-saffron-50 dark:hover:bg-navy-800 hover:text-saffron-600 dark:hover:text-saffron-400' 
                    : 'text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800'
                  }`}
              >
                {t.nav[link.key] || link.key}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden overflow-y-auto transition-all duration-300 bg-white dark:bg-navy-950 border-t border-navy-200 dark:border-navy-700",
        open ? "max-h-[80vh]" : "max-h-0 overflow-hidden"
      )}>
        <div className={`container mx-auto px-4 py-4 ${textSizeClass}`}>
          {/* Mobile Search */}
          <form action="/services" className="mb-4" onSubmit={() => setOpen(false)}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
              <input
                type="search"
                name="q"
                placeholder={lang === "hi" ? "सेवाएँ खोजें..." : "Search services..."}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800 text-navy-900 dark:text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>
          </form>

          {/* Mobile Track Application */}
          <Link 
            href="/track-application"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 bg-saffron-50 dark:bg-navy-800 text-saffron-700 dark:text-saffron-300 rounded-lg mb-4"
          >
            <Search className="w-5 h-5" />
            {lang === "hi" ? "आवेदन ट्रैक करें" : "Track Application"}
          </Link>

          {/* Categorized Mobile Navigation */}
          <nav className="space-y-2">
            {MOBILE_NAV_CATEGORIES.map((category) => (
              <div key={category.title} className="border border-navy-200 dark:border-navy-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.title)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-navy-50 dark:bg-navy-800 font-medium text-navy-900 dark:text-white"
                >
                  {category.title}
                  {expandedCategories[category.title] ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
                {expandedCategories[category.title] && (
                  <div className="bg-white dark:bg-navy-950">
                    {category.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-navy-50 dark:hover:bg-navy-800 text-navy-700 dark:text-navy-200 border-t border-navy-100 dark:border-navy-800"
                      >
                        {item.label}
                        <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Auth Buttons */}
          {!isAuthenticated && (
            <div className="mt-4 space-y-2">
              <Link 
                href="/login?role=customer"
                onClick={() => setOpen(false)}
                className="block w-full px-4 py-3 bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white rounded-lg text-center font-medium"
              >
                {lang === "hi" ? "ग्राहक लॉगिन" : "Customer Login"}
              </Link>
              <Link 
                href="/login?role=agent"
                onClick={() => setOpen(false)}
                className="block w-full px-4 py-3 bg-saffron-600 text-white rounded-lg text-center font-medium"
              >
                {lang === "hi" ? "एजेंट लॉगिन" : "Agent Login"}
              </Link>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-saffron-50 dark:bg-saffron-900/20 rounded-lg border border-saffron-200 dark:border-saffron-800">
            <p className="text-xs text-saffron-800 dark:text-saffron-200 leading-relaxed">
              {lang === "hi" 
                ? "Pradhan Digital Services एक निजी डिजिटल सेवा केंद्र है। यह वेबसाइट किसी सरकारी विभाग की आधिकारिक वेबसाइट नहीं है।"
                : "Pradhan Digital Services is a private digital service centre. This website is not an official government department website."
              }
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

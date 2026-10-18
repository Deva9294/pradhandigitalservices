"use client";

import { useState } from "react";
import { Send, Phone, Mail, MapPin, MessageCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { siteConfig } from "@/config/site";
import { whatsAppUrl, telSupportUrl } from "@/lib/utils";
import { contactApi } from "@/lib/api";
import { useToast } from "@/components/common/Toast";
import { normalizeIndianMobile, validateContactForm } from "@/lib/validation";

export default function ContactSection() {
  const { lang, t } = useLanguage();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateContactForm(
      { ...form, subject: "Homepage inquiry" },
      { emailRequired: false, subjectRequired: false }
    );
    if (validationError) {
      showToast("error", validationError);
      return;
    }

    setLoading(true);
    try {
      await contactApi.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: normalizeIndianMobile(form.phone),
        subject: "Homepage inquiry",
        message: form.message.trim(),
        source: "homepage",
      });
      showToast("success", lang === "hi" ? "संदेश भेज दिया गया!" : "Message sent successfully!");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      showToast("error", lang === "hi" ? "भेजने में विफल" : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-navy-950 text-white overflow-x-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
          {t.sections.contact}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              { icon: Phone, label: "Phone / WhatsApp", value: siteConfig.phone, href: telSupportUrl() },
              { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
              { icon: MapPin, label: "Location", value: siteConfig.address, href: undefined },
            ].map(({ icon: Icon, label, value, href }) => {
              const inner = (
                <>
                  <div className="w-10 h-10 rounded-xl bg-saffron-500/15 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-saffron-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-navy-300">{label}</div>
                    <div className="font-medium text-white break-words">{value}</div>
                  </div>
                </>
              );
              return href ? (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-4 p-4 glass-panel rounded-3xl hover:border-saffron-300 transition"
                >
                  {inner}
                </a>
              ) : (
                <div key={label} className="flex items-center gap-4 p-4 glass-panel rounded-3xl">
                  {inner}
                </div>
              );
            })}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={whatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-500 transition"
              >
                <MessageCircle className="w-5 h-5" />
                {lang === "hi" ? "WhatsApp पूछताछ" : "WhatsApp Inquiry"}
              </a>
              <a
                href={telSupportUrl()}
                className="flex items-center justify-center gap-2 p-4 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 transition"
              >
                <Phone className="w-5 h-5" />
                {lang === "hi" ? "कॉल करें" : "Call Now"}
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 glass-panel rounded-[32px] space-y-4 border border-white/10">
            {(["name", "phone", "email"] as const).map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                inputMode={field === "phone" ? "numeric" : undefined}
                maxLength={field === "phone" ? 10 : undefined}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required={field !== "email"}
                value={form[field]}
                onChange={(e) => {
                  const value =
                    field === "phone"
                      ? e.target.value.replace(/\D/g, "").slice(0, 10)
                      : e.target.value;
                  setForm({ ...form, [field]: value });
                }}
                className="w-full px-4 py-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            ))}
            <textarea
              placeholder="Message"
              rows={4}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {lang === "hi" ? "भेज रहा है..." : "Sending..."}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {lang === "hi" ? "संदेश भेजें" : "Send Message"}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Send, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_NUMBER } from "@/lib/utils";

export default function ContactSection() {
  const { lang, t } = useLanguage();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section className="py-16 bg-navy-950 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
          {t.sections.contact}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              { icon: Phone, label: "Phone / WhatsApp", value: `+91 ${WHATSAPP_NUMBER.slice(2)}`, href: `https://wa.me/${WHATSAPP_NUMBER}` },
              { icon: Mail, label: "Email", value: "support@pradhandigitalservices.com", href: "mailto:support@pradhandigitalservices.com" },
              { icon: MapPin, label: "Location", value: "India", href: "#" },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} className="flex items-center gap-4 p-4 glass-panel rounded-3xl hover:border-saffron-300 transition relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-saffron-500/15 dark:bg-saffron-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-saffron-600" />
                </div>
                <div>
                  <div className="text-xs text-navy-500">{label}</div>
                  <div className="font-medium text-navy-900 dark:text-white">{value}</div>
                </div>
              </a>
            ))}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full p-4 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 transition">
              <MessageCircle className="w-5 h-5" />
              {lang === "hi" ? "WhatsApp पर चैट करें" : "Chat on WhatsApp"}
            </a>
          </div>

          <form onSubmit={handleSubmit} className="p-6 glass-panel rounded-[32px] space-y-4 border border-white/10">
            {["name", "phone", "email"].map((field) => (
              <input key={field} type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required={field !== "email"}
                value={form[field as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            ))}
            <textarea placeholder="Message" rows={4} required
              value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 resize-none"
            />
            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 transition">
              <Send className="w-4 h-4" />
              {sent ? (lang === "hi" ? "भेज दिया!" : "Sent!") : (lang === "hi" ? "संदेश भेजें" : "Send Message")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

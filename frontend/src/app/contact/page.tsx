"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import BrandLogo from "@/components/ui/BrandLogo";
import { whatsAppUrl, telSupportUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { contactApi } from "@/lib/api";
import { useToast } from "@/components/common/Toast";
import { normalizeIndianMobile, validateContactForm } from "@/lib/validation";

export default function ContactPage() {
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    const validationError = validateContactForm(formData, {
      emailRequired: true,
      subjectRequired: true,
    });
    if (validationError) {
      setFieldError(validationError);
      showToast("error", validationError);
      return;
    }

    setLoading(true);

    try {
      await contactApi.submit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: normalizeIndianMobile(formData.phone),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        source: "contact-page",
      });
      setSubmitted(true);
      showToast(
        "success",
        lang === "hi" ? "संदेश सफलतापूर्वक भेजा गया!" : "Message sent successfully!"
      );
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (lang === "hi" ? "संदेश भेजने में विफल" : "Failed to send message");
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: lang === "hi" ? "फोन" : "Phone",
      value: siteConfig.phone,
      link: telSupportUrl(),
    },
    {
      icon: Mail,
      label: lang === "hi" ? "ईमेल" : "Email",
      value: siteConfig.email,
      link: `mailto:${siteConfig.email}`,
    },
    {
      icon: MapPin,
      label: lang === "hi" ? "पता" : "Address",
      value: siteConfig.address,
      link: null,
    },
    {
      icon: Clock,
      label: lang === "hi" ? "कार्य समय" : "Working Hours",
      value: "9:00 AM - 7:00 PM (Mon–Sat)",
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 overflow-x-hidden">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-white/90 dark:bg-navy-800 p-3 shadow-xl">
            <BrandLogo compact />
          </div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
            {lang === "hi" ? "संपर्क करें" : "Contact Us"}
          </h1>
          <p className="text-navy-600 dark:text-navy-400">
            {lang === "hi" ? "हमसे जुड़ें, हम आपकी मदद करने के लिए यहाँ हैं" : "Get in touch — we're here to help"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 max-w-xl mx-auto">
          <a
            href={whatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-500 transition"
          >
            <MessageSquare className="w-5 h-5" />
            {lang === "hi" ? "WhatsApp पूछताछ" : "Direct WhatsApp Inquiry"}
          </a>
          <a
            href={telSupportUrl()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 transition"
          >
            <Phone className="w-5 h-5" />
            {lang === "hi" ? "अभी कॉल करें" : "Call Now"}
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-6">
                {lang === "hi" ? "संपर्क जानकारी" : "Contact Information"}
              </h2>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center shrink-0">
                      <info.icon className="w-6 h-6 text-saffron-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-navy-600 dark:text-navy-400">{info.label}</div>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="font-medium text-navy-900 dark:text-white hover:text-saffron-600 transition break-words"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="font-medium text-navy-900 dark:text-white break-words">{info.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-6">
              {lang === "hi" ? "संदेश भेजें" : "Send us a message"}
            </h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">
                  {lang === "hi" ? "संदेश भेजा गया!" : "Message Sent!"}
                </h3>
                <p className="text-navy-600 dark:text-navy-400">
                  {lang === "hi" ? "हम जल्द ही आपसे संपर्क करेंगे" : "We'll get back to you soon"}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-saffron-600 hover:underline"
                >
                  {lang === "hi" ? "एक और संदेश भेजें" : "Send another message"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {fieldError && (
                  <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {fieldError}
                  </p>
                )}
                <div>
                  <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                    {lang === "hi" ? "नाम" : "Name"} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={lang === "hi" ? "आपका नाम" : "Your name"}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                      {lang === "hi" ? "ईमेल" : "Email"} *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                      {lang === "hi" ? "फोन" : "Phone"} *
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        })
                      }
                      placeholder="10-digit mobile"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                    {lang === "hi" ? "विषय" : "Subject"} *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={lang === "hi" ? "आपका प्रश्न" : "Your inquiry"}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                    {lang === "hi" ? "संदेश" : "Message"} *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={lang === "hi" ? "अपना संदेश लिखें..." : "Write your message..."}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-saffron-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {lang === "hi" ? "भेज रहा है..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> {lang === "hi" ? "संदेश भेजें" : "Send Message"}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

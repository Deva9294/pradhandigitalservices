"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import BrandLogo from "@/components/ui/BrandLogo";
import { SITE_NAME, WHATSAPP_NUMBER } from "@/lib/utils";

export default function ContactPage() {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: lang === "hi" ? "फोन" : "Phone",
      value: "+91 98765 43210",
      link: `tel:+919876543210`,
    },
    {
      icon: Mail,
      label: lang === "hi" ? "ईमेल" : "Email",
      value: "support@pradhandigital.com",
      link: "mailto:support@pradhandigital.com",
    },
    {
      icon: MapPin,
      label: lang === "hi" ? "पता" : "Address",
      value: "New Delhi, India",
      link: null,
    },
    {
      icon: Clock,
      label: lang === "hi" ? "कार्य समय" : "Working Hours",
      value: "9:00 AM - 6:00 PM",
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-white/90 dark:bg-navy-800 p-3 shadow-xl">
            <BrandLogo compact />
          </div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
            {lang === "hi" ? "संपर्क करें" : "Contact Us"}
          </h1>
          <p className="text-navy-600 dark:text-navy-400">
            {lang === "hi" ? "हमसे जुड़ें, हम आपकी मदद करने के लिए यहाँ हैं" : "Get in touch, we're here to help"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-xl p-8">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-6">
                {lang === "hi" ? "संपर्क जानकारी" : "Contact Information"}
              </h2>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center shrink-0">
                      <info.icon className="w-6 h-6 text-saffron-600" />
                    </div>
                    <div>
                      <div className="text-sm text-navy-600 dark:text-navy-400">{info.label}</div>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="font-medium text-navy-900 dark:text-white hover:text-saffron-600 transition"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="font-medium text-navy-900 dark:text-white">{info.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-navy-200 dark:border-navy-700">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition"
                >
                  <MessageSquare className="w-5 h-5" />
                  {lang === "hi" ? "WhatsApp पर संपर्क करें" : "Chat on WhatsApp"}
                </a>
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-xl p-8">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">
                {lang === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}
              </h2>
              <div className="space-y-3">
                <div className="p-4 bg-navy-50 dark:bg-navy-900 rounded-xl">
                  <div className="font-medium text-navy-900 dark:text-white text-sm">
                    {lang === "hi" ? "सेवा कितने समय में पूरी होगी?" : "How long will the service take?"}
                  </div>
                  <div className="text-xs text-navy-600 dark:text-navy-400 mt-1">
                    {lang === "hi" ? "अधिकांश सेवाएं 3-7 दिनों में पूरी होती हैं" : "Most services complete in 3-7 days"}
                  </div>
                </div>
                <div className="p-4 bg-navy-50 dark:bg-navy-900 rounded-xl">
                  <div className="font-medium text-navy-900 dark:text-white text-sm">
                    {lang === "hi" ? "भुगतान कैसे करें?" : "How to make payment?"}
                  </div>
                  <div className="text-xs text-navy-600 dark:text-navy-400 mt-1">
                    {lang === "hi" ? "UPI, कार्ड, नेट बैंकिंग और वॉलेट से भुगतान करें" : "Pay via UPI, Card, Net Banking & Wallet"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-xl p-8">
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
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-saffron-600 hover:underline"
                >
                  {lang === "hi" ? "एक और संदेश भेजें" : "Send another message"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                    {lang === "hi" ? "नाम" : "Name"}
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                      {lang === "hi" ? "ईमेल" : "Email"}
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
                      {lang === "hi" ? "फोन" : "Phone"}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit number"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                    {lang === "hi" ? "विषय" : "Subject"}
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
                    {lang === "hi" ? "संदेश" : "Message"}
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
                    lang === "hi" ? "भेज रहा है..." : "Sending..."
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

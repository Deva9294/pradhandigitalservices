"use client";

import { useState } from "react";
import { Smartphone, Tv, IndianRupee, Zap, Clock, Shield, Lightbulb, Droplets, Flame, CreditCard, Wifi, Car, Home, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { siteConfig } from "@/config/site";

type RechargeType = "mobile" | "dth" | "electricity" | "water" | "gas" | "broadband" | "fastag" | "creditcard";

export default function RechargePage() {
  const { lang } = useLanguage();
  const [type, setType] = useState<RechargeType>("mobile");
  const [number, setNumber] = useState("");
  const [provider, setProvider] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const services = [
    { id: "mobile" as RechargeType, icon: Smartphone, name: "Mobile Recharge", nameHi: "मोबाइल रिचार्ज" },
    { id: "dth" as RechargeType, icon: Tv, name: "DTH Recharge", nameHi: "DTH रिचार्ज" },
    { id: "electricity" as RechargeType, icon: Lightbulb, name: "Electricity Bill", nameHi: "बिजली बिल" },
    { id: "water" as RechargeType, icon: Droplets, name: "Water Bill", nameHi: "पानी बिल" },
    { id: "gas" as RechargeType, icon: Flame, name: "Gas Booking", nameHi: "गैस बुकिंग" },
    { id: "broadband" as RechargeType, icon: Wifi, name: "Broadband", nameHi: "ब्रॉडबैंड" },
    { id: "fastag" as RechargeType, icon: Car, name: "FASTag", nameHi: "FASTag" },
    { id: "creditcard" as RechargeType, icon: CreditCard, name: "Credit Card Bill", nameHi: "क्रेडिट कार्ड बिल" },
  ];

  const mobileProviders = [
    { id: "jio", name: "Jio", logo: "🟣" },
    { id: "airtel", name: "Airtel", logo: "🔴" },
    { id: "vi", name: "Vi", logo: "🟡" },
    { id: "bsnl", name: "BSNL", logo: "🔵" },
  ];

  const dthProviders = [
    { id: "tatasky", name: "Tata Sky", logo: "📺" },
    { id: "airteldth", name: "Airtel DTH", logo: "📡" },
    { id: "dish", name: "Dish TV", logo: "🛰️" },
    { id: "d2h", name: "D2H", logo: "📺" },
  ];

  const quickAmounts = [199, 299, 499, 599, 799, 999];

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = type === "mobile" ? "/api/recharge/mobile" : type === "dth" ? "/api/recharge/dth" : "/api/recharge/bill";
      const payload = type === "mobile" 
        ? { phoneNumber: number, provider, amount: parseInt(amount) }
        : type === "dth"
        ? { customerId: number, provider, amount: parseInt(amount) }
        : { service: type, accountNumber: number, amount: parseInt(amount) };

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Recharge failed");
      }

      alert(lang === "hi" ? "रिचार्ज सफल!" : "Recharge successful!");
      setNumber("");
      setAmount("");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {lang === "hi" ? "रिचार्ज और बिल भुगतान" : "Recharge & Bill Payment"}
          </h1>
          <p className="text-saffron-200/90">
            {lang === "hi" ? "तेज़, सुरक्षित और विश्वसनीय" : "Fast, Secure & Reliable"}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Service Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setType(service.id)}
                className={`p-4 rounded-2xl border-2 transition flex flex-col items-center gap-2 ${
                  type === service.id
                    ? "border-saffron-500 bg-saffron-500/15 text-white"
                    : "border-white/10 bg-navy-900 text-white hover:border-saffron-300"
                }`}
              >
                <service.icon className={`w-6 h-6 ${type === service.id ? "text-saffron-400" : "text-saffron-600"}`} />
                <span className="text-xs font-medium text-center">
                  {lang === "hi" ? service.nameHi : service.name}
                </span>
              </button>
            ))}
          </div>

          {/* Recharge Form */}
          <div className="glass-panel rounded-[32px] p-8 border border-white/10 shadow-2xl">
            <form onSubmit={handleRecharge} className="space-y-6">
              {/* Provider Selection (for mobile/dth) */}
              {(type === "mobile" || type === "dth") && (
                <div>
                  <label className="block text-sm font-medium text-saffron-200/90 mb-3">
                    {lang === "hi" ? "प्रोवाइडर चुनें" : "Select Provider"}
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {(type === "mobile" ? mobileProviders : dthProviders).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setProvider(p.id)}
                        className={`p-3 rounded-2xl border-2 transition ${
                          provider === p.id
                            ? "border-saffron-500 bg-saffron-500/15 text-white"
                            : "border-white/10 bg-navy-900 text-white hover:border-saffron-300"
                        }`}
                      >
                        <div className="text-2xl mb-1">{p.logo}</div>
                        <div className="text-xs font-medium text-white">{p.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bill Provider Selection (for bills) */}
              {["electricity", "water", "gas", "broadband"].includes(type) && (
                <div>
                  <label className="block text-sm font-medium text-saffron-200/90 mb-3">
                    {lang === "hi" ? "बोर्ड चुनें" : "Select Board"}
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-navy-900 text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  >
                    <option value="">{lang === "hi" ? "बोर्ड चुनें..." : "Select board..."}</option>
                    <option value="mp">MP Electricity Board</option>
                    <option value="delhi">Delhi Jal Board</option>
                    <option value="bharat">Bharat Gas</option>
                    <option value="airtel">Airtel Broadband</option>
                  </select>
                </div>
              )}

              {/* Number/Account Input */}
              <div>
                <label className="block text-sm font-medium text-saffron-200/90 mb-2">
                  {type === "mobile" 
                    ? lang === "hi" ? "मोबाइल नंबर" : "Mobile Number"
                    : type === "dth"
                    ? lang === "hi" ? "कस्टमर ID" : "Customer ID"
                    : lang === "hi" ? "खाता नंबर" : "Account Number"}
                </label>
                <input
                  type={type === "mobile" ? "tel" : "text"}
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder={type === "mobile" ? "10-digit number" : type === "dth" ? "Enter customer ID" : "Enter account number"}
                  required
                  maxLength={type === "mobile" ? 10 : 15}
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-navy-900 text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-saffron-200/90 mb-3">
                  {lang === "hi" ? "राशि चुनें" : "Select Amount"}
                </label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt.toString())}
                      className={`p-3 rounded-2xl border-2 transition ${
                        amount === amt.toString()
                          ? "border-saffron-500 bg-saffron-500/15 text-white"
                          : "border-white/10 bg-navy-900 text-white hover:border-saffron-300"
                      }`}
                    >
                      <IndianRupee className="w-4 h-4 inline mr-1" /> {amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={lang === "hi" ? "या कस्टम राशि दर्ज करें" : "Or enter custom amount"}
                  min="10"
                  max="10000"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-navy-900 text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-4 text-sm text-saffron-200/80">
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-saffron-600" /> {lang === "hi" ? "तत्काल" : "Instant"}
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-saffron-600" /> {lang === "hi" ? "सुरक्षित" : "Secure"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-saffron-600" /> {lang === "hi" ? "24/7" : "24/7"}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading 
                  ? lang === "hi" ? "प्रक्रिया में..." : "Processing..."
                  : `${lang === "hi" ? "भुगतान करें" : "Pay"} ₹${amount}`
                }
              </button>
            </form>

            {/* Info Notice */}
            <div className="mt-6 p-4 bg-navy-900/40 border border-white/10 rounded-2xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-saffron-300 shrink-0 mt-0.5" />
                <p className="text-xs text-saffron-200/90">
                  {lang === "hi"
                    ? "भुगतान सुरक्षित है। किसी भी समस्या के लिए सहायता से संपर्क करें।"
                    : "Payment is secure. Contact support for any issues."}
                </p>
              </div>
            </div>

            {/* Contact Support */}
            <div className="mt-4 text-center">
              <a 
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-saffron-400 hover:text-saffron-300"
              >
                {lang === "hi" ? "सहायता के लिए WhatsApp पर संपर्क करें" : "Contact support on WhatsApp"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

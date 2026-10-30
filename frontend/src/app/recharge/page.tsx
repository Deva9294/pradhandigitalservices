"use client";

import { useState, useEffect } from "react";
import { 
  Smartphone, Tv, IndianRupee, Zap, Clock, Shield, Lightbulb, 
  Droplets, Flame, CreditCard, Wifi, Car, AlertCircle, Loader2, 
  CheckCircle2, Printer, Download, ArrowRight, RefreshCw, X
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { whatsAppUrl } from "@/lib/utils";
import { rechargeApi } from "@/lib/api";
import RazorpayPayButton from "@/components/payment/RazorpayPayButton";
import { useToast } from "@/components/common/Toast";
import { normalizeIndianMobile, isValidIndianMobile } from "@/lib/validation";

type RechargeType = "mobile" | "dth" | "electricity" | "water" | "gas" | "broadband" | "fastag" | "creditcard";

interface PlanItem {
  id: string;
  name: string;
  amount: number;
  validity: string;
  data: string;
  category: string;
  description: string;
}

export default function RechargePage() {
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [type, setType] = useState<RechargeType>("mobile");
  const [number, setNumber] = useState("");
  const [provider, setProvider] = useState("jio");
  const [amount, setAmount] = useState("");
  const [selectedPlanDesc, setSelectedPlanDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [pendingPayment, setPendingPayment] = useState<any>(null);

  const services = [
    { id: "mobile" as RechargeType, icon: Smartphone, name: "Mobile Recharge", nameHi: "मोबाइल रिचार्ज" },
    { id: "dth" as RechargeType, icon: Tv, name: "DTH Recharge", nameHi: "DTH रिचार्ज" },
    { id: "electricity" as RechargeType, icon: Lightbulb, name: "Electricity Bill", nameHi: "बिजली बिल" },
    { id: "water" as RechargeType, icon: Droplets, name: "Water Bill", nameHi: "पानी बिल" },
    { id: "gas" as RechargeType, icon: Flame, name: "Gas Booking", nameHi: "गैस बुकिंग" },
    { id: "broadband" as RechargeType, icon: Wifi, name: "Broadband", nameHi: "ब्रॉडबैंड" },
    { id: "fastag" as RechargeType, icon: Car, name: "FASTag", nameHi: "FASTag" },
    { id: "creditcard" as RechargeType, icon: CreditCard, name: "Credit Card Bill", nameHi: "क्रेडिट कार्ड" },
  ];

  const mobileProviders = [
    { id: "jio", name: "Jio", logo: "🟣" },
    { id: "airtel", name: "Airtel", logo: "🔴" },
    { id: "vi", name: "Vi", logo: "🟡" },
    { id: "bsnl", name: "BSNL", logo: "🔵" },
  ];

  const dthProviders = [
    { id: "tatasky", name: "Tata Play", logo: "📺" },
    { id: "airteldth", name: "Airtel DTH", logo: "📡" },
    { id: "dish", name: "Dish TV", logo: "🛰️" },
    { id: "d2h", name: "D2H", logo: "📺" },
  ];

  const billProviders: Record<string, { id: string; name: string }[]> = {
    electricity: [
      { id: "mppkvvcl_central", name: "MPPKVVCL - Bhopal / Central MP (मध्य क्षेत्र विद्युत)" },
      { id: "mppkvvcl_west", name: "MPPKVVCL - Indore / West MP (पश्चिम क्षेत्र विद्युत)" },
      { id: "mppoorv", name: "MP Poorv Kshetra - Jabalpur (पूर्व क्षेत्र विद्युत)" },
      { id: "uppcl", name: "UPPCL (Uttar Pradesh Power Corporation)" }
    ],
    water: [
      { id: "mp_urban_water", name: "Bhopal / Sehore Municipal Water Tax" },
      { id: "indore_water", name: "Indore Municipal Corporation (IMC) Jal Kar" }
    ],
    gas: [
      { id: "indane", name: "Indane Gas (Indian Oil)" },
      { id: "hp", name: "HP Gas (Hindustan Petroleum)" },
      { id: "bharat", name: "Bharat Gas (BPCL)" }
    ],
    broadband: [
      { id: "jio_fiber", name: "JioFiber / AirFiber" },
      { id: "airtel_xstream", name: "Airtel Xstream Fiber" },
      { id: "bsnl_ftth", name: "BSNL Bharat Fiber" }
    ],
    fastag: [
      { id: "sbi_fastag", name: "State Bank of India (SBI) FASTag" },
      { id: "icici_fastag", name: "ICICI Bank FASTag" },
      { id: "airtel_fastag", name: "Airtel Payments Bank FASTag" }
    ],
    creditcard: [
      { id: "sbi_card", name: "SBI Credit Card" },
      { id: "hdfc_card", name: "HDFC Bank Credit Card" },
      { id: "icici_card", name: "ICICI Bank Credit Card" }
    ]
  };

  // Fetch operator plans when provider changes
  useEffect(() => {
    if (type === "mobile") {
      setLoadingPlans(true);
      rechargeApi.plans(provider)
        .then((res) => {
          if (res.data?.success && Array.isArray(res.data.plans)) {
            setPlans(res.data.plans);
          }
        })
        .catch(() => setPlans([]))
        .finally(() => setLoadingPlans(false));
    }
  }, [type, provider]);

  const handleSelectPlan = (p: PlanItem) => {
    setAmount(String(p.amount));
    setSelectedPlanDesc(`${p.name} - ${p.validity} (${p.data})`);
    showToast("info", lang === "hi" ? `प्लान ₹${p.amount} चुना गया` : `Selected plan ₹${p.amount}`);
  };

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if ((type === "mobile" || type === "dth") && !provider) throw new Error("कृपया प्रोवाइडर चुनें।");
      if (type === "mobile" && !isValidIndianMobile(number)) throw new Error("वैध 10 अंकों का मोबाइल नंबर दर्ज करें।");
      if (type !== "mobile" && !number.trim()) throw new Error("खाता / उपभोक्ता नंबर दर्ज करें।");
      const parsedAmount = Number(amount);
      if (!Number.isFinite(parsedAmount) || parsedAmount < 10 || parsedAmount > 50000) throw new Error("वैध राशि दर्ज करें (₹10 - ₹50,000)।");
      setPendingPayment({
        amount: parsedAmount,
        purpose: type.toUpperCase() + " payment for " + number.trim(),
        paymentType: type === "mobile" || type === "dth" ? "recharge" : "bill_payment",
        targetNumber: type === "mobile" ? normalizeIndianMobile(number) : number.trim(),
        provider,
        description: selectedPlanDesc || services.find((item) => item.id === type)?.name || type
      });
      setReceipt(null);
    } catch (error: any) {
      showToast("error", error?.message || (lang === "hi" ? "विवरण जांचें" : "Please check the details"));
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5" />
            {lang === "hi" ? "Razorpay से रिचार्ज / बिल भुगतान" : "Recharge & Bill Payment via Razorpay"}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            {lang === "hi" ? "रिचार्ज और बिल भुगतान" : "Recharge & Bill Payment"}
          </h1>
          <p className="text-saffron-200/90 text-sm md:text-base">
            {lang === "hi" ? "मोबाइल, DTH, बिजली बिल, पानी कर, गैस बुकिंग एवं FASTag — तत्काल एवं डिजिटल रसीद सहित।" : "Secure Razorpay checkout. Actual recharge and BBPS fulfilment requires a live operator integration."}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Service Type Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  setType(service.id);
                  setReceipt(null);
                  if (service.id === "mobile") setProvider("jio");
                  else if (service.id === "dth") setProvider("tatasky");
                  else if (billProviders[service.id]?.[0]) setProvider(billProviders[service.id][0].id);
                }}
                className={`p-4 rounded-2xl border-2 transition flex flex-col items-center gap-2 ${
                  type === service.id
                    ? "border-saffron-500 bg-saffron-500/15 text-white shadow-lg"
                    : "border-white/10 bg-navy-900 text-white hover:border-saffron-400/50"
                }`}
              >
                <service.icon className={`w-6 h-6 ${type === service.id ? "text-saffron-400" : "text-saffron-500"}`} />
                <span className="text-xs font-semibold text-center">
                  {lang === "hi" ? service.nameHi : service.name}
                </span>
              </button>
            ))}
          </div>

          {/* Recharge & Bill Form */}
          <div className="glass-panel rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-2xl bg-navy-900/90 backdrop-blur-md">
            <form onSubmit={handleRecharge} className="space-y-6">
              {/* Provider Selection (for mobile/dth) */}
              {(type === "mobile" || type === "dth") && (
                <div>
                  <label className="block text-sm font-semibold text-saffron-200 mb-3">
                    {lang === "hi" ? "ऑपरेटर / प्रोवाइडर चुनें" : "Select Operator / Provider"}
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {(type === "mobile" ? mobileProviders : dthProviders).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setProvider(p.id)}
                        className={`p-3 rounded-2xl border-2 transition flex flex-col items-center justify-center ${
                          provider === p.id
                            ? "border-saffron-500 bg-saffron-500/20 text-white font-bold"
                            : "border-white/10 bg-navy-950/60 text-white hover:border-saffron-400"
                        }`}
                      >
                        <div className="text-2xl mb-1">{p.logo}</div>
                        <div className="text-xs font-medium">{p.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bill Provider Selection (for bills) */}
              {billProviders[type] && (
                <div>
                  <label className="block text-sm font-semibold text-saffron-200 mb-2">
                    {lang === "hi" ? "संबंधित बोर्ड / कंपनी चुनें" : "Select Board / Biller"}
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-white/15 bg-navy-950 text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 text-sm font-medium"
                  >
                    {billProviders[type].map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Number/Account Input */}
              <div>
                <label className="block text-sm font-semibold text-saffron-200 mb-2">
                  {type === "mobile" 
                    ? (lang === "hi" ? "10 अंकों का मोबाइल नंबर" : "10-Digit Mobile Number")
                    : type === "dth"
                    ? (lang === "hi" ? "कस्टमर ID / स्मार्ट कार्ड नंबर" : "Customer ID / VC Number")
                    : type === "electricity"
                    ? (lang === "hi" ? "उपभोक्ता क्रमांक (IVRS / Account No.)" : "Consumer / IVRS Number")
                    : type === "gas"
                    ? (lang === "hi" ? "LPG कंज्यूमर नंबर / मोबाइल" : "LPG Consumer / Registered Mobile")
                    : type === "fastag"
                    ? (lang === "hi" ? "वाहन रजिस्ट्रेशन नंबर (Vehicle No.)" : "Vehicle Registration Number")
                    : (lang === "hi" ? "खाता संख्या / कार्ड नंबर" : "Account Number / Card Details")}
                </label>
                <div className="relative">
                  <input
                    type={type === "mobile" ? "tel" : "text"}
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder={
                      type === "mobile" 
                        ? "9294899787" 
                        : type === "electricity"
                        ? "N123456789 (मध्य क्षेत्र / पश्चिम क्षेत्र)"
                        : type === "fastag"
                        ? "MP04AB1234"
                        : "Enter account / consumer ID"
                    }
                    required
                    maxLength={type === "mobile" ? 10 : 20}
                    className="w-full px-4 py-3.5 rounded-2xl border border-white/15 bg-navy-950 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-saffron-500 font-mono text-base"
                  />
                  {type === "mobile" && number.length === 10 && (
                    <span className="absolute right-4 top-3.5 text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {lang === "hi" ? "वैध नंबर" : "Valid"}
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile Operator Plans Browser */}
              {type === "mobile" && plans.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-saffron-300">
                      {lang === "hi" ? `लोकप्रिय ${provider.toUpperCase()} रिचार्ज प्लान्स (क्लिक करके चुनें):` : `Popular ${provider.toUpperCase()} Plans (Click to Select):`}
                    </span>
                    {loadingPlans && <Loader2 className="w-4 h-4 animate-spin text-saffron-400" />}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                    {plans.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPlan(p)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                          amount === String(p.amount)
                            ? "border-saffron-500 bg-saffron-500/20 shadow-md"
                            : "border-white/10 bg-navy-950/70 hover:border-saffron-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base font-extrabold text-saffron-400">₹{p.amount}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/90">{p.validity}</span>
                        </div>
                        <div className="text-xs font-semibold text-white mt-1">{p.name} • {p.data}</div>
                        <div className="text-[11px] text-white/60 line-clamp-1 mt-0.5">{p.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-semibold text-saffron-200 mb-2">
                  {lang === "hi" ? "भुगतान राशि (₹)" : "Payment Amount (₹)"}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-lg font-bold text-saffron-400">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setSelectedPlanDesc("");
                    }}
                    placeholder="299"
                    min="10"
                    max="50000"
                    required
                    className="w-full pl-9 pr-4 py-3.5 rounded-2xl border border-white/15 bg-navy-950 text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
                {selectedPlanDesc && (
                  <p className="text-xs text-saffron-300 mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {selectedPlanDesc}
                  </p>
                )}
              </div>

              {/* Trust Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-navy-950/50 rounded-xl border border-white/5 text-xs text-saffron-200/80">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-saffron-400" /> {lang === "hi" ? "Razorpay payment confirmation" : "Razorpay Payment Confirmation"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" /> {lang === "hi" ? "100% सुरक्षित भुगतान" : "100% Encrypted"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-saffron-400" /> 24x7 Digital Seva
                </span>
              </div>

              {pendingPayment ? (
                <div className="space-y-3">
                  <p className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-100">
                    Razorpay payment verified hone ke baad payment record banega. Actual operator recharge / BBPS fulfilment API abhi configured nahi hai; service execution pending manual confirmation rahega.
                  </p>
                  <RazorpayPayButton
                    amount={pendingPayment.amount}
                    purpose={pendingPayment.purpose}
                    type={pendingPayment.paymentType}
                    metadata={{
                      serviceType: type,
                      targetNumber: pendingPayment.targetNumber,
                      provider: pendingPayment.provider,
                      plan: pendingPayment.description,
                      fulfilmentStatus: "pending_manual_processing"
                    }}
                    className="w-full py-4 bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-500 hover:to-saffron-400 text-white font-bold text-base rounded-2xl shadow-xl transition flex items-center justify-center gap-2"
                    label={"Razorpay से ₹" + pendingPayment.amount + " भुगतान करें"}
                    onSuccess={(payment) => {
                      setReceipt({
                        receiptNumber: payment?.paymentId || "Verified",
                        type: pendingPayment.description,
                        targetNumber: pendingPayment.targetNumber,
                        provider: pendingPayment.provider,
                        amount: pendingPayment.amount,
                        timestamp: new Date().toISOString(),
                        status: "PAYMENT_VERIFIED_PENDING_FULFILMENT"
                      });
                      setPendingPayment(null);
                      showToast("success", "Razorpay payment verified. Service fulfilment is pending.");
                    }}
                  />
                  <button type="button" onClick={() => setPendingPayment(null)} className="w-full rounded-xl border border-white/20 py-2 text-xs text-white">विवरण बदलें</button>
                </div>
              ) : (
                <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-500 hover:to-saffron-400 text-white font-bold text-base rounded-2xl shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                  <span>{lang === "hi" ? "आगे बढ़ें — ₹" + (amount || "0") : "Continue — ₹" + (amount || "0")}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </form>
          </div>

          {/* Real Digital Tax Receipt Modal */}
          {receipt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white text-navy-950 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border-4 border-emerald-500">
                <button
                  onClick={() => setReceipt(null)}
                  className="absolute top-4 right-4 p-2 text-navy-400 hover:text-navy-900 rounded-full hover:bg-navy-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center pb-4 border-b border-navy-100">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-navy-950">
                    {lang === "hi" ? "भुगतान सत्यापित — सेवा प्रक्रिया बाकी" : "Payment Verified — Service Processing Pending"}
                  </h3>
                  <p className="text-xs text-amber-700 font-medium mt-1">
                    Razorpay payment received. Actual recharge / bill posting is not connected to a live operator API yet.
                  </p>
                </div>

                {/* Receipt Details Table */}
                <div className="my-5 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between py-1 border-b border-navy-50">
                    <span className="text-navy-500">{lang === "hi" ? "रसीद क्रमांक" : "Receipt No."}</span>
                    <span className="font-mono font-bold text-navy-950">{receipt.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-navy-50">
                    <span className="text-navy-500">{lang === "hi" ? "सेवा प्रकार" : "Service"}</span>
                    <span className="font-bold text-navy-950">{receipt.type}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-navy-50">
                    <span className="text-navy-500">{lang === "hi" ? "मोबाइल / खाता संख्या" : "Account/Mobile"}</span>
                    <span className="font-mono font-bold text-navy-950">{receipt.targetNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-navy-50">
                    <span className="text-navy-500">{lang === "hi" ? "ऑपरेटर / बोर्ड" : "Operator/Biller"}</span>
                    <span className="font-semibold text-navy-950">{receipt.provider}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-navy-50">
                    <span className="text-navy-500">Payment status</span>
                    <span className="font-bold text-amber-700">Verified — Fulfilment pending</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-navy-50">
                    <span className="text-navy-500">{lang === "hi" ? "दिनांक एवं समय" : "Date & Time"}</span>
                    <span className="font-medium text-navy-950">{new Date(receipt.timestamp).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-2 bg-emerald-50 px-3 rounded-xl">
                    <span className="font-bold text-emerald-900">{lang === "hi" ? "कुल भुगतान राशि" : "Total Amount Paid"}</span>
                    <span className="text-lg font-black text-emerald-700">₹{receipt.amount}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 px-4 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{lang === "hi" ? "रसीद प्रिंट करें" : "Print Receipt"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setReceipt(null);
                      setAmount("");
                      setNumber("");
                    }}
                    className="flex-1 py-3 px-4 bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{lang === "hi" ? "नया रिचार्ज" : "New Recharge"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Script from "next/script";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

declare global {
  interface Window { Razorpay?: new (options: Record<string, any>) => { open: () => void }; }
}

export default function RazorpayPaymentPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("Service payment");
  const [busy, setBusy] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error" | "info">("info");

  async function startPayment(event: React.FormEvent) {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 1 || value > 500000) {
      setTone("error"); setMessage("₹1 से ₹5,00,000 के बीच सही राशि दर्ज करें।"); return;
    }
    if (!user) {
      setTone("error"); setMessage("Online payment के लिए पहले Login करें।"); return;
    }
    if (!window.Razorpay || !scriptReady) {
      setTone("error"); setMessage("Payment window अभी load नहीं हुई। कृपया दोबारा कोशिश करें।"); return;
    }

    setBusy(true); setMessage("");
    try {
      const response = await api.post("/payments/create-order", {
        amount: value, currency: "INR", gateway: "razorpay", type: "service_application"
      });
      const order = response.data?.data;
      if (!order?.orderId || !order?.key || !order?.paymentId) throw new Error("Razorpay order response अधूरा है।");

      const checkout = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Pradhan Digital Services",
        description: purpose,
        order_id: order.orderId,
        image: "/logo.png",
        theme: { color: "#0A1B4D" },
        handler: async (result: Record<string, string>) => {
          try {
            await api.post("/payments/verify", { paymentId: order.paymentId, gateway: "razorpay", ...result });
            setTone("success");
            setMessage("भुगतान Razorpay से सफलतापूर्वक verify हो गया।");
            setAmount("");
          } catch (error: any) {
            setTone("error");
            setMessage(error?.response?.data?.message || "Payment confirmation नहीं हो पाई। कृपया Payment History जांचें।");
          }
        },
        modal: {
          ondismiss: () => {
            setBusy(false); setTone("info");
            setMessage("Payment window बंद हुई। अगर राशि कट गई है, तो दोबारा भुगतान करने से पहले Payment History जांचें।");
          }
        }
      });
      checkout.open();
      setBusy(false);
    } catch (error: any) {
      setTone("error");
      setMessage(error?.response?.data?.message || error?.message || "Razorpay order नहीं बन पाया।");
      setBusy(false);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setScriptReady(true)} onError={() => { setScriptReady(false); setTone("error"); setMessage("Razorpay Checkout load नहीं हो पाया।"); }} />
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-white px-4 py-10 dark:from-[#142b58] dark:via-[#07132f] dark:to-[#050b1b]">
        <div className="mx-auto max-w-3xl">
          <Link href="/dashboard" className="mb-6 inline-flex text-sm font-semibold text-blue-800 hover:underline dark:text-blue-200">← Dashboard पर वापस</Link>
          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-2xl shadow-blue-950/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/90">
            <div className="bg-gradient-to-r from-[#0A1B4D] to-[#163b7a] px-6 py-8 text-white sm:px-9">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide"><span className="h-2 w-2 rounded-full bg-emerald-400" /> SECURE ONLINE PAYMENT</div>
              <h1 className="text-3xl font-black sm:text-4xl">Pay securely with Razorpay</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">UPI, Debit/Credit Card, Netbanking और उपलब्ध payment methods से भुगतान करें। Payment confirmation Razorpay server verification और webhook से होगी।</p>
            </div>
            <div className="grid gap-8 p-6 sm:grid-cols-[1fr_0.85fr] sm:p-9">
              <form onSubmit={startPayment} className="space-y-5">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-100">Payment amount (₹)
                  <input required type="number" min="1" max="500000" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="जैसे 500" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-xl font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-800" />
                </label>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-100">Payment purpose
                  <input maxLength={120} value={purpose} onChange={e=>setPurpose(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-800" />
                </label>
                <button type="submit" disabled={busy || !scriptReady} className="w-full rounded-2xl bg-orange-500 px-5 py-4 font-extrabold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">
                  {busy ? "Please wait…" : !scriptReady ? "Loading secure checkout…" : "Continue to secure payment"}
                </button>
                {!user && <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">भुगतान शुरू करने के लिए Login आवश्यक है।</p>}
                {message && <p role="status" className={`rounded-xl p-3 text-sm font-medium ${tone === "success" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200" : tone === "error" ? "bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-200" : "bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200"}`}>{message}</p>}
              </form>
              <aside className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/70">
                <h2 className="font-extrabold text-slate-900 dark:text-white">आपका भुगतान सुरक्षित है</h2>
                <ul className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex gap-3"><span className="text-emerald-600">✓</span><span>Razorpay hosted checkout पर payment details process होती हैं।</span></li>
                  <li className="flex gap-3"><span className="text-emerald-600">✓</span><span>Server payment signature, order और amount verify करता है।</span></li>
                  <li className="flex gap-3"><span className="text-emerald-600">✓</span><span>Webhook से captured payment की अतिरिक्त पुष्टि होती है।</span></li>
                  <li className="flex gap-3"><span className="text-emerald-600">✓</span><span>Payment status Dashboard में देख सकते हैं।</span></li>
                </ul>
                <div className="mt-6 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400">अगर राशि कटे लेकिन confirmation न मिले, तो दोबारा भुगतान करने से पहले सहायता लें।</div>
                <Link href="/payment/upi" className="mt-4 inline-block text-sm font-bold text-blue-700 hover:underline dark:text-blue-300">Direct UPI QR से भुगतान करें →</Link>
              </aside>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

"use client";

import { useState } from "react";
import { CreditCard, Copy, Loader2, QrCode, ExternalLink, ShieldCheck } from "lucide-react";
import { paymentApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  amount: number;
  purpose: string;
  type?: "service_application" | "form_download" | "recharge" | "bill_payment" | "wallet_topup" | "membership";
  applicationId?: string;
  metadata?: Record<string, string>;
  disabled?: boolean;
  className?: string;
  label?: string;
  onSuccess?: (payment: any) => void | Promise<void>;
  onError?: (message: string) => void;
};

async function loadRazorpayCheckout(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if ((window as any).Razorpay) return true;

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(Boolean((window as any).Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayPayButton({
  amount, purpose, type = "service_application", applicationId, metadata,
  disabled = false, className = "", label = "Direct UPI से भुगतान करें",
  onSuccess, onError
}: Props) {
  const { user, isReady, isAuthenticated } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [upi, setUpi] = useState<any>(null);
  const [utr, setUtr] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [verified, setVerified] = useState(false);
  const [razorpayVerified, setRazorpayVerified] = useState(false);

  function requireApplication(): boolean {
    if (!applicationId) {
      const message = "भुगतान केवल सेव की गई service application के लिए उपलब्ध है।";
      setError(message);
      onError?.(message);
      return false;
    }
    return true;
  }

  function requireLogin(): boolean {
    if (!isReady || !isAuthenticated) {
      const next = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(next)}`;
      return false;
    }
    return true;
  }

  function validateAmount(): boolean {
    if (!Number.isFinite(amount) || amount < 1 || amount > 500000) {
      const message = "कृपया ₹1 से ₹5,00,000 के बीच सही राशि दर्ज करें।";
      setError(message);
      onError?.(message);
      return false;
    }
    return true;
  }

  async function startRazorpay() {
    if (busy || disabled || !requireLogin() || !requireApplication() || !validateAmount()) return;
    setBusy(true);
    setError("");
    try {
      const loaded = await loadRazorpayCheckout();
      if (!loaded) throw new Error("Razorpay Checkout लोड नहीं हो पाया। कृपया इंटरनेट कनेक्शन जाँचें।");

      const created = await paymentApi.createOrder({
        amount, purpose, type, applicationId, metadata
      });
      const order = created.data?.data;
      if (!order?.orderId || !order?.paymentId || !order?.key) {
        throw new Error("Payment order अधूरा मिला। कृपया दोबारा प्रयास करें।");
      }

      const Razorpay = (window as any).Razorpay;
      const checkout = new Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Pradhan Digital Services",
        description: purpose,
        order_id: order.orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || ""
        },
        theme: { color: "#FF7A00" },
        modal: {
          ondismiss: () => setError("भुगतान प्रक्रिया बंद कर दी गई। कोई payment success confirm नहीं हुआ।")
        },
        handler: async (response: any) => {
          setBusy(true);
          setError("");
          try {
            const verifiedResponse = await paymentApi.verifyPayment({
              paymentId: order.paymentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            setRazorpayVerified(true);
            await onSuccess?.(verifiedResponse.data?.data || {
              paymentId: order.paymentId,
              gatewayPaymentId: response.razorpay_payment_id,
              status: "completed"
            });
          } catch (verificationError: any) {
            const message = verificationError?.response?.data?.message ||
              "Payment gateway confirmation verify नहीं हो पाया। कृपया दोबारा भुगतान न करें और सहायता लें।";
            setError(message);
            onError?.(message);
          } finally {
            setBusy(false);
          }
        }
      });

      checkout.on("payment.failed", (event: any) => {
        const message = event?.error?.description || "Razorpay payment failed. कृपया payment status जाँचें।";
        setError(message);
        onError?.(message);
      });
      checkout.open();
    } catch (paymentError: any) {
      const message = paymentError?.response?.data?.message || paymentError?.message || "Razorpay payment शुरू नहीं हो पाया।";
      setError(message);
      onError?.(message);
    } finally {
      setBusy(false);
    }
  }

  async function startUpiPayment() {
    if (busy || disabled || !requireLogin() || !requireApplication() || !validateAmount()) return;
    setBusy(true);
    setError("");
    try {
      const response = await paymentApi.createUpiPayment({ amount, purpose, type, applicationId, metadata });
      setUpi(response.data?.data);
      setUtr("");
      setSubmitted(false);
      setVerified(false);
    } catch (e: any) {
      const message = e?.response?.data?.message || "Direct UPI payment शुरू नहीं हो पाया।";
      setError(message);
      onError?.(message);
    } finally {
      setBusy(false);
    }
  }

  async function submitUtr() {
    if (!upi?.paymentId || !/^[A-Za-z0-9]{8,20}$/.test(utr.trim())) {
      setError("कृपया 8–20 अक्षरों का सही UTR / UPI Transaction ID दर्ज करें.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await paymentApi.submitUpiUtr({ paymentId: upi.paymentId, utr: utr.trim() });
      setSubmitted(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || "UTR जमा नहीं हो पाया।");
    } finally {
      setBusy(false);
    }
  }

  async function checkStatus() {
    if (!upi?.paymentId) return;
    setBusy(true);
    setError("");
    try {
      const response = await paymentApi.getMyUpiPayments();
      const item = (response.data?.data || []).find((p: any) => p.paymentId === upi.paymentId);
      if (item?.status === "completed") {
        setVerified(true);
        await onSuccess?.(item);
      } else if (item?.status === "failed") {
        setSubmitted(false);
        setError("भुगतान दावा Admin द्वारा अस्वीकार किया गया है। बैंक विवरण जाँचकर सहायता लें।");
      } else {
        setSubmitted(true);
        setError("भुगतान अभी Admin verification की प्रतीक्षा में है।");
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || "Payment status नहीं मिल पाया।");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      {!upi && !razorpayVerified && (
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={startRazorpay} disabled={disabled || busy}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1B4D] px-4 py-3 font-bold text-white shadow-sm hover:bg-[#142d70] disabled:cursor-not-allowed disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
            {busy ? "सुरक्षित भुगतान तैयार हो रहा है…" : "Razorpay से भुगतान"}
          </button>
          <button type="button" onClick={startUpiPayment} disabled={disabled || busy}
            className={`${className} inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50`}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
            {label}
          </button>
        </div>
      )}
      {error && <p role="alert" className="rounded-lg bg-red-50 p-2 text-xs text-red-700">{error}</p>}
      {razorpayVerified && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
          <ShieldCheck className="mr-2 inline h-4 w-4" /> Razorpay payment gateway से भुगतान सत्यापित हो गया।
        </div>
      )}
      {upi && <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-white">
        <div className="flex items-center gap-2 font-bold"><QrCode className="h-5 w-5 text-orange-500"/> Direct UPI Payment</div>
        <p className="mt-2 text-sm">राशि: <b>₹{Number(upi.amount).toFixed(2)}</b></p>
        <p className="text-sm">UPI ID: <b>{upi.upiId}</b></p>
        <p className="text-xs text-slate-500">Payment Ref: {upi.paymentId}</p>
        <img src={upi.qrUrl} alt="UPI payment QR code" className="mx-auto my-3 h-56 w-56 rounded-lg border p-2" />
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => { navigator.clipboard?.writeText(upi.upiId); }} className="rounded-lg border px-3 py-2 text-xs font-bold"><Copy className="mr-1 inline h-3 w-3"/>Copy UPI ID</button>
          <a href={upi.upiUri} className="rounded-lg bg-orange-500 px-3 py-2 text-center text-xs font-bold text-white"><ExternalLink className="mr-1 inline h-3 w-3"/>Open UPI App</a>
        </div>
        {!submitted && !verified && <div className="mt-4 space-y-2">
          <label className="block text-sm font-semibold">भुगतान के बाद UTR / Transaction ID
            <input value={utr} onChange={e=>setUtr(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,20))} minLength={8} maxLength={20} placeholder="UPI transaction reference" className="mt-1 w-full rounded-lg border p-3 text-sm dark:bg-slate-800"/>
          </label>
          <button type="button" onClick={submitUtr} disabled={busy} className="w-full rounded-lg bg-[#0A1B4D] p-3 text-sm font-bold text-white disabled:opacity-50">{busy?"जमा हो रहा है…":"UTR जमा करें"}</button>
        </div>}
        {submitted && !verified && <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">UTR प्राप्त हुआ। बैंक में वास्तविक क्रेडिट जाँचने के बाद Admin भुगतान approve करेगा। अभी इसे Successful न मानें।</div>}
        {verified && <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm font-bold text-emerald-800">Payment Successful – Admin verified</div>}
        {submitted && !verified && <button type="button" onClick={checkStatus} disabled={busy} className="mt-3 w-full rounded-lg border p-3 text-sm font-bold">{busy?"जाँच रहे हैं…":"Payment Status Refresh करें"}</button>}
      </div>}
    </div>
  );
}

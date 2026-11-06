"use client";

import { useState } from "react";
import { CreditCard, Copy, Loader2, QrCode, ExternalLink } from "lucide-react";
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

export default function RazorpayPayButton({
  amount, purpose, type = "service_application", applicationId, metadata,
  disabled = false, className = "", label = "Direct UPI से भुगतान करें",
  onSuccess, onError
}: Props) {
  const { isReady, isAuthenticated } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [upi, setUpi] = useState<any>(null);
  const [utr, setUtr] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [verified, setVerified] = useState(false);

  async function startPayment() {
    if (busy || disabled) return;
    if (!isReady || !isAuthenticated) {
      const next = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(next)}`;
      return;
    }
    if (!applicationId) {
      const message = "भुगतान केवल सेव की गई service application के लिए उपलब्ध है। Recharge, bill, wallet या सामान्य payment अभी enabled नहीं है।";
      setError(message); onError?.(message); return;
    }
    if (!Number.isFinite(amount) || amount < 1 || amount > 500000) {
      const message = "कृपया ₹1 से ₹5,00,000 के बीच सही राशि दर्ज करें।";
      setError(message); onError?.(message); return;
    }
    setBusy(true); setError("");
    try {
      const response = await paymentApi.createUpiPayment({ amount, purpose, type, applicationId, metadata });
      setUpi(response.data?.data);
      setUtr(""); setSubmitted(false); setVerified(false);
    } catch (e: any) {
      const message = e?.response?.data?.message || "Direct UPI payment शुरू नहीं हो पाया।";
      setError(message); onError?.(message);
    } finally { setBusy(false); }
  }

  async function submitUtr() {
    if (!upi?.paymentId || !/^[A-Za-z0-9]{8,20}$/.test(utr.trim())) {
      setError("कृपया 8–20 अक्षरों का सही UTR / UPI Transaction ID दर्ज करें।"); return;
    }
    setBusy(true); setError("");
    try {
      await paymentApi.submitUpiUtr({ paymentId: upi.paymentId, utr: utr.trim() });
      setSubmitted(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || "UTR जमा नहीं हो पाया।");
    } finally { setBusy(false); }
  }

  async function checkStatus() {
    if (!upi?.paymentId) return;
    setBusy(true); setError("");
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
    } catch (e: any) { setError(e?.response?.data?.message || "Payment status नहीं मिल पाया।"); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-3">
      {!upi && <button type="button" onClick={startPayment} disabled={disabled || busy}
        className={`${className} disabled:cursor-not-allowed disabled:opacity-50`}>
        {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> UPI QR तैयार हो रहा है…</> : <><CreditCard className="h-4 w-4" /> {label}</>}
      </button>}
      {error && <p role="alert" className="rounded-lg bg-red-50 p-2 text-xs text-red-700">{error}</p>}
      {upi && <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-white">
        <div className="flex items-center gap-2 font-bold"><QrCode className="h-5 w-5 text-orange-500"/> Direct UPI Payment</div>
        <p className="mt-2 text-sm">राशि: <b>₹{Number(upi.amount).toFixed(2)}</b></p>
        <p className="text-sm">UPI ID: <b>{upi.upiId}</b></p>
        <p className="text-xs text-slate-500">Payment Ref: {upi.paymentId}</p>
        <img src={upi.qrUrl} alt="UPI payment QR code" className="mx-auto my-3 h-56 w-56 rounded-lg border p-2" />
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={()=>{navigator.clipboard?.writeText(upi.upiId)}} className="rounded-lg border px-3 py-2 text-xs font-bold"><Copy className="mr-1 inline h-3 w-3"/>Copy UPI ID</button>
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

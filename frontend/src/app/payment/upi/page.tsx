"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

type Payment = { paymentId: string; amount: number; status: string; metadata?: { utr?: string; verificationStatus?: string }; createdAt: string };

export default function DirectUpiPaymentPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("Service payment");
  const [payment, setPayment] = useState<any>(null);
  const [utr, setUtr] = useState("");
  const [history, setHistory] = useState<Payment[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadHistory() {
    try { const r = await api.get("/payments/upi/my"); setHistory(r.data.data || []); } catch { /* login/network feedback shown on actions */ }
  }
  useEffect(() => { if (user) loadHistory(); }, [user]);

  async function createPayment(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      const r = await api.post("/payments/upi/create", { amount: Number(amount), purpose });
      setPayment(r.data.data); setUtr("");
    } catch (err: any) { setMessage(err?.response?.data?.message || "Payment create nahi ho paya."); }
    finally { setBusy(false); }
  }
  async function submitUtr(e: React.FormEvent) {
    e.preventDefault(); if (!payment) return; setBusy(true); setMessage("");
    try {
      const r = await api.post("/payments/upi/submit-utr", { paymentId: payment.paymentId, utr });
      setMessage(r.data.message); setPayment(null); setAmount(""); await loadHistory();
    } catch (err: any) { setMessage(err?.response?.data?.message || "UTR submit nahi hua."); }
    finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-slate-50 dark:bg-[#07132f] px-4 py-8">
    <div className="mx-auto max-w-2xl space-y-6">
      <header><h1 className="text-2xl font-black text-slate-900 dark:text-white">Direct UPI Payment</h1><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">QR scan karke payment karein, phir UTR submit karein. Bank credit check ke baad admin payment approve karega.</p><Link href="/payment/razorpay" className="mt-3 inline-flex rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow">Pay Online with Razorpay →</Link></header>
      {!payment ? <form onSubmit={createPayment} className="rounded-2xl border bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 space-y-4">
        <label className="block text-sm font-semibold">Amount (₹)<input required type="number" min="1" max="500000" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} className="mt-1 w-full rounded-xl border p-3 dark:bg-slate-800" placeholder="Enter amount"/></label>
        <label className="block text-sm font-semibold">Payment purpose<input value={purpose} onChange={e=>setPurpose(e.target.value)} maxLength={160} className="mt-1 w-full rounded-xl border p-3 dark:bg-slate-800"/></label>
        <button disabled={busy} className="w-full rounded-xl bg-orange-500 p-3 font-bold text-white disabled:opacity-50">{busy ? "Please wait..." : "Generate UPI QR"}</button>
      </form> : <section className="rounded-2xl border bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
        <p className="text-sm text-slate-500">Payment ID: {payment.paymentId}</p><p className="my-2 text-3xl font-black">₹{Number(payment.amount).toFixed(2)}</p>
        <img src={payment.qrUrl} alt="UPI payment QR code" className="mx-auto h-64 w-64 rounded-xl border p-2"/>
        <p className="mt-3 font-bold">{payment.upiId}</p>
        <a href={payment.upiUri} className="mt-3 inline-block rounded-xl bg-green-600 px-5 py-3 font-bold text-white">Pay using UPI App</a>
        <p className="mt-3 text-xs text-slate-500">Payment karne ke baad UPI app/bank statement se UTR/Transaction Reference Number copy karein.</p>
        <form onSubmit={submitUtr} className="mt-5 space-y-3 text-left">
          <label className="block text-sm font-semibold">UTR / UPI Transaction ID<input required minLength={8} maxLength={20} value={utr} onChange={e=>setUtr(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,""))} className="mt-1 w-full rounded-xl border p-3 uppercase tracking-wider dark:bg-slate-800" placeholder="Enter 8–20 character UTR"/></label>
          <button disabled={busy} className="w-full rounded-xl bg-blue-700 p-3 font-bold text-white disabled:opacity-50">{busy ? "Submitting..." : "Submit UTR for Verification"}</button>
        </form>
        <button onClick={()=>setPayment(null)} className="mt-3 text-sm text-slate-500 underline">Cancel / create another payment</button>
      </section>}
      {message && <p role="status" className="rounded-xl bg-blue-50 p-3 text-sm text-blue-900">{message}</p>}
      <section className="rounded-2xl border bg-white p-5 dark:border-white/10 dark:bg-slate-900"><h2 className="mb-3 font-bold">My UPI Payment History</h2>
        {history.length===0 ? <p className="text-sm text-slate-500">No UPI payments yet.</p> : history.map(p=><div key={p.paymentId} className="flex flex-wrap items-center justify-between gap-2 border-t py-3 text-sm"><div><b>{p.paymentId}</b><p className="text-xs text-slate-500">{p.metadata?.utr ? "UTR: "+p.metadata.utr : "UTR not submitted"}</p></div><div className="text-right"><b>₹{p.amount}</b><p className="text-xs">{p.status==="completed" ? "Verified" : p.status==="failed" ? "Rejected" : p.metadata?.verificationStatus==="awaiting_admin_review" ? "Pending admin verification" : "Awaiting payment"}</p></div></div>)}
      </section>
      <p className="text-xs text-slate-500">Important: UTR submission is only a claim. Do not treat it as paid until the bank statement/merchant account is checked and an admin approves it.</p>
    </div>
  </main>;
}

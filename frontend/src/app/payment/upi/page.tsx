"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import DirectUpiPayButton from "@/components/payment/RazorpayPayButton";

export default function OnlinePaymentPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("Pradhan Digital Services payment");
  const [message, setMessage] = useState("");
  return <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-[#07132f]"><div className="mx-auto max-w-2xl space-y-6">
    <Link href="/dashboard" className="text-sm font-semibold text-blue-700 dark:text-blue-300">← Dashboard</Link>
    <header className="rounded-3xl bg-[#0A1B4D] p-6 text-white"><h1 className="text-2xl font-black">Direct UPI Payment</h1><p className="mt-1 text-sm text-blue-100">सीधे Pradhan Digital Services के बैंक UPI पर भुगतान करें। Razorpay checkout नहीं है।</p></header>
    <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <label className="block text-sm font-semibold">Amount (₹)<input required type="number" min="1" max="500000" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-slate-900 dark:bg-slate-800 dark:text-white" placeholder="Enter amount"/></label>
      <label className="mt-4 block text-sm font-semibold">Payment purpose<input value={purpose} onChange={e=>setPurpose(e.target.value)} maxLength={120} className="mt-1 w-full rounded-xl border p-3 text-slate-900 dark:bg-slate-800 dark:text-white"/></label>
      <div className="mt-5"><DirectUpiPayButton amount={Number(amount)} purpose={purpose} type="service_application" disabled={!user || !amount || Number(amount)<1} className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 p-3 font-bold text-white"/></div>
      {!user&&<p className="mt-3 text-sm text-amber-700">भुगतान के लिए पहले Login करें।</p>}
    </section>
    {message&&<p>{message}</p>}
  </div></main>;
}
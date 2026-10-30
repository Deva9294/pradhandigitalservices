"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { paymentApi } from "@/lib/api";
import RazorpayPayButton from "@/components/payment/RazorpayPayButton";

export default function OnlinePaymentPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("Pradhan Digital Services payment");
  const [message, setMessage] = useState("");
  const [payments, setPayments] = useState<any[]>([]);

  async function loadPayments() {
    try {
      const response = await paymentApi.getMyPayments();
      setPayments(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch {
      setPayments([]);
    }
  }

  useEffect(() => {
    if (user) loadPayments();
  }, [user?.id]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-[#07132f]">
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/dashboard" className="text-sm font-semibold text-blue-700 dark:text-blue-300">← Dashboard</Link>
        <header className="rounded-3xl bg-[#0A1B4D] p-6 text-white">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-300"><ShieldCheck className="h-4 w-4" /> SECURE RAZORPAY CHECKOUT</div>
          <h1 className="mt-2 text-2xl font-black">Online Payment</h1>
          <p className="mt-1 text-sm text-blue-100">UPI, Debit/Credit Card and Netbanking through Razorpay. Payment status is verified by the backend before it is marked successful.</p>
        </header>

        <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2 font-bold text-slate-900 dark:text-white"><CreditCard className="h-5 w-5 text-orange-500" /> Payment details</div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Amount (₹)
            <input required type="number" min="1" max="500000" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-slate-900 dark:border-white/10 dark:bg-slate-800 dark:text-white" placeholder="Enter amount" />
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">Payment purpose
            <input value={purpose} onChange={e=>setPurpose(e.target.value)} maxLength={120} className="mt-1 w-full rounded-xl border p-3 text-slate-900 dark:border-white/10 dark:bg-slate-800 dark:text-white" />
          </label>
          <div className="mt-5">
            <RazorpayPayButton
              amount={Number(amount)}
              purpose={purpose}
              type="service_application"
              disabled={!amount || Number(amount) < 1}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 p-3 font-bold text-white hover:bg-orange-600"
              label="Pay securely with Razorpay"
              onSuccess={async (payment) => {
                setMessage("Payment verified. Payment ID: " + (payment?.paymentId || "verified"));
                setAmount("");
                await loadPayments();
              }}
            />
          </div>
          {message && <p role="status" className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
        </section>

        <section className="rounded-2xl border bg-white p-5 dark:border-white/10 dark:bg-slate-900">
          <h2 className="mb-3 font-bold text-slate-900 dark:text-white">My Payment History</h2>
          {payments.length === 0 ? <p className="text-sm text-slate-500">No payments found.</p> : payments.map((payment) => (
            <div key={payment._id} className="flex flex-wrap items-center justify-between gap-2 border-t py-3 text-sm">
              <div><b className="text-slate-900 dark:text-white">{payment.paymentId}</b><p className="text-xs text-slate-500">{payment.metadata?.purpose || payment.type} • {payment.gateway}</p></div>
              <div className="text-right"><b className="text-slate-900 dark:text-white">₹{Number(payment.amount || 0).toFixed(2)}</b><p className="text-xs text-slate-500">{payment.status}</p></div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

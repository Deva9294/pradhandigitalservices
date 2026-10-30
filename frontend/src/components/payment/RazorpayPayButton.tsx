"use client";

import { useState } from "react";
import Script from "next/script";
import { CreditCard, Loader2 } from "lucide-react";
import { paymentApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, any>) => { open: () => void };
  }
}

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
  disabled = false, className = "", label = "Pay securely with Razorpay",
  onSuccess, onError
}: Props) {
  const { isReady, isAuthenticated } = useAuth();
  const [scriptReady, setScriptReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function startPayment() {
    if (busy || disabled) return;
    if (!isReady || !isAuthenticated) {
      const next = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(next)}`;
      return;
    }
    if (!Number.isFinite(amount) || amount < 1 || amount > 500000) {
      const message = "कृपया ₹1 से ₹5,00,000 के बीच सही राशि दर्ज करें।";
      setError(message); onError?.(message); return;
    }
    if (!scriptReady || !window.Razorpay) {
      const message = "Razorpay Checkout अभी load नहीं हुआ है।";
      setError(message); onError?.(message); return;
    }

    setBusy(true);
    setError("");
    try {
      const response = await paymentApi.createOrder({
        amount, purpose, type, applicationId, metadata
      });
      const order = response.data?.data;
      if (!order?.orderId || !order?.key || !order?.paymentId || !order?.amount) {
        throw new Error("Razorpay order response अधूरा है।");
      }

      const checkout = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Pradhan Digital Services",
        description: purpose,
        order_id: order.orderId,
        image: "/logo.png",
        theme: { color: "#0A1B4D" },
        handler: async (result: Record<string, string>) => {
          try {
            const verified = await paymentApi.verifyPayment({
              paymentId: order.paymentId,
              gateway: "razorpay",
              ...result
            });
            await onSuccess?.(verified.data?.data || verified.data);
          } catch (e: any) {
            const message = e?.response?.data?.message || "Payment confirmation नहीं मिली। दोबारा भुगतान करने से पहले Payment History जाँचें।";
            setError(message);
            onError?.(message);
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => setBusy(false)
        }
      });
      checkout.open();
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || "Razorpay payment शुरू नहीं हो पाया।";
      setError(message);
      onError?.(message);
      setBusy(false);
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onError={() => setError("Razorpay Checkout load नहीं हो पाया।")}
      />
      <div className="space-y-2">
        <button type="button" onClick={startPayment} disabled={disabled || busy || !scriptReady}
          className={`${className} disabled:cursor-not-allowed disabled:opacity-50`}>
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> भुगतान प्रक्रिया जारी है…</> :
            !scriptReady ? "Secure Checkout Loading…" :
            <><CreditCard className="h-4 w-4" /> {label}</>}
        </button>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-2 text-xs text-red-700">{error}</p>}
      </div>
    </>
  );
}

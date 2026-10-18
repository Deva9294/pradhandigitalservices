"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { applicationApi } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/common/Toast";
import { isValidIndianMobile, normalizeIndianMobile } from "@/lib/validation";

type TrackResult = {
  applicationId?: string;
  status?: string;
  service?: { name?: string };
  createdAt?: string;
  adminRemarks?: string;
};

export default function TrackApplicationPage() {
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [applicationId, setApplicationId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId.trim()) {
      showToast("error", lang === "hi" ? "आवेदन ID दर्ज करें" : "Enter an application ID");
      return;
    }
    if (!isValidIndianMobile(phone)) {
      showToast("error", lang === "hi" ? "वैध 10 अंकों का मोबाइल नंबर दर्ज करें" : "Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const { data } = await applicationApi.track(applicationId.trim(), normalizeIndianMobile(phone));
      setResult(data?.data ?? null);
      if (!data?.data) {
        showToast("error", lang === "hi" ? "आवेदन नहीं मिला" : "Application not found");
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (lang === "hi" ? "ट्रैकिंग विफल" : "Unable to track application");
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 overflow-x-hidden">
      <div className="container mx-auto px-4 py-10 max-w-xl">
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
          {lang === "hi" ? "आवेदन ट्रैक करें" : "Track Application"}
        </h1>
        <p className="text-navy-600 dark:text-navy-400 mb-8">
          {lang === "hi"
            ? "अपना आवेदन ID और पंजीकृत मोबाइल नंबर दर्ज करें।"
            : "Enter your application ID and registered mobile number."}
        </p>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-800 rounded-3xl p-6 space-y-4 shadow-xl" noValidate>
          <input
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            placeholder="Application ID"
            className="w-full px-4 py-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900"
            required
          />
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit mobile number"
            className="w-full px-4 py-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-saffron-600 text-white font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {lang === "hi" ? "ट्रैक करें" : "Track"}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-white dark:bg-navy-800 rounded-3xl p-6">
            <p className="font-semibold text-navy-900 dark:text-white">{result.service?.name || "Service"}</p>
            <p className="text-sm text-navy-600 dark:text-navy-300 mt-1">ID: {result.applicationId}</p>
            <p className="text-sm mt-2">Status: {result.status}</p>
            {result.createdAt && (
              <p className="text-xs text-navy-500 mt-2">{new Date(result.createdAt).toLocaleDateString()}</p>
            )}
            {result.adminRemarks && <p className="text-sm mt-3">{result.adminRemarks}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

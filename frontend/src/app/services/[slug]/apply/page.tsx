"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, CreditCard, FileText, Loader2, ShieldCheck, UploadCloud } from "lucide-react";
import api, { applicationApi, paymentApi, uploadApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, any>) => { open: () => void };
  }
}

type ServiceRecord = {
  _id: string;
  name: string;
  nameHi?: string;
  description?: string;
  governmentFee?: number;
  serviceCharge?: number;
  totalFee?: number;
  price?: number;
  requiredDocuments?: string[];
  requiredDocumentsHi?: string[];
};

export default function ServiceApplyPage() {
  const params = useParams<{ slug: string }>();
  const slug = String(params?.slug || "");
  const router = useRouter();
  const { user, isReady, isAuthenticated, isAdmin, isAgent } = useAuth();
  const [service, setService] = useState<ServiceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [applicant, setApplicant] = useState({
    name: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    fatherName: "",
    address: ""
  });
  const [extraDetails, setExtraDetails] = useState("");
  const total = useMemo(() => {
    if (!service) return 0;
    return Math.round(((Number(service.governmentFee) || 0) + (Number(service.serviceCharge ?? 50) || 0)) * 100) / 100;
  }, [service]);

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      const target = `/services/${encodeURIComponent(slug)}/apply`;
      router.replace(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }
    if (isAdmin || isAgent) {
      router.replace(isAdmin ? "/admin" : "/agent");
      return;
    }
    let cancelled = false;
    async function loadService() {
      try {
        setLoading(true);
        const response = await api.get(`/services/${encodeURIComponent(slug)}`);
        const record = response.data?.service;
        if (!record?._id) throw new Error("यह सेवा अभी ऑनलाइन आवेदन के लिए उपलब्ध नहीं है। कृपया सहायता टीम से संपर्क करें।");
        if (!cancelled) {
          setService(record);
          setApplicant((current) => ({
            ...current,
            name: user?.name || current.name,
            phone: user?.phone || current.phone,
            email: user?.email || current.email
          }));
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.response?.data?.message || e?.message || "Service load नहीं हो सकी।");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (slug) loadService();
    return () => { cancelled = true; };
  }, [slug, isReady, isAuthenticated, isAdmin, isAgent, router, user?.id, user?.name, user?.phone, user?.email]);

  function updateField(key: keyof typeof applicant, value: string) {
    setApplicant((current) => ({ ...current, [key]: value }));
  }

  async function submitApplication(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setInfo("");
    if (!service) return;
    if (!window.Razorpay || !scriptReady) {
      setError("Razorpay checkout अभी load नहीं हुआ है। थोड़ी देर बाद फिर कोशिश करें।");
      return;
    }
    if (files.length > 5) {
      setError("एक बार में अधिकतम 5 दस्तावेज़ अपलोड कर सकते हैं।");
      return;
    }
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      setError("हर दस्तावेज़ 5 MB से छोटा होना चाहिए।");
      return;
    }

    setBusy(true);
    try {
      const created = await applicationApi.create({
        serviceSlug: slug,
        applicantDetails: {
          name: applicant.name.trim(),
          phone: applicant.phone.replace(/\D/g, "").slice(-10),
          email: applicant.email.trim(),
          dateOfBirth: applicant.dateOfBirth || undefined,
          gender: applicant.gender || undefined,
          fatherName: applicant.fatherName.trim(),
          address: { line1: applicant.address.trim() }
        },
        serviceData: { additionalInformation: extraDetails.trim() }
      });
      const application = created.data?.data;
      if (!application?._id) throw new Error("Application draft save नहीं हो पाया।");

      if (files.length) {
        const uploaded = await uploadApi.multiple(files);
        const urls: string[] = uploaded.data?.fileUrls || [];
        if (urls.length !== files.length) throw new Error("सभी दस्तावेज़ upload नहीं हो पाए।");
        await applicationApi.attachDocuments(application._id, urls.map((fileUrl, index) => ({
          fileUrl,
          fileName: files[index].name,
          documentType: service.requiredDocuments?.[index] || "Supporting Document"
        })));
      }

      const orderResponse = await paymentApi.createOrder({
        amount: total,
        purpose: `${service.name} application`,
        type: "service_application",
        applicationId: application._id
      });
      const order = orderResponse.data?.data;
      if (!order?.orderId || !order?.key || !order?.paymentId) {
        throw new Error("Razorpay order response अधूरा है।");
      }

      const checkout = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Pradhan Digital Services",
        description: `${service.name} application fee`,
        order_id: order.orderId,
        prefill: { name: applicant.name, email: applicant.email, contact: applicant.phone },
        theme: { color: "#0A1B4D" },
        handler: async (result: Record<string, string>) => {
          try {
            await paymentApi.verifyPayment({ paymentId: order.paymentId, gateway: "razorpay", ...result });
            setInfo("भुगतान सत्यापित हो गया है। आपका आवेदन सफलतापूर्वक जमा हो गया है।");
            router.replace("/dashboard");
          } catch (e: any) {
            setError(e?.response?.data?.message || "Payment confirmation अभी नहीं मिली। Payment History जाँचें; दोबारा भुगतान न करें।");
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
            setInfo("Payment window बंद हुई। आपका आवेदन draft में सुरक्षित है; भुगतान पूरा करने के लिए दोबारा कोशिश कर सकते हैं।");
          }
        }
      });
      checkout.open();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "आवेदन जमा नहीं हो पाया।");
      setBusy(false);
    }
  }

  if (!isReady || !isAuthenticated || isAdmin || isAgent || loading) {
    return <main className="min-h-screen flex items-center justify-center bg-slate-50 text-navy-800"><Loader2 className="mr-2 h-5 w-5 animate-spin" />आवेदन पेज तैयार हो रहा है…</main>;
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setScriptReady(true)} onError={() => setError("Razorpay Checkout load नहीं हो पाया।")} />
      <main className="min-h-screen bg-slate-50 dark:bg-navy-950 px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-5">
          <Link href={`/services/${slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-white"><ArrowLeft className="h-4 w-4" /> सेवा विवरण पर वापस</Link>
          <header className="rounded-3xl bg-[#0A1B4D] p-6 text-white">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-300"><ShieldCheck className="h-4 w-4" /> सुरक्षित ऑनलाइन आवेदन</div>
            <h1 className="mt-2 text-2xl font-black">{service?.nameHi || service?.name || "Service Application"}</h1>
            <p className="mt-1 text-sm text-blue-100">अपनी जानकारी भरें, जरूरी दस्तावेज़ जोड़ें और Razorpay से भुगतान करके आवेदन जमा करें।</p>
          </header>

          {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
          {info && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{info}</div>}

          <form onSubmit={submitApplication} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-navy-900 sm:p-7">
            <section className="space-y-4">
              <h2 className="font-extrabold text-navy-900 dark:text-white">आवेदक की जानकारी</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">पूरा नाम *
                  <input required minLength={2} value={applicant.name} onChange={e=>updateField("name",e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-slate-900 dark:border-white/10 dark:bg-navy-950 dark:text-white" />
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">मोबाइल नंबर *
                  <input required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={applicant.phone} onChange={e=>updateField("phone",e.target.value.replace(/\D/g,"").slice(-10))} className="mt-1 w-full rounded-xl border p-3 text-slate-900 dark:border-white/10 dark:bg-navy-950 dark:text-white" />
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">ईमेल
                  <input type="email" value={applicant.email} onChange={e=>updateField("email",e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-slate-900 dark:border-white/10 dark:bg-navy-950 dark:text-white" />
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">जन्म तिथि
                  <input type="date" value={applicant.dateOfBirth} onChange={e=>updateField("dateOfBirth",e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-slate-900 dark:border-white/10 dark:bg-navy-950 dark:text-white" />
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">पिता का नाम
                  <input value={applicant.fatherName} onChange={e=>updateField("fatherName",e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-slate-900 dark:border-white/10 dark:bg-navy-950 dark:text-white" />
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">लिंग
                  <select value={applicant.gender} onChange={e=>updateField("gender",e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-slate-900 dark:border-white/10 dark:bg-navy-950 dark:text-white">
                    <option value="">चुनें</option><option value="male">पुरुष</option><option value="female">महिला</option><option value="other">अन्य</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 sm:col-span-2">पता
                  <input value={applicant.address} onChange={e=>updateField("address",e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-slate-900 dark:border-white/10 dark:bg-navy-950 dark:text-white" />
                </label>
              </div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">अतिरिक्त जानकारी
                <textarea rows={3} value={extraDetails} onChange={e=>setExtraDetails(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-slate-900 dark:border-white/10 dark:bg-navy-950 dark:text-white" placeholder="सेवा से जुड़ी अन्य जानकारी (यदि हो)" />
              </label>
            </section>

            <section className="space-y-3 border-t border-slate-100 pt-5 dark:border-white/10">
              <h2 className="font-extrabold text-navy-900 dark:text-white flex items-center gap-2"><FileText className="h-5 w-5 text-orange-500" /> जरूरी दस्तावेज़</h2>
              {service?.requiredDocuments?.length ? <ul className="list-disc space-y-1 pl-5 text-xs text-slate-600 dark:text-slate-300">{service.requiredDocuments.map((doc,i)=><li key={i}>{doc}</li>)}</ul> : <p className="text-xs text-slate-500">इस सेवा के लिए दस्तावेज़ों की सूची उपलब्ध नहीं है।</p>}
              <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 p-5 text-center dark:border-white/20">
                <UploadCloud className="h-7 w-7 text-orange-500" />
                <span className="mt-2 text-sm font-bold text-navy-800 dark:text-white">दस्तावेज़ चुनें (अधिकतम 5 फाइल)</span>
                <span className="mt-1 text-xs text-slate-500">JPG, PNG, PDF, DOC, DOCX • प्रत्येक अधिकतम 5 MB</span>
                <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={e=>setFiles(Array.from(e.target.files || []).slice(0,5))} className="mt-3 max-w-full text-xs" />
              </label>
              {files.length > 0 && <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">{files.map((file,i)=><li key={i}>{file.name} — {(file.size/1024/1024).toFixed(2)} MB</li>)}</ul>}
            </section>

            <section className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-navy-950 sm:flex-row sm:items-center sm:justify-between">
              <div><div className="text-xs font-semibold text-slate-500">कुल देय राशि</div><div className="text-2xl font-black text-navy-900 dark:text-white">₹{total.toFixed(2)}</div><p className="text-[11px] text-slate-500">सरकारी शुल्क ₹{Number(service?.governmentFee || 0)} + सेवा शुल्क ₹{Number(service?.serviceCharge ?? 50)}</p></div>
              <div className="text-xs text-slate-500">Razorpay द्वारा UPI / Card / Netbanking</div>
            </section>

            <button type="submit" disabled={busy || !scriptReady || !service || total < 1} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-extrabold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
              {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> भुगतान प्रक्रिया जारी है…</> : <><CreditCard className="h-5 w-5" /> {scriptReady ? "Razorpay से भुगतान करें और आवेदन जमा करें" : "Secure payment load हो रहा है…"}</>}
            </button>
            <p className="text-center text-[11px] text-slate-500">आपका आवेदन भुगतान सत्यापित होने के बाद ही Customer Dashboard और Agent/Admin Work Queue में submitted दिखाई देगा।</p>
          </form>
        </div>
      </main>
    </>
  );
}

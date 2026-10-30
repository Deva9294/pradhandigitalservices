"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { 
  FileText, Clock, CheckCircle2, Wallet, 
  Settings, User, MessageSquare, ExternalLink, 
  Download, Truck, ShieldCheck, AlertCircle, 
  CreditCard, Sparkles, Filter, ChevronRight, 
  UploadCloud, RefreshCw, Eye
} from 'lucide-react';
import { applicationApi } from '@/lib/api';
import Footer from '@/components/layout/Footer';
import { whatsAppUrl, telSupportUrl } from '@/lib/utils';
import { 
  OnlineApplicationsIllustration, 
  PdfDownloadIllustration, 
  HomeDeliveryIllustration 
} from '@/components/ui/VectorIllustrations';

type TabType = 'requests' | 'documents' | 'deliveries' | 'payments' | 'membership';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('requests');
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        const res = await applicationApi.mine();
        if (cancelled) return;
        const records = Array.isArray(res.data?.data) ? res.data.data : [];
        const realApplications = records.map((record: any) => {
          const status = String(record.status || "submitted").toLowerCase();
          const serviceStage =
            status === "completed" ? "done" :
            ["documents_under_review", "processing"].includes(status) ? "review" :
            "submitted";
          const completedDoc = Array.isArray(record.completedDocuments)
            ? record.completedDocuments.find((doc: any) => doc?.url)
            : null;
          return {
            _id: record._id,
            applicationNumber: record.applicationId,
            serviceTitle: record.service?.name || "Service application",
            category: record.service?.category || "Service",
            createdAt: record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "—",
            serviceStage,
            paymentStatus: record.payment?.status || "pending",
            deliveryStatus: "not_requested",
            officialAcknowledgementNo: record.processingDetails?.referenceNumber || record.processingDetails?.applicationNumber || "",
            pdfUrl: completedDoc?.url || "",
            applicantName: record.applicantDetails?.name || user?.name || "",
            fee: record.payment?.totalAmount || 0
          };
        });
        setApplications(realApplications);
      } catch (error) {
        console.error("Unable to load customer applications:", error);
        if (!cancelled) setApplications([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    const interval = window.setInterval(loadData, 20000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [user?.id]);

  // Map any backend status into the EXACT 3 specified stages:
  // Submitted -> Review / Pending -> Done
  const getStageMeta = (status: string = 'submitted') => {
    const s = status.toLowerCase();
    if (s === 'done' || s === 'completed' || s === 'approved') {
      return {
        stage: 'done',
        labelEn: 'Done (Completed)',
        labelHi: 'पूर्ण (सत्यापित)',
        color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
      };
    }
    if (s === 'review' || s === 'pending' || s === 'processing' || s === 'documents_under_review') {
      return {
        stage: 'review',
        labelEn: 'Review / Pending',
        labelHi: 'समीक्षा / प्रक्रिया में',
        color: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      };
    }
    return {
      stage: 'submitted',
      labelEn: 'Submitted',
      labelHi: 'जमा किया गया',
      color: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
    };
  };

  const stats = {
    total: applications.length,
    submitted: applications.filter(a => (a.serviceStage || 'submitted') === 'submitted').length,
    review: applications.filter(a => (a.serviceStage || '') === 'review').length,
    done: applications.filter(a => (a.serviceStage || '') === 'done').length,
    deliveries: applications.filter(a => a.deliveryStatus === 'dispatched' || a.deliveryStatus === 'delivered').length,
    wallet: user?.walletBalance || 0
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] dark:bg-navy-950 text-navy-900 dark:text-white flex flex-col justify-between">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/15 text-saffron-600 dark:text-saffron-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "नागरिक डिजिटल खाता" : "Citizen Digital Account"}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === "hi" ? "ग्राहक डैशबोर्ड" : "Customer Dashboard"}
            </h1>
            <p className="text-xs md:text-sm text-navy-600 dark:text-saffron-200/80 mt-1">
              {lang === "hi" ? `नमस्ते, ${user?.name || 'नागरिक'}। आपके डिजिटल आवेदन, रसीदें और होम डिलीवरी स्थिति।` : `Welcome, ${user?.name || 'Citizen'}. Track your digital applications, receipts, and deliveries.`}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/payment/razorpay"
              className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs transition shadow flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "ऑनलाइन भुगतान" : "Pay Online"}</span>
            </Link>
            <Link
              href="/payment/upi"
              className="px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs transition shadow flex items-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "UPI भुगतान" : "Pay via UPI"}</span>
            </Link>
            <Link
              href="/services"
              className="px-4 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-navy-950 font-bold text-xs transition shadow flex items-center gap-1.5"
            >
              <span>{lang === "hi" ? "+ नया आवेदन करें" : "+ New Application"}</span>
            </Link>
            <a
              href={whatsAppUrl("नमस्ते, मुझे मेरे आवेदन के बारे में पूछताछ करनी है।")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "ऑपरेटर सहायता" : "Operator Desk"}</span>
            </a>
          </div>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm space-y-1">
            <span className="text-xs text-navy-500 dark:text-saffron-300 font-medium">
              {lang === "hi" ? "कुल आवेदन" : "Total Requests"}
            </span>
            <div className="text-2xl font-black text-navy-900 dark:text-white">{stats.total}</div>
            <div className="text-[11px] text-navy-400 dark:text-white/60">
              {stats.submitted} {lang === "hi" ? "नवीन सबमिट" : "recently submitted"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm space-y-1">
            <span className="text-xs text-amber-600 dark:text-amber-300 font-medium">
              {lang === "hi" ? "समीक्षा / प्रक्रिया में" : "Review / Pending"}
            </span>
            <div className="text-2xl font-black text-amber-500">{stats.review}</div>
            <div className="text-[11px] text-navy-400 dark:text-white/60">
              {lang === "hi" ? "ऑपरेटर द्वारा प्रक्रियाधीन" : "Under staff review"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm space-y-1">
            <span className="text-xs text-emerald-600 dark:text-emerald-300 font-medium">
              {lang === "hi" ? "पूर्ण एवं तैयार" : "Done (Ready)"}
            </span>
            <div className="text-2xl font-black text-emerald-500">{stats.done}</div>
            <div className="text-[11px] text-navy-400 dark:text-white/60">
              {lang === "hi" ? "PDF लॉकर में उपलब्ध" : "Available in PDF locker"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm space-y-1">
            <span className="text-xs text-blue-600 dark:text-blue-300 font-medium">
              {lang === "hi" ? "स्पीड पोस्ट डिलीवरी" : "Home Deliveries"}
            </span>
            <div className="text-2xl font-black text-blue-500">{stats.deliveries}</div>
            <div className="text-[11px] text-navy-400 dark:text-white/60">
              {lang === "hi" ? "ट्रैकिंग नंबर सहित प्रेषित" : "With India Post tracking"}
            </div>
          </div>
        </div>

        {/* 5 Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-navy-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
              activeTab === 'requests'
                ? "bg-saffron-500 text-navy-950 shadow-md"
                : "bg-white dark:bg-navy-900/60 text-navy-700 dark:text-saffron-200/80 border border-navy-200 dark:border-white/10"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{lang === "hi" ? "सेवा आवेदन (Service Requests)" : "Service Requests"}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10 dark:bg-white/10">
              {applications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
              activeTab === 'documents'
                ? "bg-saffron-500 text-navy-950 shadow-md"
                : "bg-white dark:bg-navy-900/60 text-navy-700 dark:text-saffron-200/80 border border-navy-200 dark:border-white/10"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>{lang === "hi" ? "दस्तावेज़ लॉकर (Final PDFs)" : "Document Locker (PDFs)"}</span>
          </button>

          <button
            onClick={() => setActiveTab('deliveries')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
              activeTab === 'deliveries'
                ? "bg-saffron-500 text-navy-950 shadow-md"
                : "bg-white dark:bg-navy-900/60 text-navy-700 dark:text-saffron-200/80 border border-navy-200 dark:border-white/10"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>{lang === "hi" ? "स्पीड पोस्ट ट्रैकिंग" : "Delivery Tracking"}</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
              activeTab === 'payments'
                ? "bg-saffron-500 text-navy-950 shadow-md"
                : "bg-white dark:bg-navy-900/60 text-navy-700 dark:text-saffron-200/80 border border-navy-200 dark:border-white/10"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{lang === "hi" ? "भुगतान इतिहास (Payments)" : "Payments"}</span>
          </button>

          <button
            onClick={() => setActiveTab('membership')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
              activeTab === 'membership'
                ? "bg-saffron-500 text-navy-950 shadow-md"
                : "bg-white dark:bg-navy-900/60 text-navy-700 dark:text-saffron-200/80 border border-navy-200 dark:border-white/10"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === "hi" ? "प्रीमियम सदस्यता (Membership)" : "Membership"}</span>
          </button>
        </div>

        {/* Tab 1: Service Requests with 3-Stage Progression */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {loading ? (
              <div className="p-10 text-center rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10">
                <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-3 text-saffron-500" />
                <p className="text-sm text-navy-600 dark:text-white/70">{lang === "hi" ? "आपके वास्तविक आवेदन लोड हो रहे हैं..." : "Loading your applications..."}</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="p-10 text-center rounded-2xl bg-white dark:bg-navy-900 border border-dashed border-navy-200 dark:border-white/15">
                <FileText className="w-12 h-12 mx-auto mb-3 text-navy-300 dark:text-white/30" />
                <h3 className="font-bold text-navy-900 dark:text-white">{lang === "hi" ? "अभी कोई सेवा आवेदन नहीं है" : "No service applications yet"}</h3>
                <p className="text-xs mt-2 text-navy-500 dark:text-white/60">{lang === "hi" ? "आप जो सेवा चुनकर आवेदन करेंगे, वही यहाँ दिखाई देगी।" : "Services you actually apply for will appear here."}</p>
                <Link href="/services" className="inline-flex mt-4 px-4 py-2 rounded-xl bg-saffron-500 text-navy-950 font-bold text-xs">{lang === "hi" ? "सेवाएँ देखें" : "Explore Services"}</Link>
              </div>
            ) : applications.map((app) => {
              const stageMeta = getStageMeta(app.serviceStage);
              return (
                <div
                  key={app._id}
                  className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm hover:border-saffron-400/50 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-mono font-bold text-saffron-600 dark:text-saffron-400">
                          {app.applicationNumber}
                        </span>
                        <span className="text-navy-400 dark:text-white/40">•</span>
                        <span className="text-navy-500 dark:text-white/70">{app.createdAt}</span>
                        <span className="text-navy-400 dark:text-white/40">•</span>
                        <span className="text-navy-500 dark:text-white/70">{app.category}</span>
                      </div>
                      <h3 className="text-base font-bold text-navy-900 dark:text-white">
                        {app.serviceTitle}
                      </h3>
                    </div>

                    {/* Status Badges Row (Service Stage, Payment, and Delivery shown SEPARATELY) */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Service Stage Badge: Submitted -> Review -> Done */}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${stageMeta.color}`}>
                        {lang === "hi" ? stageMeta.labelHi : stageMeta.labelEn}
                      </span>

                      {/* Payment Status Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        app.paymentStatus === 'paid' 
                          ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                      }`}>
                        {app.paymentStatus === 'paid' ? 'Payment: Paid' : 'Payment: Pending'}
                      </span>

                      {/* Delivery Status Badge */}
                      {app.deliveryStatus !== 'not_requested' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          <span>Delivery: {app.deliveryStatus}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3-Stage Visual Progression Line */}
                  <div className="p-3.5 rounded-xl bg-navy-50 dark:bg-navy-950/60 border border-navy-100 dark:border-white/5">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {/* Stage 1 */}
                      <div className="space-y-1">
                        <div className={`h-1.5 rounded-full ${
                          stageMeta.stage === 'submitted' || stageMeta.stage === 'review' || stageMeta.stage === 'done'
                            ? 'bg-saffron-500' : 'bg-navy-200 dark:bg-white/10'
                        }`} />
                        <span className="text-[11px] font-semibold text-navy-700 dark:text-white/90">
                          1. Submitted
                        </span>
                      </div>

                      {/* Stage 2 */}
                      <div className="space-y-1">
                        <div className={`h-1.5 rounded-full ${
                          stageMeta.stage === 'review' || stageMeta.stage === 'done'
                            ? 'bg-saffron-500' : 'bg-navy-200 dark:bg-white/10'
                        }`} />
                        <span className="text-[11px] font-semibold text-navy-700 dark:text-white/90">
                          2. Review / Pending
                        </span>
                      </div>

                      {/* Stage 3 */}
                      <div className="space-y-1">
                        <div className={`h-1.5 rounded-full ${
                          stageMeta.stage === 'done'
                            ? 'bg-emerald-500' : 'bg-navy-200 dark:bg-white/10'
                        }`} />
                        <span className="text-[11px] font-semibold text-navy-700 dark:text-white/90">
                          3. Done
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                    <div className="text-navy-500 dark:text-white/60">
                      {app.officialAcknowledgementNo && (
                        <span>Ack / Token: <strong className="text-navy-800 dark:text-white">{app.officialAcknowledgementNo}</strong></span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/track-application?id=${app.applicationNumber}`}
                        className="px-3 py-1.5 rounded-lg bg-navy-100 dark:bg-white/10 hover:bg-navy-200 dark:hover:bg-white/20 text-navy-900 dark:text-white font-medium transition"
                      >
                        {lang === "hi" ? "ट्रैकिंग विवरण" : "Full Timeline"}
                      </Link>

                      {app.pdfUrl && (
                        <a
                          href={app.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-saffron-500 hover:bg-saffron-400 text-navy-950 font-bold transition flex items-center gap-1 shadow"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{lang === "hi" ? "PDF डाउनलोड" : "Download PDF"}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Document Locker & Final PDFs */}
        {activeTab === 'documents' && (
          <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-navy-100 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-saffron-500" />
                  <span>{lang === "hi" ? "सुरक्षित डिजिटल दस्तावेज़ लॉकर" : "Secure Digital Document Locker"}</span>
                </h3>
                <p className="text-xs text-navy-500 dark:text-white/60 mt-0.5">
                  {lang === "hi" ? "आपके सभी डाउनलोड योग्य आधिकारिक प्रमाण पत्र एवं रसीदें।" : "Permanent storage for all your verified receipts and certificates."}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {applications.filter(a => a.pdfUrl).map((doc) => (
                <div key={doc._id} className="p-4 rounded-xl bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-navy-900 dark:text-white text-sm">{doc.serviceTitle}</span>
                    <div className="text-navy-500 dark:text-white/60">
                      Ref: {doc.applicationNumber} • Generated on {doc.createdAt}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={doc.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-saffron-500 hover:bg-saffron-400 text-navy-950 font-bold transition flex items-center gap-1 shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{lang === "hi" ? "सत्यापित PDF" : "Verified PDF"}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Physical Deliveries Tracking */}
        {activeTab === 'deliveries' && (
          <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-navy-100 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span>{lang === "hi" ? "स्पीड पोस्ट होम डिलीवरी ट्रैकिंग" : "Speed Post Physical Delivery Tracking"}</span>
                </h3>
                <p className="text-xs text-navy-500 dark:text-white/60 mt-0.5">
                  {lang === "hi" ? "इंडिया पोस्ट द्वारा आपके पते पर प्रेषित भौतिक दस्तावेज़।" : "Physical laminated cards & certificates dispatched to your doorstep."}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {applications.filter(a => a.deliveryStatus !== 'not_requested').map((deliv) => (
                <div key={deliv._id} className="p-4 rounded-xl bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-white/5 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-bold text-navy-900 dark:text-white text-sm">{deliv.serviceTitle}</span>
                    <span className="px-2.5 py-1 rounded-full font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase text-[10px]">
                      Status: {deliv.deliveryStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-navy-600 dark:text-white/80 pt-1">
                    <div>Courier Partner: <strong>{deliv.courierPartner || 'India Post'}</strong></div>
                    <div>Consignment No: <strong className="font-mono text-saffron-600 dark:text-saffron-400">{deliv.trackingNumber || 'Pending Dispatch'}</strong></div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={`https://www.indiapost.gov.in/_layouts/15/dptcpis.geonoo/tracking.aspx?articlenumber=${deliv.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-saffron-600 dark:text-saffron-400 font-semibold hover:underline"
                    >
                      <span>Track on India Post Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Payments History */}
        {activeTab === 'payments' && (
          <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2 border-b border-navy-100 dark:border-white/10 pb-3">
              <CreditCard className="w-5 h-5 text-emerald-500" />
              <span>{lang === "hi" ? "पारदर्शी भुगतान रिकॉर्ड" : "Transparent Payment History"}</span>
            </h3>

            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app._id} className="p-3.5 rounded-xl bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-navy-900 dark:text-white">{app.serviceTitle}</div>
                    <div className="text-[11px] text-navy-500 dark:text-white/60">Ref: {app.applicationNumber} • {app.createdAt}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-sm text-navy-900 dark:text-white">₹{app.fee || 50}</div>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Paid • Online</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Premium Membership Status */}
        {activeTab === 'membership' && (
          <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-navy-100 dark:border-white/10 pb-3">
              <div className="space-y-0.5">
                <span className="text-xs text-saffron-600 dark:text-saffron-400 font-bold uppercase tracking-wider">Current Membership</span>
                <h3 className="text-xl font-extrabold text-navy-900 dark:text-white">Citizen Standard Free</h3>
              </div>
              <Link
                href="/premium"
                className="px-4 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-navy-950 font-bold text-xs transition shadow"
              >
                {lang === "hi" ? "अपग्रेड करें (₹99 / माह)" : "Upgrade to Pro (₹99/mo)"}
              </Link>
            </div>

            <p className="text-xs text-navy-600 dark:text-white/80 leading-relaxed">
              Upgrade to PDS Annual Citizen Pro (₹499/year) to unlock Zero Service Fee on unlimited applications and 6 Free laminated Speed Post dispatches anywhere in India.
            </p>
          </div>
        )}
      </div>

      {/* Shared Compact Footer with Required DevaCore Studios Credit */}
      <Footer compact={true} />
    </div>
  );
}

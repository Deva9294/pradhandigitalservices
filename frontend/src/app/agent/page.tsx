"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, FileText, Wallet, Clock, CheckCircle2, 
  TrendingUp, Plus, Download, MessageSquare, User, 
  Search, Filter, ShieldCheck, AlertCircle, Phone, 
  ExternalLink, Eye, ArrowRight, Check, X, RefreshCw
} from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { applicationApi } from '@/lib/api';
import { whatsAppUrl, telSupportUrl } from '@/lib/utils';

export default function AgentDashboard() {
  const { user, isReady, isAuthenticated, isAdmin, isAgent, getRoleRedirect } = useAuth();
  const router = useRouter();
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'review' | 'done'>('all');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [ackInput, setAckInput] = useState('');
  const [workQueue, setWorkQueue] = useState<any[]>([]);
  const [loadError, setLoadError] = useState('');

  const loadWorkQueue = async () => {
    try {
      setLoading(true);
      const response = await applicationApi.workQueue();
      const records = Array.isArray(response.data?.data) ? response.data.data : [];
      setWorkQueue(records.map((record: any) => {
        const status = String(record.status || 'submitted').toLowerCase();
        const stage = status === 'completed' ? 'done' :
          ['documents_under_review', 'processing'].includes(status) ? 'review' : 'submitted';
        return {
          id: record._id,
          applicationNumber: record.applicationId,
          serviceTitle: record.service?.name || 'Service application',
          applicantName: record.applicantDetails?.name || record.user?.name || 'Applicant',
          phone: record.applicantDetails?.phone || record.user?.phone || '',
          submittedAt: record.processingDetails?.submittedAt || record.createdAt,
          deadline: record.processingDetails?.estimatedCompletionDate || null,
          priority: record.priority || 'normal',
          stage,
          status,
          paymentStatus: record.payment?.status || 'pending',
          documents: (record.documents || []).map((doc: any) => ({
            name: doc.fileName || doc.type || 'Uploaded document',
            status: doc.verified ? 'verified' : 'pending',
            url: doc.url
          })),
          officialAcknowledgementNo: record.processingDetails?.referenceNumber || record.processingDetails?.applicationNumber || ''
        };
      }));
      setLoadError('');
    } catch (error: any) {
      console.error('Unable to load operator work queue:', error);
      setLoadError(error?.response?.data?.message || 'Live work queue is unavailable. Please try again.');
      setWorkQueue([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (!isAgent) { router.replace(isAdmin ? '/admin' : '/dashboard'); return; }
    loadWorkQueue();
    const interval = window.setInterval(loadWorkQueue, 20000);
    return () => window.clearInterval(interval);
  }, [isReady, isAuthenticated, isAgent, isAdmin, router]);

  const filteredQueue = useMemo(() => {
    return workQueue.filter(item => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = item.applicantName.toLowerCase().includes(q);
        const matchApp = item.applicationNumber.toLowerCase().includes(q);
        const matchPhone = item.phone.includes(q);
        if (!matchName && !matchApp && !matchPhone) return false;
      }
      if (statusFilter !== 'all' && item.stage !== statusFilter) return false;
      return true;
    });
  }, [workQueue, search, statusFilter]);

  const handleMarkReview = async (id: string) => {
    try {
      await applicationApi.updateStatus(id, 'documents_under_review');
      setSelectedApp(null);
      await loadWorkQueue();
    } catch (error: any) {
      setLoadError(error?.response?.data?.message || 'Could not move this application to review.');
    }
  };

  const handleStartProcessing = async (id: string) => {
    try {
      await applicationApi.updateStatus(id, 'processing');
      setSelectedApp(null);
      await loadWorkQueue();
    } catch (error: any) {
      setLoadError(error?.response?.data?.message || 'Could not start processing this application.');
    }
  };

  const handleMarkDone = async (id: string) => {
    try {
      await applicationApi.updateStatus(id, 'completed', undefined, { referenceNumber: ackInput.trim() || undefined });
      setSelectedApp(null);
      setAckInput('');
      await loadWorkQueue();
    } catch (error: any) {
      setLoadError(error?.response?.data?.message || 'Could not complete this application.');
    }
  };

  const stats = {
    total: workQueue.length,
    submitted: workQueue.filter(q => q.stage === 'submitted').length,
    review: workQueue.filter(q => q.stage === 'review').length,
    done: workQueue.filter(q => q.stage === 'done').length
  };

  if (!isReady || !isAuthenticated || !isAgent) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-navy-700">Checking operator account…</div>;
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] dark:bg-navy-950 text-navy-900 dark:text-white flex flex-col justify-between">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/15 text-saffron-600 dark:text-saffron-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "ऑपरेटर एवं कर्मचारी वर्कस्पेस" : "Operator Work Queue"}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === "hi" ? "कर्मचारी डैशबोर्ड (Staff Dashboard)" : "Staff Work Queue"}
            </h1>
            <p className="text-xs md:text-sm text-navy-600 dark:text-saffron-200/80 mt-1">
              Process incoming customer applications, verify document standards, and record official acknowledgements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-navy-100 dark:bg-navy-800 text-navy-800 dark:text-white">
              Operator: {user?.name || "—"}
            </span>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm">
            <span className="text-xs text-navy-500 dark:text-saffron-300 font-medium">Active Queue</span>
            <div className="text-2xl font-black mt-1 text-navy-900 dark:text-white">{stats.total}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">1. New Submitted</span>
            <div className="text-2xl font-black mt-1 text-blue-500">{stats.submitted}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm">
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">2. Under Review</span>
            <div className="text-2xl font-black mt-1 text-amber-500">{stats.review}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">3. Completed / Done</span>
            <div className="text-2xl font-black mt-1 text-emerald-500">{stats.done}</div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-panel p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 dark:text-saffron-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applicant name, phone, ref..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-navy-200 dark:border-white/10 bg-navy-50 dark:bg-navy-950 text-navy-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-saffron-500 text-navy-950'
                  : 'bg-navy-100 dark:bg-white/10 text-navy-700 dark:text-white/80'
              }`}
            >
              All Stages ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('submitted')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === 'submitted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-navy-100 dark:bg-white/10 text-navy-700 dark:text-white/80'
              }`}
            >
              Submitted ({stats.submitted})
            </button>
            <button
              onClick={() => setStatusFilter('review')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === 'review'
                  ? 'bg-amber-500 text-navy-950'
                  : 'bg-navy-100 dark:bg-white/10 text-navy-700 dark:text-white/80'
              }`}
            >
              Review Queue ({stats.review})
            </button>
            <button
              onClick={() => setStatusFilter('done')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === 'done'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-navy-100 dark:bg-white/10 text-navy-700 dark:text-white/80'
              }`}
            >
              Done ({stats.done})
            </button>
          </div>
        </div>

        {/* Work Queue Table */}
        <div className="glass-panel rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-navy-50 dark:bg-navy-950 text-navy-700 dark:text-saffron-300 font-bold border-b border-navy-100 dark:border-white/10">
                  <th className="p-3.5">Ref & Service</th>
                  <th className="p-3.5">Applicant & Contact</th>
                  <th className="p-3.5">Submitted / Deadline</th>
                  <th className="p-3.5">Stage & Payment</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 dark:divide-white/5">
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-navy-500">Loading real applications…</td></tr>
                ) : filteredQueue.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-navy-500">
                    {loadError || 'No applications are currently assigned to you or waiting for an operator.'}
                  </td></tr>
                ) : filteredQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-navy-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3.5 max-w-xs">
                      <div className="font-mono font-bold text-saffron-600 dark:text-saffron-400">
                        {item.applicationNumber}
                      </div>
                      <div className="font-semibold text-navy-900 dark:text-white text-xs mt-0.5">
                        {item.serviceTitle}
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-bold text-navy-900 dark:text-white">{item.applicantName}</div>
                      <div className="flex items-center gap-1.5 text-navy-500 dark:text-white/70 text-[11px] mt-0.5">
                        <span>{item.phone}</span>
                        <a
                          href={whatsAppUrl(`नमस्ते ${item.applicantName}, आपके आवेदन ${item.applicationNumber} के संबंध में सूचना:`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-500 hover:text-emerald-400"
                          title="WhatsApp Candidate"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </a>
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="text-navy-700 dark:text-white/80">{item.submittedAt ? new Date(item.submittedAt).toLocaleString() : '—'}</div>
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                        Due: {item.deadline ? new Date(item.deadline).toLocaleString() : 'Not set'}
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.stage === 'done' 
                            ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : item.stage === 'review'
                            ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                            : 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                        }`}>
                          Stage: {item.stage}
                        </span>
                        <span className={`text-[10px] font-bold ${item.paymentStatus === 'paid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {item.paymentStatus}
                        </span>
                      </div>
                      {item.officialAcknowledgementNo && (
                        <div className="text-[10px] text-navy-500 dark:text-white/60 font-mono mt-1">
                          Ack: {item.officialAcknowledgementNo}
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => setSelectedApp(item)}
                        className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-xs font-semibold transition"
                      >
                        Process / View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Processing Modal Drawer */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-navy-900 border border-navy-200 dark:border-white/20 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-navy-100 dark:border-white/10 pb-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono font-bold text-saffron-600 dark:text-saffron-400">
                    {selectedApp.applicationNumber}
                  </span>
                  <h3 className="text-base font-bold text-navy-900 dark:text-white">
                    {selectedApp.serviceTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1 rounded-lg hover:bg-navy-100 dark:hover:bg-white/10 text-navy-500 dark:text-white/70"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Applicant Info */}
              <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-white/5">
                <div>Applicant: <strong>{selectedApp.applicantName}</strong></div>
                <div>Phone: <strong>{selectedApp.phone}</strong></div>
                <div>Current Stage: <strong className="uppercase">{selectedApp.stage}</strong></div>
                <div>Payment: <strong className="text-emerald-500 uppercase">{selectedApp.paymentStatus}</strong></div>
              </div>

              {/* Attached Documents Checklist */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-navy-900 dark:text-white">Uploaded Customer Documents:</span>
                <div className="space-y-1.5">
                  {(selectedApp.documents || []).length === 0 ? (
                    <p className="text-navy-500 dark:text-white/60">No documents uploaded for this application.</p>
                  ) : selectedApp.documents.map((d: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-navy-800 border border-navy-200 dark:border-white/5">
                      <span>{d.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real application reference saved to the backend */}
              <div className="space-y-2 pt-2 border-t border-navy-100 dark:border-white/10 text-xs">
                <label className="block font-medium text-navy-700 dark:text-white/90">
                  Official portal reference / acknowledgement number (optional)
                </label>
                <input
                  type="text"
                  value={ackInput}
                  onChange={(e) => setAckInput(e.target.value)}
                  placeholder="Enter the actual reference number"
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-white/10 bg-white dark:bg-navy-950 text-navy-900 dark:text-white text-xs"
                />
              </div>

              {/* Only valid backend status transitions are offered */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-navy-100 dark:border-white/10">
                {selectedApp.status === 'submitted' && (
                  <button onClick={() => handleMarkReview(selectedApp.id)} className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs">
                    Move to Review
                  </button>
                )}
                {selectedApp.status === 'documents_under_review' && (
                  <button onClick={() => handleStartProcessing(selectedApp.id)} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs">
                    Start Processing
                  </button>
                )}
                {selectedApp.status === 'processing' && (
                  <button onClick={() => handleMarkDone(selectedApp.id)} className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow">
                    <Check className="w-4 h-4" />
                    <span>Complete Application</span>
                  </button>
                )}
                {['completed', 'rejected', 'cancelled'].includes(selectedApp.status) && (
                  <span className="text-xs text-navy-500">This application is closed.</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shared Compact Footer with Required DevaCore Studios Credit */}
      <Footer compact={true} />
    </div>
  );
}

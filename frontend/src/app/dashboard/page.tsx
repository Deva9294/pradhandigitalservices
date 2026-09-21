"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { 
  FileText, Clock, CheckCircle, XCircle, Wallet, 
  Bell, Settings, User, Download, MessageCircle, ExternalLink 
} from 'lucide-react';
import api from '@/lib/api';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    completedApplications: 0,
    walletBalance: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [applicationsRes] = await Promise.all([
        api.get('/applications/my')
      ]);

      const applications = applicationsRes.data.data;
      
      setStats({
        totalApplications: applications.length,
        pendingApplications: applications.filter((a: any) => 
          ['submitted', 'documents_under_review', 'processing'].includes(a.status)
        ).length,
        completedApplications: applications.filter((a: any) => a.status === 'completed').length,
        walletBalance: user?.walletBalance || 0
      });

      setRecentApplications(applications.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'documents_under_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; hi: string }> = {
      draft: { en: 'Draft', hi: 'मसौदा' },
      submitted: { en: 'Submitted', hi: 'जमा किया गया' },
      documents_under_review: { en: 'Under Review', hi: 'समीक्षा में' },
      correction_required: { en: 'Correction Required', hi: 'सुधार आवश्यक' },
      processing: { en: 'Processing', hi: 'प्रसंस्करण में' },
      completed: { en: 'Completed', hi: 'पूर्ण' },
      rejected: { en: 'Rejected', hi: 'अस्वीकृत' },
      cancelled: { en: 'Cancelled', hi: 'रद्द' }
    };
    return labels[status]?.[lang] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
          {lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
        </h1>
        <p className="text-navy-600 dark:text-navy-300">
          {lang === 'hi' ? 'स्वागत है, ' : 'Welcome, '}{user?.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-navy-900 dark:text-white">
              {stats.totalApplications}
            </span>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-300">
            {lang === 'hi' ? 'कुल आवेदन' : 'Total Applications'}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-2xl font-bold text-navy-900 dark:text-white">
              {stats.pendingApplications}
            </span>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-300">
            {lang === 'hi' ? 'लंबित आवेदन' : 'Pending Applications'}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-2xl font-bold text-navy-900 dark:text-white">
              {stats.completedApplications}
            </span>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-300">
            {lang === 'hi' ? 'पूर्ण आवेदन' : 'Completed Applications'}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-saffron-100 dark:bg-saffron-900/30 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-saffron-600 dark:text-saffron-400" />
            </div>
            <span className="text-2xl font-bold text-navy-900 dark:text-white">
              ₹{stats.walletBalance.toFixed(0)}
            </span>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-300">
            {lang === 'hi' ? 'वॉलेट बैलेंस' : 'Wallet Balance'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link 
          href="/services"
          className="card p-4 flex flex-col items-center gap-2 hover:border-saffron-500 transition"
        >
          <FileText className="w-8 h-8 text-saffron-600" />
          <span className="text-sm font-medium text-navy-900 dark:text-white text-center">
            {lang === 'hi' ? 'नया आवेदन' : 'New Application'}
          </span>
        </Link>

        <Link 
          href="/track-application"
          className="card p-4 flex flex-col items-center gap-2 hover:border-saffron-500 transition"
        >
          <Clock className="w-8 h-8 text-saffron-600" />
          <span className="text-sm font-medium text-navy-900 dark:text-white text-center">
            {lang === 'hi' ? 'आवेदन ट्रैक करें' : 'Track Application'}
          </span>
        </Link>

        <Link 
          href="/dashboard/wallet"
          className="card p-4 flex flex-col items-center gap-2 hover:border-saffron-500 transition"
        >
          <Wallet className="w-8 h-8 text-saffron-600" />
          <span className="text-sm font-medium text-navy-900 dark:text-white text-center">
            {lang === 'hi' ? 'वॉलेट' : 'Wallet'}
          </span>
        </Link>

        <Link 
          href="/dashboard/profile"
          className="card p-4 flex flex-col items-center gap-2 hover:border-saffron-500 transition"
        >
          <User className="w-8 h-8 text-saffron-600" />
          <span className="text-sm font-medium text-navy-900 dark:text-white text-center">
            {lang === 'hi' ? 'प्रोफाइल' : 'Profile'}
          </span>
        </Link>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="p-6 border-b border-navy-200 dark:border-navy-700">
          <h2 className="text-xl font-semibold text-navy-900 dark:text-white">
            {lang === 'hi' ? 'हाल के आवेदन' : 'Recent Applications'}
          </h2>
        </div>
        
        {recentApplications.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-navy-300 dark:text-navy-600 mx-auto mb-4" />
            <p className="text-navy-600 dark:text-navy-300">
              {lang === 'hi' ? 'कोई आवेदन नहीं मिला' : 'No applications yet'}
            </p>
            <Link 
              href="/services"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-saffron-600 text-white rounded-lg hover:bg-saffron-700 transition"
            >
              {lang === 'hi' ? 'पहला आवेदन करें' : 'Start Your First Application'}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-navy-200 dark:divide-navy-700">
            {recentApplications.map((app: any) => (
              <div key={app._id} className="p-4 hover:bg-navy-50 dark:hover:bg-navy-800 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-navy-900 dark:text-white">
                        {app.service?.name || 'Service'}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </div>
                    <p className="text-sm text-navy-600 dark:text-navy-300">
                      {lang === 'hi' ? 'आवेदन ID:' : 'Application ID:'} {app.applicationId}
                    </p>
                    <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link 
                    href={`/dashboard/applications/${app._id}`}
                    className="ml-4 p-2 hover:bg-navy-100 dark:hover:bg-navy-700 rounded-lg transition"
                  >
                    <ExternalLink className="w-5 h-5 text-navy-600 dark:text-navy-300" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Support Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/dashboard/support"
          className="card p-6 flex items-center gap-4 hover:border-saffron-500 transition"
        >
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-medium text-navy-900 dark:text-white">
              {lang === 'hi' ? 'सहायता टिकट' : 'Support Ticket'}
            </h3>
            <p className="text-sm text-navy-600 dark:text-navy-300">
              {lang === 'hi' ? 'सहायता के लिए टिकट बनाएं' : 'Create a support ticket'}
            </p>
          </div>
        </Link>

        <Link 
          href="/dashboard/profile"
          className="card p-6 flex items-center gap-4 hover:border-saffron-500 transition"
        >
          <div className="w-12 h-12 bg-saffron-100 dark:bg-saffron-900/30 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-saffron-600 dark:text-saffron-400" />
          </div>
          <div>
            <h3 className="font-medium text-navy-900 dark:text-white">
              {lang === 'hi' ? 'खाता सेटिंग्स' : 'Account Settings'}
            </h3>
            <p className="text-sm text-navy-600 dark:text-navy-300">
              {lang === 'hi' ? 'अपनी जानकारी अपडेट करें' : 'Update your information'}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
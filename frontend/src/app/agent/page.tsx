"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { 
  Users, FileText, Wallet, Clock, CheckCircle, 
  TrendingUp, Plus, Download, MessageCircle, User 
} from 'lucide-react';
import api from '@/lib/api';

export default function AgentDashboard() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalApplications: 0,
    todayApplications: 0,
    totalEarnings: 0,
    todayEarnings: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In production, this would be an actual API call
      // For now, using mock data
      setStats({
        totalCustomers: 45,
        totalApplications: 120,
        todayApplications: 8,
        totalEarnings: 45000,
        todayEarnings: 3200
      });
      
      setRecentApplications([
        {
          _id: '1',
          applicationId: 'APP123456',
          service: { name: 'PAN Card Application' },
          user: { name: 'Rahul Sharma' },
          status: 'completed',
          createdAt: new Date(),
          feeBreakdown: { total: 250 }
        },
        {
          _id: '2',
          applicationId: 'APP123457',
          service: { name: 'Aadhaar Update' },
          user: { name: 'Priya Singh' },
          status: 'processing',
          createdAt: new Date(),
          feeBreakdown: { total: 150 }
        }
      ]);
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
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          {lang === 'hi' ? 'एजेंट डैशबोर्ड' : 'Agent Dashboard'}
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
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-navy-900 dark:text-white">
              {stats.totalCustomers}
            </span>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-300">
            {lang === 'hi' ? 'कुल ग्राहक' : 'Total Customers'}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-saffron-100 dark:bg-saffron-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-saffron-600 dark:text-saffron-400" />
            </div>
            <span className="text-2xl font-bold text-navy-900 dark:text-white">
              {stats.totalApplications}
            </span>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-300">
            {lang === 'hi' ? 'कुल आवेदन' : 'Total Applications'}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            +{stats.todayApplications} {lang === 'hi' ? 'आज' : 'today'}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-2xl font-bold text-navy-900 dark:text-white">
              ₹{stats.totalEarnings.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-300">
            {lang === 'hi' ? 'कुल कमाई' : 'Total Earnings'}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            +₹{stats.todayEarnings} {lang === 'hi' ? 'आज' : 'today'}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-2xl font-bold text-navy-900 dark:text-white">
              {((stats.totalEarnings / stats.totalApplications) || 0).toFixed(0)}
            </span>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-300">
            {lang === 'hi' ? 'औसत प्रति आवेदन' : 'Avg per Application'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link 
          href="/agent/new-application"
          className="card p-4 flex flex-col items-center gap-2 hover:border-saffron-500 transition"
        >
          <Plus className="w-8 h-8 text-saffron-600" />
          <span className="text-sm font-medium text-navy-900 dark:text-white text-center">
            {lang === 'hi' ? 'नया आवेदन' : 'New Application'}
          </span>
        </Link>

        <Link 
          href="/agent/customers"
          className="card p-4 flex flex-col items-center gap-2 hover:border-saffron-500 transition"
        >
          <Users className="w-8 h-8 text-saffron-600" />
          <span className="text-sm font-medium text-navy-900 dark:text-white text-center">
            {lang === 'hi' ? 'ग्राहक' : 'Customers'}
          </span>
        </Link>

        <Link 
          href="/agent/earnings"
          className="card p-4 flex flex-col items-center gap-2 hover:border-saffron-500 transition"
        >
          <Wallet className="w-8 h-8 text-saffron-600" />
          <span className="text-sm font-medium text-navy-900 dark:text-white text-center">
            {lang === 'hi' ? 'कमाई' : 'Earnings'}
          </span>
        </Link>

        <Link 
          href="/agent/profile"
          className="card p-4 flex flex-col items-center gap-2 hover:border-saffron-500 transition"
        >
          <User className="w-8 h-8 text-saffron-600" />
          <span className="text-sm font-medium text-navy-900 dark:text-white text-center">
            {lang === 'hi' ? 'प्रोफाइल' : 'Profile'}
          </span>
        </Link>
      </div>

      {/* Recent Applications */}
      <div className="card mb-8">
        <div className="p-6 border-b border-navy-200 dark:border-navy-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy-900 dark:text-white">
            {lang === 'hi' ? 'हाल के आवेदन' : 'Recent Applications'}
          </h2>
          <Link 
            href="/agent/applications"
            className="text-sm text-saffron-600 hover:text-saffron-700"
          >
            {lang === 'hi' ? 'सभी देखें' : 'View All'}
          </Link>
        </div>
        
        <div className="divide-y divide-navy-200 dark:divide-navy-700">
          {recentApplications.map((app: any) => (
            <div key={app._id} className="p-4 hover:bg-navy-50 dark:hover:bg-navy-800 transition">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-navy-900 dark:text-white">
                      {app.service?.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-navy-600 dark:text-navy-300">
                    {lang === 'hi' ? 'ग्राहक:' : 'Customer:'} {app.user?.name}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-navy-400 dark:text-navy-500">
                    <span>{lang === 'hi' ? 'आईडी:' : 'ID:'} {app.applicationId}</span>
                    <span>₹{app.feeBreakdown?.total}</span>
                    <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link 
                  href={`/agent/applications/${app._id}`}
                  className="ml-4 p-2 hover:bg-navy-100 dark:hover:bg-navy-700 rounded-lg transition"
                >
                  <Clock className="w-5 h-5 text-navy-600 dark:text-navy-300" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support & Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/agent/support"
          className="card p-6 flex items-center gap-4 hover:border-saffron-500 transition"
        >
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-medium text-navy-900 dark:text-white">
              {lang === 'hi' ? 'सहायता' : 'Support'}
            </h3>
            <p className="text-sm text-navy-600 dark:text-navy-300">
              {lang === 'hi' ? 'सहायता टिकट बनाएं' : 'Create support ticket'}
            </p>
          </div>
        </Link>

        <Link 
          href="/agent/reports"
          className="card p-6 flex items-center gap-4 hover:border-saffron-500 transition"
        >
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-navy-900 dark:text-white">
              {lang === 'hi' ? 'रिपोर्ट्स' : 'Reports'}
            </h3>
            <p className="text-sm text-navy-600 dark:text-navy-300">
              {lang === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Download reports'}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
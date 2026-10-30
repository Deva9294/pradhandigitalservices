"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, FileText, Wallet, TrendingUp, CheckCircle, Clock,
  MessageCircle, Settings, LogOut, BarChart3, Download,
  Shield, Briefcase, Ticket, FileText as FormIcon
} from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const { user, logout, isReady, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    agents: 0,
    applications: 0,
    pendingApplications: 0,
    payments: 0,
    revenue: 0,
    openTickets: 0,
    vacancies: 0,
    forms: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (!isAdmin) { router.replace(user?.role === 'agent' || user?.role === 'staff' ? '/agent' : '/dashboard'); return; }
    fetchDashboardData();
    const interval = window.setInterval(fetchDashboardData, 20000);
    return () => window.clearInterval(interval);
  }, [isReady, isAuthenticated, isAdmin, user?.role, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/analytics');
      const overview = response.data?.data?.overview;
      setStats(overview || {
        users: 0, agents: 0, applications: 0, pendingApplications: 0,
        payments: 0, revenue: 0, openTickets: 0, vacancies: 0, forms: 0
      });
      setRecentActivity(Array.isArray(response.data?.data?.recent?.applications)
        ? response.data.data.recent.applications
        : []);
      setLoadError('');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoadError('Live analytics are unavailable. Displayed values are not live until the API reconnects.');
      // Never display invented analytics when the live API is unavailable.
      setStats({
        users: 0, agents: 0, applications: 0, pendingApplications: 0,
        payments: 0, revenue: 0, openTickets: 0, vacancies: 0, forms: 0
      });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      section: 'Management',
      items: [
        { icon: Users, label: lang === 'hi' ? 'उपयोगकर्ता' : 'Users', href: '/admin/users', count: stats.users },
        { icon: Shield, label: lang === 'hi' ? 'एजेंट' : 'Agents', href: '/admin/agents', count: stats.agents },
        { icon: FileText, label: lang === 'hi' ? 'सेवाएं' : 'Services', href: '/admin/services' },
        { icon: Briefcase, label: lang === 'hi' ? 'आवेदन' : 'Applications', href: '/admin/applications', count: stats.pendingApplications, badge: 'pending' },
      ]
    },
    {
      section: 'Content',
      items: [
        { icon: Briefcase, label: lang === 'hi' ? 'भर्तियां' : 'Vacancies', href: '/admin/vacancies', count: stats.vacancies },
        { icon: FormIcon, label: lang === 'hi' ? 'फॉर्म' : 'Forms', href: '/admin/forms', count: stats.forms },
        { icon: Ticket, label: lang === 'hi' ? 'योजनाएं' : 'Schemes', href: '/admin/schemes' },
        { icon: BarChart3, label: lang === 'hi' ? 'समाचार' : 'News', href: '/admin/news' },
      ]
    },
    {
      section: 'Financial',
      items: [
        { icon: Wallet, label: lang === 'hi' ? 'भुगतान' : 'Payments', href: '/admin/payments', count: stats.payments },
        { icon: TrendingUp, label: lang === 'hi' ? 'राजस्व' : 'Revenue', href: '/admin/revenue', value: `₹${(stats.revenue / 1000).toFixed(0)}K` },
        { icon: CheckCircle, label: lang === 'hi' ? 'कमीशन' : 'Commission', href: '/admin/commission' },
      ]
    },
    {
      section: 'Support',
      items: [
        { icon: MessageCircle, label: lang === 'hi' ? 'सहायता टिकट' : 'Support Tickets', href: '/admin/support', count: stats.openTickets, badge: 'pending' },
        { icon: Clock, label: lang === 'hi' ? 'ऑडिट लॉग' : 'Audit Logs', href: '/admin/audit' },
        { icon: Settings, label: lang === 'hi' ? 'सेटिंग्स' : 'Settings', href: '/admin/settings' },
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
      </div>
    );
  }

  if (!isReady || !isAuthenticated || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-navy-700">Checking administrator account…</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
            {lang === 'hi' ? 'एडमिन डैशबोर्ड' : 'Admin Dashboard'}
          </h1>
          <p className="text-navy-600 dark:text-navy-300">
            {lang === 'hi' ? 'स्वागत है, ' : 'Welcome, '}{user?.name}
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          <LogOut className="w-4 h-4" />
          {lang === 'hi' ? 'लॉगआउट' : 'Logout'}
        </button>
      </div>

      {loadError && (
        <div role="status" className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-bold text-navy-900 dark:text-white">{stats.users}</span>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-300">{lang === 'hi' ? 'कुल उपयोगकर्ता' : 'Total Users'}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-saffron-600" />
            <span className="text-2xl font-bold text-navy-900 dark:text-white">{stats.applications}</span>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-300">{lang === 'hi' ? 'कुल आवेदन' : 'Total Applications'}</p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
            {stats.pendingApplications} {lang === 'hi' ? 'लंबित' : 'pending'}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <Wallet className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-navy-900 dark:text-white">₹{(stats.revenue / 1000).toFixed(0)}K</span>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-300">{lang === 'hi' ? 'कुल राजस्व' : 'Total Revenue'}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <span className="text-2xl font-bold text-navy-900 dark:text-white">{stats.openTickets}</span>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-300">{lang === 'hi' ? 'खुले टिकट' : 'Open Tickets'}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link 
          href="/admin/applications?status=pending"
          className="card p-4 flex items-center gap-3 hover:border-saffron-500 transition"
        >
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="font-medium text-navy-900 dark:text-white">
              {lang === 'hi' ? 'लंबित आवेदन' : 'Pending Applications'}
            </p>
            <p className="text-sm text-navy-600 dark:text-navy-300">{stats.pendingApplications}</p>
          </div>
        </Link>

        <Link 
          href="/admin/users?role=agent"
          className="card p-4 flex items-center gap-3 hover:border-saffron-500 transition"
        >
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-navy-900 dark:text-white">
              {lang === 'hi' ? 'एजेंट' : 'Agents'}
            </p>
            <p className="text-sm text-navy-600 dark:text-navy-300">{stats.agents}</p>
          </div>
        </Link>

        <Link 
          href="/admin/support?status=open"
          className="card p-4 flex items-center gap-3 hover:border-saffron-500 transition"
        >
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="font-medium text-navy-900 dark:text-white">
              {lang === 'hi' ? 'सहायता टिकट' : 'Support Tickets'}
            </p>
            <p className="text-sm text-navy-600 dark:text-navy-300">{stats.openTickets}</p>
          </div>
        </Link>

        <Link 
          href="/admin/reports"
          className="card p-4 flex items-center gap-3 hover:border-saffron-500 transition"
        >
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium text-navy-900 dark:text-white">
              {lang === 'hi' ? 'रिपोर्ट्स' : 'Reports'}
            </p>
            <p className="text-sm text-navy-600 dark:text-navy-300">
              {lang === 'hi' ? 'डाउनलोड' : 'Download'}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((section) => (
          <div key={section.section} className="card">
            <div className="p-4 border-b border-navy-200 dark:border-navy-700">
              <h3 className="font-semibold text-navy-900 dark:text-white">
                {section.section}
              </h3>
            </div>
            <div className="divide-y divide-navy-200 dark:divide-navy-700">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between p-4 hover:bg-navy-50 dark:hover:bg-navy-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-navy-600 dark:text-navy-300" />
                    <span className="text-sm font-medium text-navy-900 dark:text-white">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {('badge' in item) && item.badge === 'pending' && (
                      <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                    )}
                    {('count' in item) && item.count !== undefined && (
                      <span className="text-sm text-navy-600 dark:text-navy-300">
                        {item.count}
                      </span>
                    )}
                    {('value' in item) && item.value && (
                      <span className="text-sm text-navy-600 dark:text-navy-300">
                        {item.value}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 card">
        <div className="p-6 border-b border-navy-200 dark:border-navy-700">
          <h2 className="text-xl font-semibold text-navy-900 dark:text-white">
            {lang === 'hi' ? 'हाल की गतिविधि' : 'Recent Activity'}
          </h2>
        </div>
        
        {recentActivity.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 text-navy-300 dark:text-navy-600 mx-auto mb-4" />
            <p className="text-navy-600 dark:text-navy-300">
              {lang === 'hi' ? 'कोई हाल की गतिविधि नहीं' : 'No recent activity'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-navy-200 dark:divide-navy-700">
            {recentActivity.map((activity: any) => (
              <div key={activity._id} className="p-4 hover:bg-navy-50 dark:hover:bg-navy-800 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-navy-900 dark:text-white">
                        {activity.service?.name}
                      </h3>
                      <span className="text-xs text-navy-400 dark:text-navy-500">
                        {activity.applicationId}
                      </span>
                    </div>
                    <p className="text-sm text-navy-600 dark:text-navy-300">
                      {lang === 'hi' ? 'उपयोगकर्ता:' : 'User:'} {activity.user?.name}
                    </p>
                    <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Link 
                    href={`/admin/applications/${activity._id}`}
                    className="ml-4 p-2 hover:bg-navy-100 dark:hover:bg-navy-700 rounded-lg transition"
                  >
                    <FileText className="w-5 h-5 text-navy-600 dark:text-navy-300" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
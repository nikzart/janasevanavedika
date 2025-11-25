import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, Clock, TrendingUp, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { getAnalytics, getIssueAnalytics, Analytics } from '../lib/adminApi';
import StatsCard from './components/StatsCard';
import { SchemeBarChart, StatusPieChart, DailyLineChart, CategoryBarChart, IssueStatusPieChart } from './components/Charts';

interface IssueAnalytics {
  total: number;
  byCategory: { category: string; count: number }[];
  byStatus: { status: string; count: number }[];
  byDate: { date: string; count: number }[];
  resolvedCount: number;
}

type TabType = 'leads' | 'issues';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [issueAnalytics, setIssueAnalytics] = useState<IssueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('leads');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const [leadData, issueData] = await Promise.all([
      getAnalytics(),
      getIssueAnalytics(),
    ]);
    setAnalytics(leadData);
    setIssueAnalytics(issueData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-20 text-slate-500">
        Failed to load analytics
      </div>
    );
  }

  const pendingCount = analytics.byStatus.find((s) => s.status === 'pending')?.count || 0;
  const conversionRate = analytics.total > 0
    ? ((analytics.processedCount / analytics.total) * 100).toFixed(1)
    : '0';

  const issuePendingCount = issueAnalytics?.byStatus.find((s) => s.status === 'pending')?.count || 0;
  const resolutionRate = issueAnalytics && issueAnalytics.total > 0
    ? ((issueAnalytics.resolvedCount / issueAnalytics.total) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Analytics overview
          </p>
        </div>
        <Link
          to={activeTab === 'leads' ? '/admin/leads' : '/admin/issues'}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'leads' ? 'bg-primary hover:bg-primary/90' : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          View All {activeTab === 'leads' ? 'Leads' : 'Issues'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-1 inline-flex">
        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'leads'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Leads
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'leads' ? 'bg-white/20' : 'bg-slate-200'
          }`}>
            {analytics.total}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'issues'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Issues
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'issues' ? 'bg-white/20' : 'bg-slate-200'
          }`}>
            {issueAnalytics?.total || 0}
          </span>
        </button>
      </div>

      {/* Leads Tab Content */}
      {activeTab === 'leads' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Leads"
              value={analytics.total}
              icon={<Users className="w-5 h-5" />}
              color="blue"
            />
            <StatsCard
              title="Pending"
              value={pendingCount}
              icon={<Clock className="w-5 h-5" />}
              color="amber"
            />
            <StatsCard
              title="Processed"
              value={analytics.processedCount}
              icon={<CheckCircle className="w-5 h-5" />}
              color="green"
            />
            <StatsCard
              title="Conversion Rate"
              value={`${conversionRate}%`}
              icon={<TrendingUp className="w-5 h-5" />}
              color="purple"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SchemeBarChart data={analytics.byScheme} />
            <StatusPieChart data={analytics.byStatus} />
          </div>

          {/* Daily Chart */}
          <DailyLineChart data={analytics.byDate} title="Daily Lead Submissions (Last 30 Days)" color="#1e40af" />
        </>
      )}

      {/* Issues Tab Content */}
      {activeTab === 'issues' && issueAnalytics && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Issues"
              value={issueAnalytics.total}
              icon={<AlertTriangle className="w-5 h-5" />}
              color="orange"
            />
            <StatsCard
              title="Pending"
              value={issuePendingCount}
              icon={<Clock className="w-5 h-5" />}
              color="amber"
            />
            <StatsCard
              title="Resolved"
              value={issueAnalytics.resolvedCount}
              icon={<CheckCircle className="w-5 h-5" />}
              color="green"
            />
            <StatsCard
              title="Resolution Rate"
              value={`${resolutionRate}%`}
              icon={<TrendingUp className="w-5 h-5" />}
              color="purple"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryBarChart data={issueAnalytics.byCategory} />
            <IssueStatusPieChart data={issueAnalytics.byStatus} />
          </div>

          {/* Daily Chart */}
          <DailyLineChart data={issueAnalytics.byDate} title="Daily Issue Reports (Last 30 Days)" color="#f97316" />
        </>
      )}
    </div>
  );
}

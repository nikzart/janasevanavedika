import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, Clock, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { getAnalytics, Analytics } from '../lib/adminApi';
import StatsCard from './components/StatsCard';
import { SchemeBarChart, StatusPieChart, DailyLineChart } from './components/Charts';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const data = await getAnalytics();
    setAnalytics(data);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Overview of lead submissions
          </p>
        </div>
        <Link
          to="/admin/leads"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          View All Leads
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

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
      <DailyLineChart data={analytics.byDate} />
    </div>
  );
}

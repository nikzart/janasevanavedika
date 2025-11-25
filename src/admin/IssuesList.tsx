import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Loader2, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { fetchIssues, Issue, IssueFilters, IssueStatus } from '../lib/adminApi';
import { issueCategories, getCategoryName } from '../data/issueCategories';
import StatusBadge from './components/StatusBadge';

const statusOptions: { value: IssueStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  ...issueCategories.map((cat) => ({ value: cat.id, label: cat.name.en })),
];

export default function IssuesList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IssueFilters>({});

  useEffect(() => {
    loadIssues();
  }, [filters]);

  const loadIssues = async () => {
    setLoading(true);
    const data = await fetchIssues(filters);
    setIssues(data);
    setLoading(false);
  };

  const handleFilterChange = (key: keyof IssueFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Reporter', 'Mobile', 'Category', 'Location', 'Status'];
    const rows = issues.map((issue) => [
      issue.id,
      new Date(issue.created_at).toLocaleDateString(),
      issue.reporter_name,
      issue.mobile_number,
      getCategoryName(issue.category),
      issue.location_text,
      issue.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `issues-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Issues</h1>
        <button
          onClick={exportCSV}
          disabled={issues.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, mobile, location..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Category */}
          <select
            value={filters.category || 'all'}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Date */}
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No issues found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Date</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Reporter</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Category</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Location</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(issue.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{issue.reporter_name}</div>
                      <div className="text-sm text-slate-500">{issue.mobile_number}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        {getCategoryName(issue.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-slate-600 max-w-xs truncate">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {issue.location_text}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/issues/${issue.id}`}
                        className="flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-sm"
                      >
                        View
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Count */}
      <div className="text-sm text-slate-500 text-center">
        Showing {issues.length} issue{issues.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

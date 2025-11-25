import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye, RefreshCw, Loader2 } from 'lucide-react';
import { fetchLeads, downloadCSV, Lead, LeadFilters } from '../lib/adminApi';
import FilterBar from './components/FilterBar';
import StatusBadge from './components/StatusBadge';

const schemeNames: Record<string, string> = {
  GL: 'Gruha Lakshmi',
  GJ: 'Gruha Jyothi',
  YN: 'Yuva Nidhi',
  SH: 'Shakti',
  AB: 'Anna Bhagya',
};

export default function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filters, setFilters] = useState<LeadFilters>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeads = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    const data = await fetchLeads(filters);
    setLeads(data);

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadLeads();
  }, [filters]);

  const handleExport = () => {
    const filename = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(leads, filename);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="text-slate-500 text-sm mt-1">
            {leads.length} total leads
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => loadLeads(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            disabled={leads.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p>No leads found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Scheme
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-900">
                        {lead.applicant_name || 'N/A'}
                      </p>
                      {lead.ward_no && (
                        <p className="text-xs text-slate-500">Ward {lead.ward_no}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {lead.mobile_number || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-700">
                        {schemeNames[lead.scheme_type] || lead.scheme_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status || 'pending'} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/leads/${lead.id}`}
                        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

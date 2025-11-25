import { Search, X } from 'lucide-react';
import { LeadFilters } from '../../lib/adminApi';

const schemes = [
  { value: 'all', label: 'All Schemes' },
  { value: 'GL', label: 'Gruha Lakshmi' },
  { value: 'GJ', label: 'Gruha Jyothi' },
  { value: 'YN', label: 'Yuva Nidhi' },
  { value: 'SH', label: 'Shakti' },
  { value: 'AB', label: 'Anna Bhagya' },
];

const statuses = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'verified', label: 'Verified' },
  { value: 'processed', label: 'Processed' },
  { value: 'rejected', label: 'Rejected' },
];

interface FilterBarProps {
  filters: LeadFilters;
  onFilterChange: (filters: LeadFilters) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const updateFilter = (key: keyof LeadFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = filters.scheme || filters.status || filters.search || filters.dateFrom || filters.dateTo;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Scheme filter */}
        <select
          value={filters.scheme || 'all'}
          onChange={(e) => updateFilter('scheme', e.target.value === 'all' ? '' : e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        >
          {schemes.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={filters.status || 'all'}
          onChange={(e) => updateFilter('status', e.target.value === 'all' ? '' : e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Date from */}
        <input
          type="date"
          value={filters.dateFrom || ''}
          onChange={(e) => updateFilter('dateFrom', e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="From date"
        />

        {/* Date to */}
        <input
          type="date"
          value={filters.dateTo || ''}
          onChange={(e) => updateFilter('dateTo', e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="To date"
        />

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

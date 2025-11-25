import { LeadStatus } from '../../lib/adminApi';

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-800',
  },
  reviewing: {
    label: 'Reviewing',
    className: 'bg-blue-100 text-blue-800',
  },
  verified: {
    label: 'Verified',
    className: 'bg-purple-100 text-purple-800',
  },
  processed: {
    label: 'Processed',
    className: 'bg-green-100 text-green-800',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800',
  },
};

interface StatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${config.className} ${sizeClasses}`}>
      {config.label}
    </span>
  );
}

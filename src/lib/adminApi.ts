import { supabase } from './supabase';

export type LeadStatus = 'pending' | 'reviewing' | 'verified' | 'processed' | 'rejected';

export interface Lead {
  id: string;
  created_at: string;
  scheme_type: string;
  applicant_name: string;
  mobile_number: string;
  ward_no: string | null;
  form_data: Record<string, unknown>;
  status: LeadStatus;
  admin_notes: string | null;
  processed_at: string | null;
  processed_by: string | null;
}

export interface LeadDocument {
  id: string;
  lead_id: string;
  document_type: string;
  document_name: string;
  image_data: string;
  file_size: number;
  compressed_size: number;
  mime_type: string;
  created_at: string;
}

export interface LeadFilters {
  scheme?: string;
  status?: LeadStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface Analytics {
  total: number;
  byScheme: { scheme: string; count: number }[];
  byStatus: { status: LeadStatus; count: number }[];
  byDate: { date: string; count: number }[];
  processedCount: number;
}

export async function fetchLeads(filters: LeadFilters = {}): Promise<Lead[]> {
  if (!supabase) return [];

  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.scheme && filters.scheme !== 'all') {
    query = query.eq('scheme_type', filters.scheme);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.search) {
    query = query.or(`applicant_name.ilike.%${filters.search}%,mobile_number.ilike.%${filters.search}%`);
  }

  if (filters.dateFrom) {
    query = query.gte('created_at', filters.dateFrom);
  }

  if (filters.dateTo) {
    query = query.lte('created_at', filters.dateTo + 'T23:59:59');
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  return (data || []) as Lead[];
}

export async function fetchLeadById(id: string): Promise<{ lead: Lead; documents: LeadDocument[] } | null> {
  if (!supabase) return null;

  const [leadResult, docsResult] = await Promise.all([
    supabase.from('leads').select('*').eq('id', id).single(),
    supabase.from('lead_documents').select('*').eq('lead_id', id),
  ]);

  if (leadResult.error || !leadResult.data) {
    console.error('Error fetching lead:', leadResult.error);
    return null;
  }

  return {
    lead: leadResult.data as Lead,
    documents: (docsResult.data || []) as LeadDocument[],
  };
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  notes?: string
): Promise<boolean> {
  if (!supabase) return false;

  const updates: Partial<Lead> = {
    status,
    admin_notes: notes || null,
  };

  if (status === 'processed' || status === 'rejected') {
    updates.processed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating lead status:', error);
    return false;
  }

  return true;
}

export async function getAnalytics(): Promise<Analytics> {
  if (!supabase) {
    return { total: 0, byScheme: [], byStatus: [], byDate: [], processedCount: 0 };
  }

  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, scheme_type, status, created_at');

  if (error || !leads) {
    console.error('Error fetching analytics:', error);
    return { total: 0, byScheme: [], byStatus: [], byDate: [], processedCount: 0 };
  }

  // Count by scheme
  const schemeCount: Record<string, number> = {};
  const statusCount: Record<string, number> = {};
  const dateCount: Record<string, number> = {};
  let processedCount = 0;

  leads.forEach((lead) => {
    // By scheme
    schemeCount[lead.scheme_type] = (schemeCount[lead.scheme_type] || 0) + 1;

    // By status
    const status = lead.status || 'pending';
    statusCount[status] = (statusCount[status] || 0) + 1;

    if (status === 'processed') {
      processedCount++;
    }

    // By date (last 30 days)
    const date = new Date(lead.created_at).toISOString().split('T')[0];
    dateCount[date] = (dateCount[date] || 0) + 1;
  });

  // Convert to arrays
  const byScheme = Object.entries(schemeCount).map(([scheme, count]) => ({ scheme, count }));
  const byStatus = Object.entries(statusCount).map(([status, count]) => ({
    status: status as LeadStatus,
    count,
  }));

  // Get last 30 days for date chart
  const last30Days: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    last30Days.push({ date: dateStr, count: dateCount[dateStr] || 0 });
  }

  return {
    total: leads.length,
    byScheme,
    byStatus,
    byDate: last30Days,
    processedCount,
  };
}

export function exportLeadsCSV(leads: Lead[]): string {
  const headers = [
    'ID',
    'Date',
    'Scheme',
    'Name',
    'Mobile',
    'Ward',
    'Status',
    'Notes',
  ];

  const rows = leads.map((lead) => [
    lead.id,
    new Date(lead.created_at).toLocaleDateString(),
    lead.scheme_type,
    lead.applicant_name,
    lead.mobile_number,
    lead.ward_no || '',
    lead.status || 'pending',
    lead.admin_notes || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return csvContent;
}

export function downloadCSV(leads: Lead[], filename = 'leads.csv') {
  const csv = exportLeadsCSV(leads);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Save,
  Loader2,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { fetchLeadById, updateLeadStatus, Lead, LeadDocument, LeadStatus } from '../lib/adminApi';
import StatusBadge from './components/StatusBadge';
import { SchemeBadge } from './components/SchemeInfo';

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'verified', label: 'Verified' },
  { value: 'processed', label: 'Processed' },
  { value: 'rejected', label: 'Rejected' },
];

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [documents, setDocuments] = useState<LeadDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<LeadStatus>('pending');
  const [notes, setNotes] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadLead();
    }
  }, [id]);

  const loadLead = async () => {
    if (!id) return;
    setLoading(true);
    const result = await fetchLeadById(id);
    if (result) {
      setLead(result.lead);
      setDocuments(result.documents);
      setStatus(result.lead.status || 'pending');
      setNotes(result.lead.admin_notes || '');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    const success = await updateLeadStatus(id, status, notes);
    if (success) {
      await loadLead();
    }
    setSaving(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Lead not found</p>
        <Link to="/admin/leads" className="text-primary hover:underline mt-2 inline-block">
          Back to leads
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/leads')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {lead.applicant_name || 'Unnamed Lead'}
          </h1>
          <div className="mt-1">
            <SchemeBadge scheme={lead.scheme_type} />
          </div>
        </div>
        <div className="ml-auto">
          <StatusBadge status={lead.status || 'pending'} size="md" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact & Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Phone className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Mobile</p>
                  <p className="font-medium text-slate-800">{lead.mobile_number || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Submitted</p>
                  <p className="font-medium text-slate-800">{formatDate(lead.created_at)}</p>
                </div>
              </div>
              {lead.ward_no && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <MapPin className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Ward</p>
                    <p className="font-medium text-slate-800">{lead.ward_no}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Data */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Form Data
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(lead.form_data || {}).map(([key, value]) => {
                // Skip document fields (they're shown separately)
                if (key.startsWith('doc_') || typeof value === 'object') return null;
                return (
                  <div key={key} className="border-b border-slate-100 pb-2">
                    <p className="text-xs text-slate-500 capitalize">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {String(value) || 'N/A'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Documents */}
          {documents.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Uploaded Documents ({documents.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="relative group cursor-pointer"
                    onClick={() => setPreviewImage(doc.image_data)}
                  >
                    <img
                      src={doc.image_data}
                      alt={doc.document_name}
                      className="w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">View</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 truncate capitalize">
                      {doc.document_name.replace(/_/g, ' ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Status & Notes */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Update Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Admin Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Add notes about this application..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          </div>

          {lead.processed_at && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm">
              <p className="text-slate-500">
                Processed on {formatDate(lead.processed_at)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={previewImage}
            alt="Document preview"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Calendar, ExternalLink, Loader2, X } from 'lucide-react';
import { fetchIssueById, updateIssueStatus, Issue, IssueDocument, IssueStatus } from '../lib/adminApi';
import { getCategoryName } from '../data/issueCategories';
import StatusBadge from './components/StatusBadge';

const statusOptions: IssueStatus[] = ['pending', 'reviewing', 'resolved', 'closed'];

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [documents, setDocuments] = useState<IssueDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [newStatus, setNewStatus] = useState<IssueStatus>('pending');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) loadIssue();
  }, [id]);

  const loadIssue = async () => {
    if (!id) return;
    setLoading(true);
    const data = await fetchIssueById(id);
    if (data) {
      setIssue(data.issue);
      setDocuments(data.documents);
      setNewStatus(data.issue.status);
      setNotes(data.issue.admin_notes || '');
    }
    setLoading(false);
  };

  const handleStatusUpdate = async () => {
    if (!id || !issue) return;
    setUpdating(true);
    const success = await updateIssueStatus(id, newStatus, notes);
    if (success) {
      setIssue({ ...issue, status: newStatus, admin_notes: notes });
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Issue not found</p>
        <Link to="/admin/issues" className="text-primary hover:underline mt-2 inline-block">
          Back to Issues
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/issues"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">Issue Details</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              {getCategoryName(issue.category)}
            </span>
            <StatusBadge status={issue.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reporter Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Reporter Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-500">Name</label>
                <p className="font-medium text-slate-800">{issue.reporter_name}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Mobile</label>
                <a
                  href={`tel:${issue.mobile_number}`}
                  className="flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  {issue.mobile_number}
                </a>
              </div>
              <div>
                <label className="text-sm text-slate-500">Submitted</label>
                <p className="flex items-center gap-1 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(issue.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Issue Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Issue Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-500">Category</label>
                <p className="font-medium text-slate-800">
                  {issue.category === 'other' && issue.custom_category
                    ? issue.custom_category
                    : getCategoryName(issue.category)}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Description</label>
                <p className="text-slate-700 whitespace-pre-wrap">{issue.description}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Location</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <p className="text-slate-700">{issue.location_text}</p>
              </div>
              {issue.latitude && issue.longitude && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">GPS:</span>
                  <span className="text-sm text-slate-600">
                    {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
                  </span>
                  <a
                    href={`https://maps.google.com/?q=${issue.latitude},${issue.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Maps
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          {documents.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-4">Uploaded Documents</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="space-y-2">
                    <button
                      onClick={() => setSelectedImage(doc.image_data)}
                      className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 hover:border-primary transition-colors"
                    >
                      <img
                        src={doc.image_data}
                        alt={doc.document_name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <p className="text-sm text-slate-600 text-center">{doc.document_name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Status Update */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Update Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Add notes about this issue..."
                />
              </div>

              <button
                onClick={handleStatusUpdate}
                disabled={updating}
                className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                Update Status
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href={`tel:${issue.mobile_number}`}
                className="flex items-center gap-2 w-full px-4 py-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Reporter
              </a>
              {issue.latitude && issue.longitude && (
                <a
                  href={`https://maps.google.com/?q=${issue.latitude},${issue.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  View on Map
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-[90vh] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

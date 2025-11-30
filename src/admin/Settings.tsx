import { useState, useEffect } from 'react';
import { Loader2, Save, Phone } from 'lucide-react';
import { getWhatsAppNumber, updateWhatsAppNumber } from '../lib/settingsApi';

export default function Settings() {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const number = await getWhatsAppNumber();
    setWhatsappNumber(number);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Clean the number - remove spaces, dashes, etc.
    const cleanNumber = whatsappNumber.replace(/[\s\-\(\)]/g, '');

    const success = await updateWhatsAppNumber(cleanNumber);

    if (success) {
      setWhatsappNumber(cleanNumber);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } else {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    }

    setSaving(false);

    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-600 mt-1">Configure app settings</p>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* WhatsApp Number */}
          <div>
            <label
              htmlFor="whatsapp"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2"
            >
              <Phone className="w-4 h-4" />
              WhatsApp Number
            </label>
            <input
              id="whatsapp"
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="919876543210"
              className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <p className="mt-2 text-sm text-slate-500">
              Enter the WhatsApp number with country code (no + or spaces).
              <br />
              Example: <code className="bg-slate-100 px-1 rounded">919876543210</code> for Indian number +91 9876543210
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`px-4 py-3 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

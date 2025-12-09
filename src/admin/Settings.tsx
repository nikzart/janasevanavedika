import { useState, useEffect } from 'react';
import { Loader2, Save, Phone, Type } from 'lucide-react';
import { getWhatsAppNumber, updateWhatsAppNumber, getScrollingText, updateScrollingText } from '../lib/settingsApi';
import type { BilingualText } from '../types';

// Default scrolling text items
const DEFAULT_SCROLLING_TEXT: BilingualText[] = [
  { en: 'We are here to Help you', kn: 'ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ನಾವಿದ್ದೇವೆ' },
  { en: 'Shree. NA Haris Ji Team', kn: 'ಶ್ರೀ ಎನ್.ಎ. ಹ್ಯಾರಿಸ್ ಜಿ ಅವರ ತಂಡ' },
  { en: 'Dr. B. Ravi', kn: 'ಡಾ. ಬಿ. ರವಿ' },
  { en: 'Garbage', kn: 'ಕಸ ವಿಲೇವಾರಿ' },
  { en: 'Bescom / Bwssb', kn: 'ಬೆಸ್ಕಾಂ / ಜಲಮಂಡಳಿ' },
  { en: 'Drainage', kn: 'ಒಳಚರಂಡಿ' },
  { en: 'Voter ID : Aadhar Card : Ration Card', kn: 'ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ : ಆಧಾರ್ ಕಾರ್ಡ್ : ಪಡಿತರ ಚೀಟಿ' },
  { en: '5 Guarantees implementation', kn: '5 ಗ್ಯಾರಂಟಿಗಳ ಅನುಷ್ಠಾನ' },
  { en: 'Old Age Pensions / Widow Pensions', kn: 'ವೃದ್ಧಾಪ್ಯ ವೇತನ / ವಿಧವಾ ವೇತನ' },
  { en: 'Contact Us - please download the app', kn: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಲು ದಯವಿಟ್ಟು ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ' },
];

export default function Settings() {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [scrollingTextEn, setScrollingTextEn] = useState('');
  const [scrollingTextKn, setScrollingTextKn] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);

    // Load WhatsApp number
    const number = await getWhatsAppNumber();
    setWhatsappNumber(number);

    // Load scrolling text
    let items = await getScrollingText();
    if (items.length === 0) {
      items = DEFAULT_SCROLLING_TEXT;
    }
    setScrollingTextEn(items.map(item => item.en).join('\n'));
    setScrollingTextKn(items.map(item => item.kn).join('\n'));

    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Clean the number - remove spaces, dashes, etc.
    const cleanNumber = whatsappNumber.replace(/[\s\-\(\)]/g, '');

    // Parse scrolling text
    const enLines = scrollingTextEn.split('\n').map(s => s.trim()).filter(Boolean);
    const knLines = scrollingTextKn.split('\n').map(s => s.trim()).filter(Boolean);

    // Create bilingual items (pair up lines by index)
    const scrollingItems: BilingualText[] = enLines.map((en, i) => ({
      en,
      kn: knLines[i] || en, // Fallback to English if Kannada line missing
    }));

    // Save both settings
    const [whatsappSuccess, scrollingSuccess] = await Promise.all([
      updateWhatsAppNumber(cleanNumber),
      updateScrollingText(scrollingItems),
    ]);

    if (whatsappSuccess && scrollingSuccess) {
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

          {/* Scrolling Text */}
          <div className="pt-4 border-t border-slate-200">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-4">
              <Type className="w-4 h-4" />
              Homepage Scrolling Text
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="scrolling_en"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  English (one item per line)
                </label>
                <textarea
                  id="scrolling_en"
                  value={scrollingTextEn}
                  onChange={(e) => setScrollingTextEn(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  placeholder="We are here to Help you&#10;Dr. B. Ravi&#10;..."
                />
              </div>

              <div>
                <label
                  htmlFor="scrolling_kn"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Kannada (one item per line)
                </label>
                <textarea
                  id="scrolling_kn"
                  value={scrollingTextKn}
                  onChange={(e) => setScrollingTextKn(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  placeholder="ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ನಾವಿದ್ದೇವೆ&#10;ಡಾ. ಬಿ. ರವಿ&#10;..."
                />
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Each line in English should correspond to the same line in Kannada.
              These items will scroll horizontally on the homepage.
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

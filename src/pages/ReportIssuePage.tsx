import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { submitIssue, IssueFormData } from '../lib/issueApi';
import { sendIssueToWhatsApp } from '../lib/issueWhatsapp';
import Header from '../components/Header';
import IssueForm from '../components/IssueForm';

export default function ReportIssuePage() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (data: IssueFormData) => {
    setIsSubmitting(true);

    try {
      await submitIssue(data);
      sendIssueToWhatsApp(data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting issue:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="max-w-lg mx-auto px-4 py-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {t({ en: 'Issue Reported!', kn: 'ಸಮಸ್ಯೆ ವರದಿಯಾಗಿದೆ!' })}
          </h2>
          <p className="text-slate-600 mb-8">
            {t({
              en: 'Thank you for reporting. We will look into it.',
              kn: 'ವರದಿ ಮಾಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದ. ನಾವು ಇದನ್ನು ಪರಿಶೀಲಿಸುತ್ತೇವೆ.',
            })}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl shadow hover:bg-primary/90 transition-colors"
          >
            {t({ en: 'Back to Home', kn: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' })}
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-red-500 to-orange-500 py-5 px-4">
        <div className="max-w-lg mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t({ en: 'Back', kn: 'ಹಿಂದೆ' })}
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {t({ en: 'Report an Issue', kn: 'ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ' })}
          </h1>
          <p className="text-white/80 text-sm mt-1">
            {t({
              en: 'Help us serve you better by reporting local issues',
              kn: 'ಸ್ಥಳೀಯ ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡುವ ಮೂಲಕ ನಿಮಗೆ ಉತ್ತಮ ಸೇವೆ ನೀಡಲು ಸಹಾಯ ಮಾಡಿ',
            })}
          </p>
        </div>
      </section>

      {/* Form */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <IssueForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </main>
    </div>
  );
}

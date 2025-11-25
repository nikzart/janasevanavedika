import { useState, useEffect } from 'react';
import { schemes } from './data/schemes';
import { Scheme, LeadFormData } from './types';
import { useLanguage } from './hooks/useLanguage';
import { submitLead } from './lib/supabase';
import { sendToWhatsApp } from './lib/whatsapp';
import Header from './components/Header';
import SchemeCard from './components/SchemeCard';
import SchemeForm from './components/SchemeForm';
import InstallBanner from './components/InstallBanner';
import BottomSheet from './components/ui/BottomSheet';

export default function App() {
  const { t } = useLanguage();
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  // Splash screen timing
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setSplashFading(true);
    }, 1500);

    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleSchemeClick = (scheme: Scheme) => {
    setSelectedScheme(scheme);
  };

  const handleCloseSheet = () => {
    setSelectedScheme(null);
  };

  const handleFormSubmit = async (formData: LeadFormData) => {
    if (!selectedScheme) return;

    setIsSubmitting(true);

    try {
      // Extract name and mobile from form data
      const applicantName = (formData.name as string) || '';
      const mobileNumber = (formData.mobile as string) || '';

      // Save to Supabase
      await submitLead({
        schemeType: selectedScheme.id,
        applicantName,
        mobileNumber,
        formData,
      });

      // Open WhatsApp with pre-filled message
      sendToWhatsApp(selectedScheme, formData);

      // Close the sheet after a brief delay
      setTimeout(() => {
        handleCloseSheet();
      }, 500);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Splash Screen */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-[100] bg-gradient-to-br from-primary via-primary to-action flex flex-col items-center justify-center transition-opacity duration-500 ${
            splashFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Logo Container */}
          <div className="animate-bounce-in">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mb-6">
              <img
                src="/congress-logo.svg"
                alt="Congress"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>

          {/* App Name */}
          <h1
            className="text-2xl font-bold text-white text-center px-4 animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            B Ravi Janaseva Vedika
          </h1>
          <p
            className="text-white/80 text-sm mt-2 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            ಬಿ ರವಿ ಜನಸೇವಾ ವೇದಿಕೆ
          </p>

          {/* Loading indicator */}
          <div
            className="mt-8 flex gap-1.5 animate-fade-in-up"
            style={{ animationDelay: '0.7s' }}
          >
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="gradient-hero py-8 px-4 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 animate-fade-in-up">
              {t({
                en: 'Namaskara, I am Ravi. Here to serve you.',
                kn: 'ನಮಸ್ಕಾರ, ನಾನು ರವಿ. ನಿಮ್ಮ ಸೇವೆಗಾಗಿ.',
              })}
            </h2>
            <p className="text-slate-600 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {t({
                en: 'Select a scheme to apply',
                kn: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಯೋಜನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
              })}
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-4 right-4 w-32 h-32 bg-action/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        </section>

        {/* Schemes Grid */}
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.map((scheme, index) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                onClick={() => handleSchemeClick(scheme)}
                index={index}
              />
            ))}
          </div>
        </main>

        {/* Scheme Bottom Sheet */}
        <BottomSheet
          isOpen={!!selectedScheme}
          onClose={handleCloseSheet}
          title={selectedScheme ? t(selectedScheme.name) : ''}
        >
          {selectedScheme && (
            <SchemeForm
              scheme={selectedScheme}
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </BottomSheet>

        {/* PWA Install Banner */}
        <InstallBanner />
      </div>
    </>
  );
}

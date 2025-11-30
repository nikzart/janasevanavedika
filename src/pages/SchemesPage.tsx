import { useState } from 'react';
import { schemes } from '../data/schemes';
import { Scheme, LeadFormData } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { submitLead } from '../lib/supabase';
import { sendToWhatsApp } from '../lib/whatsapp';
import { getWhatsAppNumber } from '../lib/settingsApi';
import Header from '../components/Header';
import SchemeCard from '../components/SchemeCard';
import SchemeForm from '../components/SchemeForm';
import BottomSheet from '../components/ui/BottomSheet';

export default function SchemesPage() {
  const { t } = useLanguage();
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Fetch WhatsApp number fresh at submission time
      const whatsappNumber = await getWhatsAppNumber();
      console.log('WhatsApp number from settings:', whatsappNumber);

      const applicantName = (formData.name as string) || '';
      const mobileNumber = (formData.mobile as string) || '';

      await submitLead({
        schemeType: selectedScheme.id,
        applicantName,
        mobileNumber,
        formData,
      });

      sendToWhatsApp(selectedScheme, formData, whatsappNumber);

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
    <div className="min-h-screen bg-background pb-24">
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero py-6 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
            {t({
              en: 'Karnataka Guarantee Schemes',
              kn: 'ಕರ್ನಾಟಕ ಗ್ಯಾರಂಟಿ ಯೋಜನೆಗಳು',
            })}
          </h2>
          <p className="text-slate-600">
            {t({
              en: 'Select a scheme to apply',
              kn: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಯೋಜನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
            })}
          </p>
        </div>
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
    </div>
  );
}

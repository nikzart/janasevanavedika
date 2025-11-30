import { useLanguage } from '../hooks/useLanguage';
import Header from '../components/Header';

export default function LeadersPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero py-6 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
            {t({
              en: 'Our Leaders',
              kn: 'ನಮ್ಮ ನಾಯಕರು',
            })}
          </h2>
          <p className="text-slate-600">
            {t({
              en: 'Leadership guiding our community',
              kn: 'ನಮ್ಮ ಸಮುದಾಯವನ್ನು ಮಾರ್ಗದರ್ಶನ ಮಾಡುವ ನಾಯಕತ್ವ',
            })}
          </p>
        </div>
        <div className="absolute top-4 left-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl animate-float" />
        <div
          className="absolute bottom-4 right-4 w-32 h-32 bg-action/5 rounded-full blur-2xl animate-float"
          style={{ animationDelay: '1s' }}
        />
      </section>

      {/* Leaders Image */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-center">
          <img
            src="/leaders.png"
            alt={t({ en: 'Our Leaders', kn: 'ನಮ್ಮ ನಾಯಕರು' })}
            className="max-w-full h-auto rounded-xl"
          />
        </div>
      </main>
    </div>
  );
}

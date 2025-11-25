import { Link } from 'react-router-dom';
import { AlertCircle, FileText } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import Header from '../components/Header';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      {/* Hero Section with Ravi Photo */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-action/10 to-success/10" />

        {/* Ravi Photo */}
        <div className="relative z-10 flex flex-col items-center pt-6 pb-8 px-4">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl mb-4">
            <img
              src="/ravi-avatar.png"
              alt="Dr B Ravi"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center">
            {t({ en: 'Dr B Ravi', kn: 'ಡಾ. ಬಿ ರವಿ' })}
          </h2>
          <p className="text-slate-600 text-center mt-1">
            {t({ en: 'Ulsoor Constituency', kn: 'ಉಳ್ಸೂರು ಕ್ಷೇತ್ರ' })}
          </p>
          <p className="text-xl font-semibold text-primary mt-4 text-center">
            {t({
              en: 'We are here to help you',
              kn: 'ನಾವು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇವೆ',
            })}
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-4 w-32 h-32 bg-action/10 rounded-full blur-2xl" />
      </section>

      {/* Navigation Cards */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Report Issue Card */}
        <Link
          to="/report"
          className="block p-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">
                {t({ en: 'Report an Issue', kn: 'ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ' })}
              </h3>
              <p className="text-white/80 text-sm mt-0.5">
                {t({
                  en: 'Road, Water, Electricity, Sanitation',
                  kn: 'ರಸ್ತೆ, ನೀರು, ವಿದ್ಯುತ್, ನೈರ್ಮಲ್ಯ',
                })}
              </p>
            </div>
          </div>
        </Link>

        {/* Apply for Schemes Card */}
        <Link
          to="/schemes"
          className="block p-5 bg-gradient-to-r from-primary to-blue-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">
                {t({ en: 'Apply for Schemes', kn: 'ಯೋಜನೆಗಳಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' })}
              </h3>
              <p className="text-white/80 text-sm mt-0.5">
                {t({
                  en: 'Gruha Lakshmi, Gruha Jyothi, and more',
                  kn: 'ಗೃಹ ಲಕ್ಷ್ಮಿ, ಗೃಹ ಜ್ಯೋತಿ, ಮತ್ತು ಹೆಚ್ಚು',
                })}
              </p>
            </div>
          </div>
        </Link>

      </main>
    </div>
  );
}

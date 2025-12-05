import { Link } from 'react-router-dom';
import { AlertCircle, FileText, Instagram, Facebook } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import Header from '../components/Header';
import ScrollingText from '../components/ScrollingText';
import type { BilingualText } from '../types';

const serviceItems: BilingualText[] = [
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

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      {/* Party Leaders Strip */}
      <div className="bg-white py-3 px-4 flex justify-center items-center gap-4 md:gap-6 overflow-x-auto">
        {[1, 2, 3, 4, 5].map((num) => (
          <img
            key={num}
            src={`/partyleaders/${num}.png`}
            alt={`Party Leader ${num}`}
            className="h-14 md:h-16 object-contain flex-shrink-0"
          />
        ))}
      </div>

      {/* Hero Section with Banner */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-action/10 to-success/10" />

        {/* Banner Images */}
        <div className="relative z-10 flex justify-center items-end pt-6 pb-4 px-4">
          {/* Ribbon behind images */}
          <img
            src="/banner/ribbon.png"
            alt=""
            className="absolute inset-0 w-full h-full object-contain z-0"
          />
          <img
            src="/banner/1.png"
            alt="Dr B Ravi"
            className="h-48 md:h-64 object-contain relative z-10"
          />
          <img
            src="/banner/2.png"
            alt="Leader"
            className="h-48 md:h-64 object-contain relative z-10"
          />
        </div>
        <div className="relative z-10 text-center pb-6 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
            {t({ en: 'Dr B Ravi', kn: 'ಡಾ. ಬಿ ರವಿ' })}
          </h2>
          <p className="text-slate-600 text-center mt-1">
            {t({ en: 'President, Minority Block Domlur & Govt. of Karnataka Guarantee Scheme Member, Jogupalya', kn: 'ಅಧ್ಯಕ್ಷರು, ಅಲ್ಪಸಂಖ್ಯಾತ ಬ್ಲಾಕ್ ದೊಮ್ಮಲೂರು & ಕರ್ನಾಟಕ ಸರ್ಕಾರ ಖಾತರಿ ಯೋಜನೆ ಸದಸ್ಯರು, ಜೋಗುಪಾಳ್ಯ' })}
          </p>
          <ScrollingText
            items={serviceItems}
            className="text-xl font-semibold text-primary mt-4 text-center"
          />
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
          className="block p-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
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

        {/* Social Media Links */}
        <div className="flex justify-center gap-4 pt-2">
          <a
            href="https://www.instagram.com/ravi_congress_jogupalaya/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Instagram className="w-5 h-5" />
            <span className="text-sm font-medium">Instagram</span>
          </a>
          <a
            href="https://www.facebook.com/RaviUlsoorCongress"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Facebook className="w-5 h-5" />
            <span className="text-sm font-medium">Facebook</span>
          </a>
        </div>

      </main>

      {/* Powered by Footer */}
      <footer className="text-center pb-4">
        <a
          href="https://jnginnovators.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          powered by JnG Innovators Private Limited
        </a>
      </footer>
    </div>
  );
}

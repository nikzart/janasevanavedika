import { useLanguage } from '../hooks/useLanguage';
import LanguageToggle from './LanguageToggle';

export default function Header() {
  const { t, language } = useLanguage();

  return (
    <header className="sticky top-0 z-40 gradient-header border-b border-slate-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Congress Logo */}
          <div className="flex-shrink-0">
            <div className="h-11 w-11 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-slate-100 transition-transform hover:scale-105">
              <img
                src="/congress-logo.svg"
                alt="Congress"
                className="h-8 w-8 object-contain"
              />
            </div>
          </div>

          {/* Center: App Name */}
          <div className="flex-1 text-center px-3">
            <h1 className={`text-base md:text-lg font-bold text-primary leading-tight ${language === 'kn' ? 'font-kannada' : ''}`}>
              {t({ en: 'B Ravi Janaseva Vedike', kn: 'ಬಿ ರವಿ ಜನಸೇವಾ ವೇದಿಕೆ' })}
            </h1>
            <p className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">
              {t({ en: 'Ulsoor Constituency', kn: 'ಉಳ್ಸೂರು ಕ್ಷೇತ್ರ' })}
            </p>
          </div>

          {/* Right: Language Toggle */}
          <div className="flex items-center">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

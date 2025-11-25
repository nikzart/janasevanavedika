import { useLanguage } from '../hooks/useLanguage';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all border border-slate-200"
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5 text-slate-500" />
      <span className={language === 'kn' ? '' : 'font-kannada'}>
        {language === 'en' ? 'ಕನ್ನಡ' : 'EN'}
      </span>
    </button>
  );
}

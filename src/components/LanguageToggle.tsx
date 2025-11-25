import { useLanguage } from '../hooks/useLanguage';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
          language === 'en'
            ? 'bg-primary text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-800'
        }`}
        aria-label="English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('kn')}
        className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
          language === 'kn'
            ? 'bg-primary text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-800'
        }`}
        aria-label="Kannada"
      >
        ಕನ್ನಡ
      </button>
    </div>
  );
}

import { Download, X } from 'lucide-react';
import { useState } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { useLanguage } from '../hooks/useLanguage';

export default function InstallBanner() {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-white p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Download className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            {t({
              en: 'Install App for Faster Service',
              kn: 'ವೇಗವಾಗಿ ಸೇವೆ ಪಡೆಯಲು ಆಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={promptInstall}
            className="px-4 py-2 bg-white text-primary font-semibold rounded-lg hover:bg-slate-100 transition-colors text-sm"
          >
            {t({ en: 'Install', kn: 'ಇನ್‌ಸ್ಟಾಲ್' })}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

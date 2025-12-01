import { Download, X, Share, MoreVertical, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { useLanguage } from '../hooks/useLanguage';

const DISMISS_KEY = 'pwa-install-dismissed';

export default function InstallBanner() {
  const { isInstallable, isInstalled, isIOS, isIOSSafari, isIOSChrome, isAndroid, canPrompt, promptInstall } = useInstallPrompt();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Check if previously dismissed (within last 7 days)
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDays) {
        setDismissed(true);
        return;
      }
    }
    setDismissed(false);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setDismissed(true);
  };

  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  // Render iOS Safari instructions
  const renderIOSSafariInstructions = () => (
    <p className="text-slate-300 text-xs mt-1 flex items-center gap-1 flex-wrap">
      <span>{t({ en: 'Tap', kn: 'ಟ್ಯಾಪ್ ಮಾಡಿ' })}</span>
      <Share className="w-4 h-4 inline text-blue-400" />
      <span>{t({ en: 'below, then', kn: 'ಕೆಳಗೆ, ನಂತರ' })}</span>
      <span className="inline-flex items-center gap-0.5 bg-slate-700 px-1.5 py-0.5 rounded text-white">
        <Plus className="w-3 h-3" />
        <span>{t({ en: 'Add to Home Screen', kn: 'ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿ' })}</span>
      </span>
    </p>
  );

  // Render iOS Chrome instructions
  const renderIOSChromeInstructions = () => (
    <p className="text-slate-300 text-xs mt-1 flex items-center gap-1 flex-wrap">
      <span>{t({ en: 'Tap', kn: 'ಟ್ಯಾಪ್ ಮಾಡಿ' })}</span>
      <Share className="w-4 h-4 inline text-blue-400" />
      <span>{t({ en: 'at top right, then', kn: 'ಮೇಲೆ ಬಲಭಾಗದಲ್ಲಿ, ನಂತರ' })}</span>
      <span className="bg-slate-700 px-1.5 py-0.5 rounded text-white">
        {t({ en: 'Add to Home Screen', kn: 'ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿ' })}
      </span>
    </p>
  );

  // Render other iOS browser instructions
  const renderIOSOtherInstructions = () => (
    <p className="text-slate-300 text-xs mt-1">
      {t({
        en: 'Open in Safari to install this app',
        kn: 'ಈ ಆಪ್ ಅನ್ನು ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಲು Safari ನಲ್ಲಿ ತೆರೆಯಿರಿ'
      })}
    </p>
  );

  // Render Android instructions (when beforeinstallprompt not available)
  const renderAndroidInstructions = () => (
    <p className="text-slate-300 text-xs mt-1 flex items-center gap-1 flex-wrap">
      <span>{t({ en: 'Tap', kn: 'ಟ್ಯಾಪ್ ಮಾಡಿ' })}</span>
      <MoreVertical className="w-4 h-4 inline text-slate-400" />
      <span>{t({ en: 'menu →', kn: 'ಮೆನು →' })}</span>
      <span className="bg-slate-700 px-1.5 py-0.5 rounded text-white">
        {t({ en: 'Install app', kn: 'ಆಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ' })}
      </span>
    </p>
  );

  // Render install button description
  const renderInstallButtonDesc = () => (
    <p className="text-slate-300 text-xs mt-1">
      {t({
        en: 'Get faster access & offline support',
        kn: 'ವೇಗವಾದ ಪ್ರವೇಶ ಮತ್ತು ಆಫ್‌ಲೈನ್ ಬೆಂಬಲ ಪಡೆಯಿರಿ',
      })}
    </p>
  );

  // Determine what to show
  const showInstallButton = canPrompt;
  const showIOSSafari = isIOS && isIOSSafari;
  const showIOSChrome = isIOS && isIOSChrome;
  const showIOSOther = isIOS && !isIOSSafari && !isIOSChrome;
  const showAndroidMenu = isAndroid && !canPrompt;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-30 install-banner">
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">
              {t({
                en: 'Install Janaseva App',
                kn: 'ಜನಸೇವಾ ಆಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ',
              })}
            </p>

            {showIOSSafari && renderIOSSafariInstructions()}
            {showIOSChrome && renderIOSChromeInstructions()}
            {showIOSOther && renderIOSOtherInstructions()}
            {showAndroidMenu && renderAndroidInstructions()}
            {showInstallButton && renderInstallButtonDesc()}
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-slate-800 rounded-full transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {showInstallButton && (
          <button
            onClick={promptInstall}
            className="w-full mt-3 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {t({ en: 'Install Now', kn: 'ಈಗ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ' })}
          </button>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export interface InstallPromptState {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isIOSSafari: boolean;
  isIOSChrome: boolean;
  isAndroid: boolean;
  canPrompt: boolean;
  promptInstall: () => Promise<boolean>;
}

export function useInstallPrompt(): InstallPromptState {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isIOSSafari, setIsIOSSafari] = useState(false);
  const [isIOSChrome, setIsIOSChrome] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const ua = navigator.userAgent;

    // Better iOS detection - includes iPad with desktop mode
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Detect which browser on iOS
      // CriOS = Chrome on iOS, FxiOS = Firefox on iOS
      const isChromeOnIOS = /CriOS/.test(ua);
      const isSafariOnIOS = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);

      setIsIOSChrome(isChromeOnIOS);
      setIsIOSSafari(isSafariOnIOS);
      setIsInstallable(true);
      return;
    }

    // Android detection
    const isAndroidDevice = /Android/i.test(ua);
    setIsAndroid(isAndroidDevice);

    // On Android, show install option
    if (isAndroidDevice) {
      setIsInstallable(true);
    }

    // Listen for beforeinstallprompt (Chrome, Edge, Samsung Internet on Android)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }

    setDeferredPrompt(null);
    return outcome === 'accepted';
  };

  return {
    isInstallable,
    isInstalled,
    isIOS,
    isIOSSafari,
    isIOSChrome,
    isAndroid,
    canPrompt: !!deferredPrompt,
    promptInstall,
  };
}

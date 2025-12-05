import { RefreshCw } from 'lucide-react';

interface UpdateBannerProps {
  onUpdate: () => void;
}

export default function UpdateBanner({ onUpdate }: UpdateBannerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-white px-4 py-3 shadow-lg animate-slide-down">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
        <p className="text-sm font-medium">
          A new version is available!
        </p>
        <button
          onClick={onUpdate}
          className="flex items-center gap-2 px-3 py-1.5 bg-white text-primary rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Update
        </button>
      </div>
    </div>
  );
}

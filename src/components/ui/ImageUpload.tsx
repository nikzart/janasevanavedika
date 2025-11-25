import { useState, useRef, ChangeEvent } from 'react';
import { Camera, X, Upload, Loader2, CheckCircle } from 'lucide-react';
import { compressImage, isValidImageType, isWithinSizeLimit, CompressedImage } from '../../lib/imageUtils';
import { useLanguage } from '../../hooks/useLanguage';

interface ImageUploadProps {
  id: string;
  label: string;
  value?: CompressedImage | null;
  onChange: (data: CompressedImage | null) => void;
  required?: boolean;
  error?: string;
}

export default function ImageUpload({
  id,
  label,
  value,
  onChange,
  required,
  error,
}: ImageUploadProps) {
  const { t } = useLanguage();
  const [isCompressing, setIsCompressing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError(null);

    // Validate file type
    if (!isValidImageType(file)) {
      setLocalError(t({
        en: 'Please select a valid image (JPG, PNG, WebP)',
        kn: 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಚಿತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ (JPG, PNG, WebP)',
      }));
      return;
    }

    // Validate file size (max 10MB before compression)
    if (!isWithinSizeLimit(file, 10)) {
      setLocalError(t({
        en: 'File too large. Maximum 10MB allowed.',
        kn: 'ಫೈಲ್ ತುಂಬಾ ದೊಡ್ಡದು. ಗರಿಷ್ಠ 10MB ಅನುಮತಿಸಲಾಗಿದೆ.',
      }));
      return;
    }

    setIsCompressing(true);

    try {
      const compressed = await compressImage(file, 0.8, 1200);
      onChange(compressed);
    } catch {
      setLocalError(t({
        en: 'Failed to process image. Please try again.',
        kn: 'ಚಿತ್ರವನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      }));
    } finally {
      setIsCompressing(false);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
    setLocalError(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const displayError = error || localError;

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload area or preview */}
      {value ? (
        // Preview uploaded image
        <div className="relative rounded-xl overflow-hidden border-2 border-green-200 bg-green-50">
          <img
            src={value.base64}
            alt={label}
            className="w-full h-40 object-cover"
          />
          {/* Success badge */}
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {t({ en: 'Uploaded', kn: 'ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ' })}
          </div>
          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // Upload button
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isCompressing}
          className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
            displayError
              ? 'border-red-300 bg-red-50'
              : 'border-slate-300 bg-slate-50 hover:border-primary hover:bg-primary/5'
          } ${isCompressing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isCompressing ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-sm text-slate-600">
                {t({ en: 'Compressing...', kn: 'ಸಂಕುಚಿಸಲಾಗುತ್ತಿದೆ...' })}
              </span>
            </>
          ) : (
            <>
              <div className="flex gap-2">
                <Camera className="w-6 h-6 text-slate-400" />
                <Upload className="w-6 h-6 text-slate-400" />
              </div>
              <span className="text-sm text-slate-600 text-center px-4">
                {t({
                  en: 'Tap to take photo or upload',
                  kn: 'ಫೋಟೋ ತೆಗೆಯಲು ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
                })}
              </span>
            </>
          )}
        </button>
      )}

      {/* Error message */}
      {displayError && (
        <p className="text-sm text-red-500 animate-shake">{displayError}</p>
      )}
    </div>
  );
}

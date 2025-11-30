import { useState, useRef, ChangeEvent } from 'react';
import { X, Upload, Loader2, Camera } from 'lucide-react';
import { compressImage, isValidImageType, isWithinSizeLimit, CompressedImage } from '../../lib/imageUtils';

interface GalleryImageFormProps {
  onSubmit: (data: {
    title_en: string;
    title_kn: string;
    image_data: string;
    file_size: number;
    compressed_size: number;
    mime_type: string;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function GalleryImageForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: GalleryImageFormProps) {
  const [titleEn, setTitleEn] = useState('');
  const [titleKn, setTitleKn] = useState('');
  const [image, setImage] = useState<CompressedImage | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!isValidImageType(file)) {
      setError('Please select a valid image (JPG, PNG, WebP)');
      return;
    }

    if (!isWithinSizeLimit(file, 10)) {
      setError('File too large. Maximum 10MB allowed.');
      return;
    }

    setIsCompressing(true);

    try {
      const compressed = await compressImage(file, 0.8, 1200);
      setImage(compressed);
    } catch {
      setError('Failed to process image. Please try again.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setError('Please upload an image');
      return;
    }

    await onSubmit({
      title_en: titleEn.trim(),
      title_kn: titleKn.trim(),
      image_data: image.base64,
      file_size: image.originalSize,
      compressed_size: image.compressedSize,
      mime_type: image.mimeType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Image <span className="text-red-500">*</span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {image ? (
          <div className="relative rounded-xl overflow-hidden border-2 border-green-200 bg-green-50">
            <img
              src={image.base64}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isCompressing}
            className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
              isCompressing
                ? 'opacity-50 cursor-not-allowed'
                : 'border-slate-300 bg-slate-50 hover:border-primary hover:bg-primary/5 cursor-pointer'
            }`}
          >
            {isCompressing ? (
              <>
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-sm text-slate-600">Compressing...</span>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <Camera className="w-6 h-6 text-slate-400" />
                  <Upload className="w-6 h-6 text-slate-400" />
                </div>
                <span className="text-sm text-slate-600">
                  Click to upload image
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Title English */}
      <div>
        <label
          htmlFor="title_en"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Title (English)
        </label>
        <input
          id="title_en"
          type="text"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          placeholder="Enter title in English"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Title Kannada */}
      <div>
        <label
          htmlFor="title_kn"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Title (Kannada)
        </label>
        <input
          id="title_kn"
          type="text"
          value={titleKn}
          onChange={(e) => setTitleKn(e.target.value)}
          placeholder="ಕನ್ನಡದಲ್ಲಿ ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isCompressing}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Add Image'
          )}
        </button>
      </div>
    </form>
  );
}

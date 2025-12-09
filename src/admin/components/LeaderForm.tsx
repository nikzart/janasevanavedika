import { useState, useRef, ChangeEvent } from 'react';
import { X, Upload, Loader2, Camera } from 'lucide-react';
import { compressImage, isValidImageType, isWithinSizeLimit, CompressedImage } from '../../lib/imageUtils';
import { LeaderCategory, LEADER_CATEGORIES, Leader } from '../../types';

interface LeaderFormProps {
  initialData?: Leader;
  onSubmit: (data: {
    name_en: string;
    name_kn: string;
    position_en: string;
    position_kn: string;
    image_data: string;
    file_size: number;
    compressed_size: number;
    mime_type: string;
    category: LeaderCategory;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const CATEGORY_ORDER: LeaderCategory[] = ['state', 'district', 'ward', 'area'];

export default function LeaderForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: LeaderFormProps) {
  const [nameEn, setNameEn] = useState(initialData?.name_en || '');
  const [nameKn, setNameKn] = useState(initialData?.name_kn || '');
  const [positionEn, setPositionEn] = useState(initialData?.position_en || '');
  const [positionKn, setPositionKn] = useState(initialData?.position_kn || '');
  const [category, setCategory] = useState<LeaderCategory>(initialData?.category || 'ward');
  const [image, setImage] = useState<CompressedImage | null>(
    initialData ? {
      base64: initialData.image_data,
      originalSize: initialData.file_size || 0,
      compressedSize: initialData.compressed_size || 0,
      mimeType: initialData.mime_type,
    } : null
  );
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

    if (!nameEn.trim()) {
      setError('Please enter name in English');
      return;
    }

    if (!nameKn.trim()) {
      setError('Please enter name in Kannada');
      return;
    }

    if (!positionEn.trim()) {
      setError('Please enter position in English');
      return;
    }

    if (!positionKn.trim()) {
      setError('Please enter position in Kannada');
      return;
    }

    if (!image) {
      setError('Please upload an image');
      return;
    }

    await onSubmit({
      name_en: nameEn.trim(),
      name_kn: nameKn.trim(),
      position_en: positionEn.trim(),
      position_kn: positionKn.trim(),
      image_data: image.base64,
      file_size: image.originalSize,
      compressed_size: image.compressedSize,
      mime_type: image.mimeType,
      category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Photo <span className="text-red-500">*</span>
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
                  Click to upload photo
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Name English */}
      <div>
        <label
          htmlFor="name_en"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Name (English) <span className="text-red-500">*</span>
        </label>
        <input
          id="name_en"
          type="text"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="Enter name in English"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Name Kannada */}
      <div>
        <label
          htmlFor="name_kn"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Name (Kannada) <span className="text-red-500">*</span>
        </label>
        <input
          id="name_kn"
          type="text"
          value={nameKn}
          onChange={(e) => setNameKn(e.target.value)}
          placeholder="ಕನ್ನಡದಲ್ಲಿ ಹೆಸರು ನಮೂದಿಸಿ"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Position English */}
      <div>
        <label
          htmlFor="position_en"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Position (English) <span className="text-red-500">*</span>
        </label>
        <input
          id="position_en"
          type="text"
          value={positionEn}
          onChange={(e) => setPositionEn(e.target.value)}
          placeholder="Enter position in English"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Position Kannada */}
      <div>
        <label
          htmlFor="position_kn"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Position (Kannada) <span className="text-red-500">*</span>
        </label>
        <input
          id="position_kn"
          type="text"
          value={positionKn}
          onChange={(e) => setPositionKn(e.target.value)}
          placeholder="ಕನ್ನಡದಲ್ಲಿ ಹುದ್ದೆ ನಮೂದಿಸಿ"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as LeaderCategory)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {CATEGORY_ORDER.map((cat) => (
            <option key={cat} value={cat}>
              {LEADER_CATEGORIES[cat].en}
            </option>
          ))}
        </select>
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
          ) : initialData ? (
            'Update Leader'
          ) : (
            'Add Leader'
          )}
        </button>
      </div>
    </form>
  );
}

import { useState } from 'react';
import { MapPin, Loader2, CheckCircle, Navigation } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { issueCategories } from '../data/issueCategories';
import { IssueFormData } from '../lib/issueApi';
import { CompressedImage } from '../lib/imageUtils';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import RadioGroup from './ui/RadioGroup';
import ImageUpload from './ui/ImageUpload';

interface IssueFormProps {
  onSubmit: (data: IssueFormData) => void;
  isSubmitting: boolean;
}

export default function IssueForm({ onSubmit, isSubmitting }: IssueFormProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    category: '',
    customCategory: '',
    description: '',
    locationText: '',
  });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [issuePhoto, setIssuePhoto] = useState<CompressedImage | null>(null);
  const [aadhaar, setAadhaar] = useState<CompressedImage | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = issueCategories.map((cat) => ({
    value: cat.id,
    label: cat.name[language],
  }));

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setGpsError(t({ en: 'GPS not supported', kn: 'GPS ಬೆಂಬಲಿತವಾಗಿಲ್ಲ' }));
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGpsLoading(false);
      },
      (error) => {
        console.error('GPS error:', error);
        setGpsError(
          t({
            en: 'Could not get location. Please enable GPS.',
            kn: 'ಸ್ಥಳ ಪಡೆಯಲಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು GPS ಸಕ್ರಿಯಗೊಳಿಸಿ.',
          })
        );
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t({ en: 'Name is required', kn: 'ಹೆಸರು ಅಗತ್ಯವಿದೆ' });
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = t({ en: 'Mobile number is required', kn: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ' });
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = t({ en: 'Enter valid 10-digit mobile', kn: 'ಮಾನ್ಯ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ನಮೂದಿಸಿ' });
    }

    if (!formData.category) {
      newErrors.category = t({ en: 'Select a category', kn: 'ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ' });
    }

    if (formData.category === 'other' && !formData.customCategory.trim()) {
      newErrors.customCategory = t({ en: 'Specify the category', kn: 'ವರ್ಗವನ್ನು ನಿರ್ದಿಷ್ಟಪಡಿಸಿ' });
    }

    if (!formData.description.trim()) {
      newErrors.description = t({ en: 'Description is required', kn: 'ವಿವರಣೆ ಅಗತ್ಯವಿದೆ' });
    }

    if (!formData.locationText.trim()) {
      newErrors.locationText = t({ en: 'Location is required', kn: 'ಸ್ಥಳ ಅಗತ್ಯವಿದೆ' });
    }

    if (!aadhaar) {
      newErrors.aadhaar = t({ en: 'Aadhaar card is required', kn: 'ಆಧಾರ್ ಕಾರ್ಡ್ ಅಗತ್ಯವಿದೆ' });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name,
      mobile: formData.mobile,
      category: formData.category,
      customCategory: formData.customCategory || undefined,
      description: formData.description,
      locationText: formData.locationText,
      latitude: coords?.lat,
      longitude: coords?.lng,
      issuePhoto: issuePhoto || undefined,
      aadhaar: aadhaar || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <Input
        id="name"
        label={t({ en: 'Your Name', kn: 'ನಿಮ್ಮ ಹೆಸರು' })}
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder={t({ en: 'Enter your full name', kn: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ' })}
        required
        error={errors.name}
      />

      {/* Mobile */}
      <Input
        id="mobile"
        type="tel"
        label={t({ en: 'Mobile Number', kn: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' })}
        value={formData.mobile}
        onChange={(e) => handleInputChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
        placeholder="9876543210"
        required
        error={errors.mobile}
      />

      {/* Category */}
      <RadioGroup
        name="category"
        label={t({ en: 'Issue Category', kn: 'ಸಮಸ್ಯೆಯ ವರ್ಗ' })}
        options={categoryOptions}
        value={formData.category}
        onChange={(value) => handleInputChange('category', value)}
        required
        error={errors.category}
      />

      {/* Custom Category (if Other selected) */}
      {formData.category === 'other' && (
        <Input
          id="customCategory"
          label={t({ en: 'Specify Category', kn: 'ವರ್ಗವನ್ನು ನಿರ್ದಿಷ್ಟಪಡಿಸಿ' })}
          value={formData.customCategory}
          onChange={(e) => handleInputChange('customCategory', e.target.value)}
          placeholder={t({ en: 'Enter the issue type', kn: 'ಸಮಸ್ಯೆಯ ಪ್ರಕಾರವನ್ನು ನಮೂದಿಸಿ' })}
          required
          error={errors.customCategory}
        />
      )}

      {/* Description */}
      <Textarea
        id="description"
        label={t({ en: 'Issue Description', kn: 'ಸಮಸ್ಯೆಯ ವಿವರಣೆ' })}
        value={formData.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        placeholder={t({
          en: 'Describe the issue in detail...',
          kn: 'ಸಮಸ್ಯೆಯನ್ನು ವಿವರವಾಗಿ ವಿವರಿಸಿ...',
        })}
        required
        error={errors.description}
      />

      {/* Issue Photo (Optional) */}
      <ImageUpload
        id="issuePhoto"
        label={t({ en: 'Issue Photo (Optional)', kn: 'ಸಮಸ್ಯೆಯ ಫೋಟೋ (ಐಚ್ಛಿಕ)' })}
        value={issuePhoto}
        onChange={setIssuePhoto}
      />

      {/* Location Text */}
      <Input
        id="locationText"
        label={t({ en: 'Location / Address', kn: 'ಸ್ಥಳ / ವಿಳಾಸ' })}
        value={formData.locationText}
        onChange={(e) => handleInputChange('locationText', e.target.value)}
        placeholder={t({
          en: 'Enter area, landmark, street name...',
          kn: 'ಪ್ರದೇಶ, ಹೆಗ್ಗುರುತು, ಬೀದಿ ಹೆಸರು...',
        })}
        required
        error={errors.locationText}
      />

      {/* GPS Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          {t({ en: 'GPS Location', kn: 'GPS ಸ್ಥಳ' })}
        </label>
        <button
          type="button"
          onClick={getLocation}
          disabled={gpsLoading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
            coords
              ? 'border-green-300 bg-green-50 text-green-700'
              : 'border-slate-300 bg-white text-slate-700 hover:border-primary'
          }`}
        >
          {gpsLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t({ en: 'Getting location...', kn: 'ಸ್ಥಳ ಪಡೆಯಲಾಗುತ್ತಿದೆ...' })}
            </>
          ) : coords ? (
            <>
              <CheckCircle className="w-5 h-5" />
              {t({ en: 'Location captured', kn: 'ಸ್ಥಳ ಸೆರೆಹಿಡಿಯಲಾಗಿದೆ' })}
            </>
          ) : (
            <>
              <Navigation className="w-5 h-5" />
              {t({ en: 'Capture GPS Location', kn: 'GPS ಸ್ಥಳ ಸೆರೆಹಿಡಿಯಿರಿ' })}
            </>
          )}
        </button>
        {coords && (
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
          </p>
        )}
        {gpsError && <p className="text-sm text-red-500">{gpsError}</p>}
      </div>

      {/* Aadhaar Card */}
      <ImageUpload
        id="aadhaar"
        label={t({ en: 'Aadhaar Card', kn: 'ಆಧಾರ್ ಕಾರ್ಡ್' })}
        value={aadhaar}
        onChange={setAadhaar}
        required
        error={errors.aadhaar}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t({ en: 'Submitting...', kn: 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...' })}
          </>
        ) : (
          t({ en: 'Submit & Send to WhatsApp', kn: 'ಸಲ್ಲಿಸಿ ಮತ್ತು WhatsApp ಗೆ ಕಳುಹಿಸಿ' })
        )}
      </button>
    </form>
  );
}

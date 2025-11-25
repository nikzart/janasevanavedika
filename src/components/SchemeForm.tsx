import { useState, useEffect, FormEvent } from 'react';
import { MessageCircle, Info, CheckCircle, FileText, Gift } from 'lucide-react';
import { Scheme, LeadFormData } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import RadioGroup from './ui/RadioGroup';
import Checkbox from './ui/Checkbox';
import Textarea from './ui/Textarea';
import ImageUpload from './ui/ImageUpload';
import { CompressedImage } from '../lib/imageUtils';

interface SchemeFormProps {
  scheme: Scheme;
  onSubmit: (data: LeadFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function SchemeForm({ scheme, onSubmit, isSubmitting }: SchemeFormProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'info' | 'apply'>('info');
  const [formData, setFormData] = useState<LeadFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data with default values
  useEffect(() => {
    const initialData: LeadFormData = {};
    scheme.fields.forEach((field) => {
      if (field.type === 'checkbox') {
        initialData[field.id] = false;
      } else if (field.type === 'image') {
        initialData[field.id] = null;
      } else if (field.type === 'select' && field.options?.length) {
        initialData[field.id] = '';
      } else {
        initialData[field.id] = '';
      }
    });
    setFormData(initialData);
    setErrors({});
  }, [scheme]);

  const handleChange = (fieldId: string, value: string | boolean | CompressedImage | null) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error when user types
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    scheme.fields.forEach((field) => {
      const value = formData[field.id];

      // Check required fields
      if (field.required) {
        if (field.type === 'image') {
          if (!value || value === null) {
            newErrors[field.id] = t({ en: 'Please upload this document', kn: 'ದಯವಿಟ್ಟು ಈ ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' });
          }
        } else if (value === '' || value === undefined || value === null) {
          newErrors[field.id] = t({ en: 'This field is required', kn: 'ಈ ಕ್ಷೇತ್ರ ಅಗತ್ಯವಿದೆ' });
        }
      }

      if (field.validation && typeof value === 'string') {
        if (field.validation.minLength && value.length < field.validation.minLength) {
          newErrors[field.id] = t({
            en: `Minimum ${field.validation.minLength} characters required`,
            kn: `ಕನಿಷ್ಠ ${field.validation.minLength} ಅಕ್ಷರಗಳು ಅಗತ್ಯ`,
          });
        }
        if (field.validation.maxLength && value.length > field.validation.maxLength) {
          newErrors[field.id] = t({
            en: `Maximum ${field.validation.maxLength} characters allowed`,
            kn: `ಗರಿಷ್ಠ ${field.validation.maxLength} ಅಕ್ಷರಗಳು ಅನುಮತಿಸಲಾಗಿದೆ`,
          });
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  const renderField = (field: typeof scheme.fields[0]) => {
    const label = t(field.label);
    const placeholder = field.placeholder ? t(field.placeholder) : undefined;
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <Input
            key={field.id}
            id={field.id}
            type={field.type === 'number' ? 'tel' : 'text'}
            label={label}
            placeholder={placeholder}
            value={formData[field.id] as string || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            error={error}
            inputMode={field.type === 'number' ? 'numeric' : 'text'}
          />
        );

      case 'select':
        return (
          <Select
            key={field.id}
            id={field.id}
            label={label}
            placeholder={t({ en: 'Select...', kn: 'ಆಯ್ಕೆಮಾಡಿ...' })}
            options={(field.options || []).map((opt) => ({
              value: opt.value,
              label: t(opt.label),
            }))}
            value={formData[field.id] as string || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            error={error}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            key={field.id}
            name={field.id}
            label={label}
            options={(field.options || []).map((opt) => ({
              value: opt.value,
              label: t(opt.label),
            }))}
            value={formData[field.id] as string || ''}
            onChange={(value) => handleChange(field.id, value)}
            required={field.required}
            error={error}
          />
        );

      case 'checkbox':
        return (
          <Checkbox
            key={field.id}
            id={field.id}
            label={label}
            checked={formData[field.id] as boolean || false}
            onChange={(e) => handleChange(field.id, e.target.checked)}
          />
        );

      case 'textarea':
        return (
          <Textarea
            key={field.id}
            id={field.id}
            label={label}
            placeholder={placeholder}
            value={formData[field.id] as string || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            error={error}
          />
        );

      case 'image':
        return (
          <ImageUpload
            key={field.id}
            id={field.id}
            label={label}
            value={formData[field.id] as CompressedImage | null}
            onChange={(data) => handleChange(field.id, data)}
            required={field.required}
            error={error}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 animate-initial animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-95 ${
            activeTab === 'info'
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Info className="w-4 h-4" />
          {t({ en: 'Info', kn: 'ಮಾಹಿತಿ' })}
        </button>
        <button
          onClick={() => setActiveTab('apply')}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-95 ${
            activeTab === 'apply'
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          {t({ en: 'Apply', kn: 'ಅರ್ಜಿ' })}
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'info' ? (
          <div className="space-y-5">
            {/* Scheme Header with Tagline */}
            <div
              className="p-4 rounded-xl animate-initial animate-fade-in-up"
              style={{ backgroundColor: `${scheme.colorAccent}10`, animationDelay: '0.1s' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${scheme.colorAccent}20` }}
                >
                  <Gift className="w-6 h-6" style={{ color: scheme.colorAccent }} />
                </div>
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: scheme.colorAccent }}
                  >
                    {t(scheme.name)}
                  </h3>
                  <p className="text-slate-500 text-sm mt-0.5">{t(scheme.tagline)}</p>
                </div>
              </div>
            </div>

            {/* Benefit */}
            <div
              className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 animate-initial animate-fade-in-up"
              style={{ animationDelay: '0.15s' }}
            >
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">₹</span>
                </span>
                {t({ en: 'Benefit', kn: 'ಪ್ರಯೋಜನ' })}
              </h4>
              <p className="text-green-900 text-sm leading-relaxed">{t(scheme.benefit)}</p>
            </div>

            {/* Eligibility */}
            <div
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm animate-initial animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                {t({ en: 'Eligibility', kn: 'ಅರ್ಹತೆ' })}
              </h4>
              <ul className="space-y-3">
                {(language === 'kn' ? scheme.eligibility.kn : scheme.eligibility.en).map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-medium text-white"
                      style={{ backgroundColor: scheme.colorAccent }}
                    >
                      {index + 1}
                    </span>
                    <span className={`text-sm leading-relaxed ${language === 'kn' ? 'font-kannada' : ''}`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div
              className="bg-amber-50 p-4 rounded-xl border border-amber-100 animate-initial animate-fade-in-up"
              style={{ animationDelay: '0.25s' }}
            >
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                {t({ en: 'Required Documents', kn: 'ಅಗತ್ಯ ದಾಖಲೆಗಳು' })}
              </h4>
              <ul className="space-y-2">
                {scheme.requiredDocuments.map((doc, index) => (
                  <li key={index} className="flex items-center gap-2 text-amber-900 text-sm">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                    <span className={language === 'kn' ? 'font-kannada' : ''}>{t(doc)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Apply CTA */}
            <div
              className="pt-2 animate-initial animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <button
                onClick={() => setActiveTab('apply')}
                className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 btn-press transition-all hover:opacity-90"
                style={{ backgroundColor: scheme.colorAccent }}
              >
                <MessageCircle className="w-5 h-5" />
                {t({ en: 'Apply Now', kn: 'ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' })}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {scheme.fields.map((field, index) => (
              <div
                key={field.id}
                className="animate-initial animate-fade-in-up"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                {renderField(field)}
              </div>
            ))}

            {/* Submit Button */}
            <div className="pt-4 animate-initial animate-fade-in-up" style={{ animationDelay: `${0.1 + scheme.fields.length * 0.05 + 0.1}s` }}>
              <Button
                type="submit"
                variant="whatsapp"
                size="lg"
                className="w-full gap-2"
                isLoading={isSubmitting}
              >
                <MessageCircle className="w-5 h-5" />
                {t({ en: 'Send to Ravi', kn: 'ರವಿಗೆ ಕಳುಹಿಸಿ' })}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

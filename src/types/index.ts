export type Language = 'en' | 'kn';

export type SchemeType = 'GL' | 'GJ' | 'YN' | 'SH' | 'AB';

export interface BilingualText {
  en: string;
  kn: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'image';
  label: BilingualText;
  placeholder?: BilingualText;
  required?: boolean;
  options?: { value: string; label: BilingualText }[];
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
  };
}

export interface DocumentUpload {
  base64: string;
  originalSize: number;
  compressedSize: number;
  mimeType: string;
}

export interface Scheme {
  id: SchemeType;
  name: BilingualText;
  tagline: BilingualText;
  description: BilingualText;
  benefit: BilingualText;
  eligibility: {
    en: string[];
    kn: string[];
  };
  requiredDocuments: BilingualText[];
  colorAccent: string;
  icon: string; // Lucide icon name
  benefitBadge: string; // e.g., "₹2,000/month"
  fields: FormField[];
  whatsappTemplate: string;
}

export interface LeadFormData {
  [key: string]: string | boolean | DocumentUpload | null;
}

export interface Lead {
  id: string;
  created_at: string;
  scheme_type: SchemeType;
  applicant_name: string;
  mobile_number: string;
  ward_no?: string;
  form_data: LeadFormData;
  status: 'pending' | 'processed' | 'rejected';
  admin_notes?: string;
  is_whatsapp_clicked: boolean;
}

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

export interface GalleryImage {
  id: string;
  created_at: string;
  title_en: string;
  title_kn: string;
  image_data: string;
  file_size: number | null;
  compressed_size: number | null;
  mime_type: string;
  display_order: number;
  is_active: boolean;
}

// Leader category hierarchy levels
export type LeaderCategory = 'state' | 'district' | 'ward' | 'area';

export interface Leader {
  id: string;
  created_at: string;
  name_en: string;
  name_kn: string;
  position_en: string;
  position_kn: string;
  image_data: string;
  file_size: number | null;
  compressed_size: number | null;
  mime_type: string;
  category: LeaderCategory;
  mobile_number: string | null;
  whatsapp_number: string | null;
  area_name_en: string | null;
  area_name_kn: string | null;
  display_order: number;
  is_active: boolean;
}

// Bilingual labels for leader categories
export const LEADER_CATEGORIES: Record<LeaderCategory, BilingualText> = {
  state: { en: 'State Level', kn: 'ರಾಜ್ಯ ಮಟ್ಟ' },
  district: { en: 'District Level', kn: 'ಜಿಲ್ಲಾ ಮಟ್ಟ' },
  ward: { en: 'Ward Level', kn: 'ವಾರ್ಡ್ ಮಟ್ಟ' },
  area: { en: 'Area Level', kn: 'ಪ್ರದೇಶ ಮಟ್ಟ' },
};

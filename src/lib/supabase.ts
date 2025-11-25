import { createClient } from '@supabase/supabase-js';
import { SchemeType, LeadFormData } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Database features will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface SubmitLeadParams {
  schemeType: SchemeType;
  applicantName: string;
  mobileNumber: string;
  formData: LeadFormData;
  wardNo?: string;
}

export async function submitLead({
  schemeType,
  applicantName,
  mobileNumber,
  formData,
  wardNo,
}: SubmitLeadParams): Promise<{ success: boolean; error?: string }> {
  // If Supabase is not configured, just return success
  // This allows the app to work even without database
  if (!supabase) {
    console.log('Supabase not configured, skipping database save');
    return { success: true };
  }

  try {
    const { error } = await supabase.from('leads').insert({
      scheme_type: schemeType,
      applicant_name: applicantName,
      mobile_number: mobileNumber,
      ward_no: wardNo,
      form_data: formData,
      is_whatsapp_clicked: true,
    });

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error submitting lead:', err);
    return { success: false, error: 'Failed to submit lead' };
  }
}

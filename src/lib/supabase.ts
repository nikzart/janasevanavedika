import { createClient } from '@supabase/supabase-js';
import { SchemeType, LeadFormData, DocumentUpload } from '../types';
import { getDocumentTypeFromFieldId } from './imageUtils';

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

interface DocumentData {
  fieldId: string;
  documentType: string;
  data: DocumentUpload;
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
    // Separate documents from regular form data
    const documents: DocumentData[] = [];
    const cleanFormData: LeadFormData = {};

    for (const [key, value] of Object.entries(formData)) {
      if (key.startsWith('doc_') && value && typeof value === 'object' && 'base64' in value) {
        // This is a document upload
        documents.push({
          fieldId: key,
          documentType: getDocumentTypeFromFieldId(key),
          data: value as DocumentUpload,
        });
      } else {
        // Regular form field
        cleanFormData[key] = value;
      }
    }

    // Generate UUID client-side (avoids need for SELECT after INSERT)
    const leadId = crypto.randomUUID();

    // Insert lead first
    const { error: leadError } = await supabase
      .from('leads')
      .insert({
        id: leadId,
        scheme_type: schemeType,
        applicant_name: applicantName,
        mobile_number: mobileNumber,
        ward_no: wardNo,
        form_data: cleanFormData,
        is_whatsapp_clicked: true,
      });

    if (leadError) {
      console.error('Supabase error (lead):', leadError);
      return { success: false, error: leadError.message };
    }

    // Insert documents if any
    if (documents.length > 0) {
      const documentInserts = documents.map((doc) => ({
        lead_id: leadId,
        document_type: doc.documentType,
        document_name: doc.fieldId.replace(/^doc_/, '').replace(/_/g, ' '),
        image_data: doc.data.base64,
        file_size: doc.data.originalSize,
        compressed_size: doc.data.compressedSize,
        mime_type: doc.data.mimeType,
      }));

      const { error: docError } = await supabase
        .from('lead_documents')
        .insert(documentInserts);

      if (docError) {
        console.error('Supabase error (documents):', docError);
        // Don't fail the whole submission if documents fail
        // The lead is already saved
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Error submitting lead:', err);
    return { success: false, error: 'Failed to submit lead' };
  }
}

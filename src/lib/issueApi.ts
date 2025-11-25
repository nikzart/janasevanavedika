import { supabase } from './supabase';
import { DocumentUpload } from '../types';

export interface IssueFormData {
  name: string;
  mobile: string;
  category: string;
  customCategory?: string;
  description: string;
  locationText: string;
  latitude?: number;
  longitude?: number;
  issuePhoto?: DocumentUpload;
  aadhaar?: DocumentUpload;
}

interface DocumentData {
  documentType: string;
  documentName: string;
  data: DocumentUpload;
}

export async function submitIssue(
  formData: IssueFormData
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    console.log('Supabase not configured, skipping database save');
    return { success: true };
  }

  try {
    // Collect documents
    const documents: DocumentData[] = [];

    if (formData.issuePhoto) {
      documents.push({
        documentType: 'issue_photo',
        documentName: 'Issue Photo',
        data: formData.issuePhoto,
      });
    }

    if (formData.aadhaar) {
      documents.push({
        documentType: 'aadhaar',
        documentName: 'Aadhaar Card',
        data: formData.aadhaar,
      });
    }

    // Generate UUID client-side
    const issueId = crypto.randomUUID();

    // Insert issue
    const { error: issueError } = await supabase.from('issues').insert({
      id: issueId,
      reporter_name: formData.name,
      mobile_number: formData.mobile,
      category: formData.category,
      custom_category: formData.customCategory || null,
      description: formData.description,
      location_text: formData.locationText,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
    });

    if (issueError) {
      console.error('Supabase error (issue):', issueError);
      return { success: false, error: issueError.message };
    }

    // Insert documents if any
    if (documents.length > 0) {
      const documentInserts = documents.map((doc) => ({
        issue_id: issueId,
        document_type: doc.documentType,
        document_name: doc.documentName,
        image_data: doc.data.base64,
        file_size: doc.data.originalSize,
        mime_type: doc.data.mimeType,
      }));

      const { error: docError } = await supabase
        .from('issue_documents')
        .insert(documentInserts);

      if (docError) {
        console.error('Supabase error (documents):', docError);
        // Don't fail the whole submission if documents fail
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Error submitting issue:', err);
    return { success: false, error: 'Failed to submit issue' };
  }
}

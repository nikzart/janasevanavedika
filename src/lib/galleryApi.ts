import { supabase } from './supabase';
import { GalleryImage } from '../types';

// Public function - fetches only active images for public gallery
export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return [];
  }

  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }

  return data || [];
}

// Admin function - fetches all images (active and inactive)
export async function fetchAllGalleryImages(): Promise<GalleryImage[]> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return [];
  }

  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all gallery images:', error);
    return [];
  }

  return data || [];
}

interface AddGalleryImageParams {
  title_en: string;
  title_kn: string;
  image_data: string;
  file_size?: number;
  compressed_size?: number;
  mime_type?: string;
  display_order?: number;
  is_active?: boolean;
}

export async function addGalleryImage(
  params: AddGalleryImageParams
): Promise<{ success: boolean; error?: string; id?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  const id = crypto.randomUUID();

  const { error } = await supabase.from('gallery_images').insert({
    id,
    title_en: params.title_en,
    title_kn: params.title_kn,
    image_data: params.image_data,
    file_size: params.file_size || null,
    compressed_size: params.compressed_size || null,
    mime_type: params.mime_type || 'image/jpeg',
    display_order: params.display_order || 0,
    is_active: params.is_active ?? true,
  });

  if (error) {
    console.error('Error adding gallery image:', error);
    return { success: false, error: error.message };
  }

  return { success: true, id };
}

export async function updateGalleryImage(
  id: string,
  updates: Partial<Omit<GalleryImage, 'id' | 'created_at'>>
): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const { error } = await supabase
    .from('gallery_images')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating gallery image:', error);
    return false;
  }

  return true;
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting gallery image:', error);
    return false;
  }

  return true;
}

export async function toggleGalleryImageActive(
  id: string,
  isActive: boolean
): Promise<boolean> {
  return updateGalleryImage(id, { is_active: isActive });
}

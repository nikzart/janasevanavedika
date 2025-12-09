import { supabase } from './supabase';
import { Leader, LeaderCategory } from '../types';

// Public function - fetches only active leaders for public page
export async function fetchLeaders(category?: LeaderCategory): Promise<Leader[]> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return [];
  }

  let query = supabase
    .from('leaders')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching leaders:', error);
    return [];
  }

  return data || [];
}

// Admin function - fetches all leaders (active and inactive)
export async function fetchAllLeaders(): Promise<Leader[]> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return [];
  }

  const { data, error } = await supabase
    .from('leaders')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all leaders:', error);
    return [];
  }

  return data || [];
}

export interface AddLeaderParams {
  name_en: string;
  name_kn: string;
  position_en: string;
  position_kn: string;
  image_data: string;
  file_size?: number;
  compressed_size?: number;
  mime_type?: string;
  category: LeaderCategory;
  display_order?: number;
  is_active?: boolean;
}

export async function addLeader(
  params: AddLeaderParams
): Promise<{ success: boolean; error?: string; id?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  const id = crypto.randomUUID();

  const { error } = await supabase.from('leaders').insert({
    id,
    name_en: params.name_en,
    name_kn: params.name_kn,
    position_en: params.position_en,
    position_kn: params.position_kn,
    image_data: params.image_data,
    file_size: params.file_size || null,
    compressed_size: params.compressed_size || null,
    mime_type: params.mime_type || 'image/jpeg',
    category: params.category,
    display_order: params.display_order || 0,
    is_active: params.is_active ?? true,
  });

  if (error) {
    console.error('Error adding leader:', error);
    return { success: false, error: error.message };
  }

  return { success: true, id };
}

export async function updateLeader(
  id: string,
  updates: Partial<Omit<Leader, 'id' | 'created_at'>>
): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const { error } = await supabase
    .from('leaders')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating leader:', error);
    return false;
  }

  return true;
}

export async function deleteLeader(id: string): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const { error } = await supabase
    .from('leaders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting leader:', error);
    return false;
  }

  return true;
}

export async function toggleLeaderActive(
  id: string,
  isActive: boolean
): Promise<boolean> {
  return updateLeader(id, { is_active: isActive });
}

// Reorder leaders - update display_order for multiple leaders
export async function reorderLeaders(
  orderedIds: { id: string; display_order: number }[]
): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const client = supabase;
  // Use Promise.all for batch updates
  const updates = orderedIds.map(({ id, display_order }) =>
    client.from('leaders').update({ display_order }).eq('id', id)
  );

  const results = await Promise.all(updates);
  return results.every((result) => !result.error);
}

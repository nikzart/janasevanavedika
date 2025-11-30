import { supabase } from './supabase';

// Cache for settings to avoid repeated API calls
let settingsCache: Record<string, string> = {};
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute cache

/**
 * Get a setting value by key
 */
export async function getSetting(key: string): Promise<string> {
  // Check cache first
  const now = Date.now();
  if (settingsCache[key] !== undefined && now - cacheTimestamp < CACHE_TTL) {
    return settingsCache[key];
  }

  if (!supabase) {
    console.warn('Supabase not configured');
    return '';
  }

  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error('Error fetching setting:', error);
    return '';
  }

  // Update cache
  settingsCache[key] = data?.value || '';
  cacheTimestamp = now;

  return data?.value || '';
}

/**
 * Get WhatsApp number from settings
 */
export async function getWhatsAppNumber(): Promise<string> {
  return getSetting('whatsapp_number');
}

/**
 * Update a setting value (admin only)
 */
export async function updateSetting(key: string, value: string): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return false;
  }

  // Try to update first
  const { error: updateError } = await supabase
    .from('settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key);

  if (updateError) {
    // If update fails (row doesn't exist), try insert
    const { error: insertError } = await supabase
      .from('settings')
      .insert({ key, value });

    if (insertError) {
      console.error('Error updating setting:', insertError);
      return false;
    }
  }

  // Clear cache
  settingsCache[key] = value;
  cacheTimestamp = Date.now();

  return true;
}

/**
 * Update WhatsApp number (admin only)
 */
export async function updateWhatsAppNumber(number: string): Promise<boolean> {
  return updateSetting('whatsapp_number', number);
}

/**
 * Get all settings (admin only)
 */
export async function getAllSettings(): Promise<Record<string, string>> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return {};
  }

  const { data, error } = await supabase
    .from('settings')
    .select('key, value');

  if (error) {
    console.error('Error fetching settings:', error);
    return {};
  }

  const settings: Record<string, string> = {};
  data?.forEach((row) => {
    settings[row.key] = row.value;
  });

  return settings;
}

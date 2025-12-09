import { supabase } from './supabase';
import type { BilingualText } from '../types';

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
    .maybeSingle();

  if (error) {
    console.error('Error fetching setting:', error);
    return '';
  }

  // Update cache
  const value = data?.value || '';
  settingsCache[key] = value;
  cacheTimestamp = now;

  return value;
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

  // Use upsert - insert if not exists, update if exists
  const { error } = await supabase
    .from('settings')
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );

  if (error) {
    console.error('Error updating setting:', error);
    return false;
  }

  // Update cache
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

/**
 * Get scrolling text items for homepage marquee
 */
export async function getScrollingText(): Promise<BilingualText[]> {
  const json = await getSetting('scrolling_text');
  if (!json) return [];

  try {
    const items = JSON.parse(json);
    if (Array.isArray(items)) {
      return items;
    }
    return [];
  } catch {
    console.error('Error parsing scrolling text JSON');
    return [];
  }
}

/**
 * Update scrolling text items (admin only)
 */
export async function updateScrollingText(items: BilingualText[]): Promise<boolean> {
  const json = JSON.stringify(items);
  return updateSetting('scrolling_text', json);
}

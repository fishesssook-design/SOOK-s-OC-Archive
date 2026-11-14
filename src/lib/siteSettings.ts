import { supabase } from '@/lib/supabase';

export interface SiteSettings {
  title: string;
  subtitle: string;
  intro: string;
}

export const SITE_SETTINGS_LIMITS = {
  title: 40,
  subtitle: 80,
  intro: 500,
} as const;

const SITE_SETTINGS_ID = 1;

function isSiteSettings(value: unknown): value is SiteSettings {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Record<string, unknown>;
  return typeof row.title === 'string' && typeof row.subtitle === 'string' && typeof row.intro === 'string';
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('title, subtitle, intro')
    .eq('id', SITE_SETTINGS_ID)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!isSiteSettings(data)) throw new Error('Unexpected site settings response');
  return data;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const { data, error } = await supabase
    .from('site_settings')
    .update(settings)
    .eq('id', SITE_SETTINGS_ID)
    .select('id')
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Site settings update affected no rows');
}

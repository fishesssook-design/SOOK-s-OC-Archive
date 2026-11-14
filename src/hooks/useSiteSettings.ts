import { useEffect, useState } from 'react';
import { fetchSiteSettings, type SiteSettings } from '@/lib/siteSettings';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let active = true;

    fetchSiteSettings()
      .then((data) => {
        if (active) setSettings(data);
      })
      .catch((err: unknown) => {
        console.error('[settings] could not load site settings:', err);
      });

    return () => {
      active = false;
    };
  }, []);

  return { settings, updateSettings: setSettings };
}

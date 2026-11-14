import type { SiteSettings } from '@/lib/siteSettings';

interface Props {
  settings: SiteSettings;
}

export function CatalogIntro({ settings }: Props) {
  if (!settings.subtitle && !settings.intro) return null;

  return (
    <section className="mb-8 space-y-3">
      {settings.subtitle && <p className="text-sm font-medium text-zinc-500">{settings.subtitle}</p>}
      {settings.intro && (
        <p className="whitespace-pre-line text-base leading-relaxed text-zinc-700">{settings.intro}</p>
      )}
    </section>
  );
}

import { useState, type FormEvent } from 'react';
import { Save } from 'lucide-react';
import { saveSiteSettings, SITE_SETTINGS_LIMITS, type SiteSettings } from '@/lib/siteSettings';

interface Props {
  initial: SiteSettings;
  onSaved: (settings: SiteSettings) => void;
}

type Status = { tone: 'success' | 'error'; text: string } | null;

const INPUT_CLASS =
  'w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300/60';

export function SiteSettingsForm({ initial, onSaved }: Props) {
  const [title, setTitle] = useState(initial.title);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [intro, setIntro] = useState(initial.intro);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const next: SiteSettings = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      intro: intro.trim(),
    };

    if (!next.title) {
      setStatus({ tone: 'error', text: '사이트 타이틀을 입력해 주세요.' });
      return;
    }

    setSaving(true);
    setStatus(null);
    try {
      await saveSiteSettings(next);
      onSaved(next);
      setStatus({ tone: 'success', text: '저장되었습니다. 사이트에 바로 반영됩니다.' });
    } catch (err) {
      console.error('[settings] save failed:', err);
      setStatus({ tone: 'error', text: '저장하지 못했습니다. 잠시 후 다시 시도해 주세요.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="space-y-2">
        <label htmlFor="site-title" className="block text-sm font-semibold text-zinc-800">
          사이트 타이틀
        </label>
        <input
          id="site-title"
          type="text"
          maxLength={SITE_SETTINGS_LIMITS.title}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={INPUT_CLASS}
        />
        <p className="text-xs text-zinc-500">
          {title.length} / {SITE_SETTINGS_LIMITS.title}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="site-subtitle" className="block text-sm font-semibold text-zinc-800">
          부제목
        </label>
        <input
          id="site-subtitle"
          type="text"
          maxLength={SITE_SETTINGS_LIMITS.subtitle}
          value={subtitle}
          onChange={(event) => setSubtitle(event.target.value)}
          className={INPUT_CLASS}
        />
        <p className="text-xs text-zinc-500">
          {subtitle.length} / {SITE_SETTINGS_LIMITS.subtitle}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="site-intro" className="block text-sm font-semibold text-zinc-800">
          소개 문구
        </label>
        <textarea
          id="site-intro"
          rows={5}
          maxLength={SITE_SETTINGS_LIMITS.intro}
          value={intro}
          onChange={(event) => setIntro(event.target.value)}
          className={`${INPUT_CLASS} resize-y leading-relaxed`}
        />
        <p className="text-xs text-zinc-500">
          {intro.length} / {SITE_SETTINGS_LIMITS.intro}
        </p>
      </div>

      {status && (
        <p
          role={status.tone === 'error' ? 'alert' : 'status'}
          className={`rounded-lg px-4 py-3 text-sm ${
            status.tone === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'
          }`}
        >
          {status.text}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-yellow-400 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {saving ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </form>
  );
}

import { ArrowLeft } from 'lucide-react';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { SiteSettingsForm } from '@/components/admin/SiteSettingsForm';
import type { SiteSettings } from '@/lib/siteSettings';
import { navigate } from '@/lib/navigation';

interface Props {
  settings: SiteSettings;
  onSaved: (settings: SiteSettings) => void;
}

export function AdminPage({ settings, onSaved }: Props) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <AdminTabs active="settings" />

      <button
        type="button"
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        카탈로그로 돌아가기
      </button>

      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">사이트 설정</h1>
        <p className="text-sm text-zinc-500">사이트 타이틀, 부제목, 소개 문구를 수정할 수 있습니다.</p>
      </header>

      <SiteSettingsForm initial={settings} onSaved={onSaved} />
    </main>
  );
}

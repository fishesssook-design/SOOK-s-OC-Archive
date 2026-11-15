import { StatusMessage } from '@/components/common/StatusMessage';
import type { AdminRoute } from '@/lib/navigation';
import type { SiteSettings } from '@/lib/siteSettings';
import { AdminCharacterFormPage } from '@/pages/AdminCharacterFormPage';
import { AdminCharactersPage } from '@/pages/AdminCharactersPage';
import { AdminGrowthProfilePage } from '@/pages/AdminGrowthProfilePage';
import { AdminPage } from '@/pages/AdminPage';

interface Props {
  route: AdminRoute;
  settings: SiteSettings | null;
  onSettingsSaved: (settings: SiteSettings) => void;
}

export function AdminRoutes({ route, settings, onSettingsSaved }: Props) {
  switch (route.kind) {
    case 'characters':
      return <AdminCharactersPage />;
    case 'character-new':
      return <AdminCharacterFormPage characterId={null} />;
    case 'character-edit':
      return <AdminCharacterFormPage characterId={route.id} />;
    case 'growth-new':
      return <AdminGrowthProfilePage characterId={route.characterId} age={null} />;
    case 'growth-edit':
      return <AdminGrowthProfilePage characterId={route.characterId} age={route.age} />;
    case 'settings':
      return settings ? (
        <AdminPage settings={settings} onSaved={onSettingsSaved} />
      ) : (
        <StatusMessage message="사이트 설정을 불러오는 중입니다." />
      );
  }
}

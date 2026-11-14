import { useEffect, useState } from 'react';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { StatusMessage } from '@/components/common/StatusMessage';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { useAuthSession } from '@/hooks/useAuthSession';
import { AdminContext } from '@/hooks/useIsAdmin';
import { useLocation } from '@/hooks/useLocation';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { getAdminRoute, getCharacterIdFromPath, getGrowthRouteFromPath, navigate } from '@/lib/navigation';
import { AdminRoutes } from '@/pages/AdminRoutes';
import { CatalogPage } from '@/pages/CatalogPage';
import { CharacterPage } from '@/pages/CharacterPage';
import { GrowthProfilePage } from '@/pages/GrowthProfilePage';

function App() {
  const session = useAuthSession();

  if (session === undefined) return <div className="min-h-screen bg-white" />;
  if (session === null) return <LoginScreen />;

  return <Catalog userId={session.user.id} />;
}

interface CatalogProps {
  userId: string;
}

function Catalog({ userId }: CatalogProps) {
  const { pathname, search } = useLocation();
  const characterId = getCharacterIdFromPath(pathname);
  const growthRoute = getGrowthRouteFromPath(pathname);
  const adminRoute = getAdminRoute(pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const isAdmin = useAdminStatus(userId);
  const { settings, updateSettings } = useSiteSettings();

  useEffect(() => {
    if (adminRoute && isAdmin === false) navigate('/', { replace: true });
  }, [adminRoute, isAdmin]);

  const openSearch = () => {
    setSearchOpen(true);
    if (pathname !== '/') navigate(`/${search}`);
  };

  let page;
  if (adminRoute) {
    page =
      isAdmin === true ? (
        <AdminRoutes route={adminRoute} settings={settings} onSettingsSaved={updateSettings} />
      ) : (
        <StatusMessage message="관리자 정보를 확인하고 있습니다." />
      );
  } else if (growthRoute) {
    page = <GrowthProfilePage id={growthRoute.id} age={growthRoute.age} />;
  } else if (characterId !== null) {
    page = <CharacterPage id={characterId} />;
  } else {
    page = (
      <CatalogPage
        searchOpen={searchOpen}
        onCloseSearch={() => setSearchOpen(false)}
        settings={settings}
      />
    );
  }

  return (
    <AdminContext.Provider value={isAdmin === true}>
      <div className="min-h-screen bg-white text-zinc-900">
        <SiteHeader
          title={settings?.title ?? ''}
          isAdmin={isAdmin === true}
          onOpenSearch={openSearch}
          onOpenAdmin={() => navigate('/admin')}
        />
        {page}
      </div>
    </AdminContext.Provider>
  );
}

export default App;

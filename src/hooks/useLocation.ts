import { useEffect, useState } from 'react';

export interface AppLocation {
  pathname: string;
  search: string;
}

function readLocation(): AppLocation {
  return { pathname: window.location.pathname, search: window.location.search };
}

export function useLocation(): AppLocation {
  const [current, setCurrent] = useState<AppLocation>(readLocation);

  useEffect(() => {
    const sync = () => setCurrent(readLocation());
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  return current;
}

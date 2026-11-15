export function navigate(to: string, options: { replace?: boolean } = {}) {
  if (options.replace) {
    window.history.replaceState(null, '', to);
  } else {
    window.history.pushState(null, '', to);
  }
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export type AdminRoute =
  | { kind: 'settings' }
  | { kind: 'characters' }
  | { kind: 'character-new' }
  | { kind: 'character-edit'; id: number }
  | { kind: 'growth-new'; characterId: number }
  | { kind: 'growth-edit'; characterId: number; age: number };

export function getAdminRoute(pathname: string): AdminRoute | null {
  if (!/^\/admin(\/|$)/.test(pathname)) return null;
  if (/^\/admin\/characters\/?$/.test(pathname)) return { kind: 'characters' };
  if (/^\/admin\/characters\/new\/?$/.test(pathname)) return { kind: 'character-new' };

  const growthNew = /^\/admin\/characters\/(\d+)\/growth\/new\/?$/.exec(pathname);
  if (growthNew) return { kind: 'growth-new', characterId: Number(growthNew[1]) };

  const growthEdit = /^\/admin\/characters\/(\d+)\/growth\/(\d+)\/?$/.exec(pathname);
  if (growthEdit) return { kind: 'growth-edit', characterId: Number(growthEdit[1]), age: Number(growthEdit[2]) };

  const edit = /^\/admin\/characters\/(\d+)\/?$/.exec(pathname);
  if (edit) return { kind: 'character-edit', id: Number(edit[1]) };

  return { kind: 'settings' };
}

export function getCharacterIdFromPath(pathname: string): number | null {
  const match = /^\/character\/(\d+)\/?$/.exec(pathname);
  return match ? Number(match[1]) : null;
}

export function getGrowthRouteFromPath(pathname: string): { id: number; age: number } | null {
  const match = /^\/character\/(\d+)\/growth\/(\d+)\/?$/.exec(pathname);
  return match ? { id: Number(match[1]), age: Number(match[2]) } : null;
}

export type SortKey = 'name' | 'started';
export type ViewMode = 'list' | 'grid';
export type SearchScope = 'name' | 'content';

export interface CatalogQuery {
  q: string;
  scope: SearchScope;
  keywords: string[];
  sort: SortKey;
  view: ViewMode;
}

export const DEFAULT_CATALOG_QUERY: CatalogQuery = {
  q: '',
  scope: 'name',
  keywords: [],
  sort: 'started',
  view: 'grid',
};

export function parseCatalogQuery(search: string): CatalogQuery {
  const params = new URLSearchParams(search);
  const keywordParam = params.get('kw');

  return {
    q: params.get('q') ?? '',
    scope: params.get('scope') === 'content' ? 'content' : 'name',
    keywords: keywordParam ? keywordParam.split(',').filter(Boolean) : [],
    sort: params.get('sort') === 'name' ? 'name' : 'started',
    view: params.get('view') === 'list' ? 'list' : 'grid',
  };
}

export function buildCatalogSearch(query: CatalogQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.scope !== DEFAULT_CATALOG_QUERY.scope) params.set('scope', query.scope);
  if (query.keywords.length > 0) params.set('kw', query.keywords.join(','));
  if (query.sort !== DEFAULT_CATALOG_QUERY.sort) params.set('sort', query.sort);
  if (query.view !== DEFAULT_CATALOG_QUERY.view) params.set('view', query.view);

  const search = params.toString();
  return search ? `?${search}` : '';
}

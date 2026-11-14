import { useCallback, useEffect, useMemo, useState } from 'react';
import { CatalogIntro } from '@/components/catalog/CatalogIntro';
import { CatalogListHeader } from '@/components/catalog/CatalogListHeader';
import { CatalogSearchPanel } from '@/components/catalog/CatalogSearchPanel';
import { CharacterGridCard } from '@/components/catalog/CharacterGridCard';
import { CharacterListRow } from '@/components/catalog/CharacterListRow';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { StatusMessage } from '@/components/common/StatusMessage';
import {
  DEFAULT_CATALOG_QUERY,
  buildCatalogSearch,
  parseCatalogQuery,
  type CatalogQuery,
} from '@/lib/catalogQuery';
import { applyCatalogQuery, getKeywordOptions } from '@/lib/characterFilters';
import type { Character } from '@/lib/data';
import { deleteCharacter } from '@/lib/characterWrite';
import { navigate } from '@/lib/navigation';
import type { SiteSettings } from '@/lib/siteSettings';
import { useCharacters } from '@/hooks/useCharacters';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useLocation } from '@/hooks/useLocation';

const PAGE_SIZE = 30;

interface Props {
  searchOpen: boolean;
  onCloseSearch: () => void;
  settings: SiteSettings | null;
}

export function CatalogPage({ searchOpen, onCloseSearch, settings }: Props) {
  const { search } = useLocation();
  const query = useMemo(() => parseCatalogQuery(search), [search]);
  const { characters, error, reload } = useCharacters();
  const isAdmin = useIsAdmin();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pendingDelete, setPendingDelete] = useState<Character | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const list = useMemo(() => applyCatalogQuery(characters ?? [], query), [characters, query]);
  const keywordOptions = useMemo(() => getKeywordOptions(characters ?? []), [characters]);
  const visible = list.slice(0, visibleCount);
  const hasMore = visibleCount < list.length;
  const panelVisible = searchOpen || query.q !== '' || query.keywords.length > 0;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search]);

  const loadMore = useCallback(() => setVisibleCount((count) => count + PAGE_SIZE), []);
  const sentinelRef = useInfiniteScroll({
    enabled: hasMore,
    loadedCount: visible.length,
    onLoadMore: loadMore,
  });

  const updateQuery = (patch: Partial<CatalogQuery>) => {
    navigate(`/${buildCatalogSearch({ ...query, ...patch })}`, { replace: true });
  };

  const closeSearchPanel = () => {
    onCloseSearch();
    updateQuery({ q: '', scope: DEFAULT_CATALOG_QUERY.scope, keywords: [] });
  };

  const resetFilters = () => {
    navigate(`/${buildCatalogSearch({ ...DEFAULT_CATALOG_QUERY, view: query.view })}`, { replace: true });
  };

  const handleSelect = (id: number) => {
    navigate(`/character/${id}${search}`);
  };

  const openGrowth = (characterId: number, age: number) => {
    navigate(`/character/${characterId}/growth/${age}${search}`);
  };

  const confirmDelete = async () => {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteCharacter(pendingDelete);
      reload();
    } catch (err) {
      console.error('[characters] delete failed:', err);
      setDeleteError('삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  let content;
  if (error) {
    content = <StatusMessage message="캐릭터 정보를 불러오지 못했습니다." />;
  } else if (!characters) {
    content = <StatusMessage message="캐릭터를 불러오는 중입니다." />;
  } else if (list.length === 0) {
    content = (
      <StatusMessage
        message="조건에 맞는 캐릭터가 없습니다."
        action={{ label: '검색 초기화', onClick: resetFilters }}
      />
    );
  } else if (query.view === 'grid') {
    content = (
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {visible.map((character) => (
          <CharacterGridCard
            key={character.id}
            character={character}
            onSelect={handleSelect}
            onOpenGrowth={(age) => openGrowth(character.id, age)}
            onDelete={setPendingDelete}
          />
        ))}
      </div>
    );
  } else {
    content = (
      <ul className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {visible.map((character) => (
          <li key={character.id} className="border-b border-zinc-200 last:border-b-0">
            <CharacterListRow
              character={character}
              onSelect={handleSelect}
              onOpenGrowth={(age) => openGrowth(character.id, age)}
              onDelete={setPendingDelete}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        {settings && <CatalogIntro settings={settings} />}

        {panelVisible && (
          <CatalogSearchPanel
            query={query}
            count={list.length}
            keywordOptions={keywordOptions}
            onChange={updateQuery}
            onClose={closeSearchPanel}
          />
        )}

        <CatalogListHeader
          count={characters ? list.length : null}
          sort={query.sort}
          view={query.view}
          onSortChange={(sort) => updateQuery({ sort })}
          onViewChange={(view) => updateQuery({ view })}
        />

        {deleteError && (
          <p role="alert" className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {deleteError}
          </p>
        )}
        {content}
        {characters && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}
      </main>

      {pendingDelete && (
        <ConfirmDialog
          title="정말 삭제할까요?"
          message={`${pendingDelete.name} 캐릭터의 정보와 이미지가 모두 삭제됩니다.`}
          confirmLabel="삭제"
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

    </>
  );
}

import { ArrowLeft, Pencil } from 'lucide-react';
import { CharacterDetail } from '@/components/detail/CharacterDetail';
import { StatusMessage } from '@/components/common/StatusMessage';
import { buildCatalogSearch, parseCatalogQuery } from '@/lib/catalogQuery';
import { applyCatalogQuery, getNeighbors } from '@/lib/characterFilters';
import { navigate } from '@/lib/navigation';
import { useCharacters } from '@/hooks/useCharacters';
import { useLocation } from '@/hooks/useLocation';
import { useIsAdmin } from '@/hooks/useIsAdmin';

interface Props {
  id: number;
}

export function CharacterPage({ id }: Props) {
  const { search } = useLocation();
  const isAdmin = useIsAdmin();
  const { characters, error } = useCharacters();
  const query = parseCatalogQuery(search);
  const listPath = `/${buildCatalogSearch(query)}`;
  const goToList = () => navigate(listPath);

  if (error) {
    return <StatusMessage message="캐릭터 정보를 불러오지 못했습니다." action={{ label: '목록으로', onClick: goToList }} />;
  }
  if (!characters) {
    return <StatusMessage message="캐릭터를 불러오는 중입니다." />;
  }

  const character = characters.find((item) => item.id === id);
  if (!character) {
    return <StatusMessage message="해당 캐릭터를 찾을 수 없습니다." action={{ label: '목록으로', onClick: goToList }} />;
  }

  const publicList = applyCatalogQuery(characters, query).filter((item) => item.is_public);
  const neighbors = getNeighbors(publicList, id);
  const openCharacter = (nextId: number) => navigate(`/character/${nextId}${search}`);
  const openGrowth = (age: number) => navigate(`/character/${id}/growth/${age}${search}`);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4 pt-2">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl font-bold text-zinc-400 sm:text-3xl">캐릭터 상세</h1>
          <span className="text-xs font-semibold text-zinc-400">No. {String(character.dex_number).padStart(3, '0')}</span>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate(`/admin/characters/${character.id}`)}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              수정
            </button>
          )}
          <button
            type="button"
            onClick={goToList}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            목록으로
          </button>
        </div>
      </div>

      <div className="mt-[72px]">
        <CharacterDetail

          character={character}
          neighbors={neighbors}
          onSelect={openCharacter}
          onOpenGrowth={openGrowth}
        />
      </div>
    </main>
  );
}

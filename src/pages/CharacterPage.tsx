import { ArrowLeft, Pencil } from 'lucide-react';
import { CharacterDetail } from '@/components/detail/CharacterDetail';
import { DetailHeader, DetailHeaderButton } from '@/components/detail/DetailHeader';
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
      <DetailHeader title="캐릭터 상세" dexNumber={character.dex_number}>
        {isAdmin && (
          <DetailHeaderButton onClick={() => navigate(`/admin/characters/${character.id}`)}>
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            수정
          </DetailHeaderButton>
        )}
        <DetailHeaderButton onClick={goToList}>
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          목록으로
        </DetailHeaderButton>
      </DetailHeader>

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

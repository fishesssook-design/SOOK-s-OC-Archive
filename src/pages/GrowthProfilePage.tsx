import { ArrowLeft, Pencil } from 'lucide-react';
import { CharacterHero } from '@/components/detail/CharacterHero';
import { DetailHeader, DetailHeaderButton } from '@/components/detail/DetailHeader';
import { DetailSection } from '@/components/detail/DetailSection';
import { SILHOUETTE_SRC } from '@/components/common/CharacterImage';
import { StatusMessage } from '@/components/common/StatusMessage';
import { buildProfileRows } from '@/lib/characterProfile';
import { navigate } from '@/lib/navigation';
import { useCharacters } from '@/hooks/useCharacters';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useLocation } from '@/hooks/useLocation';

interface Props {
  id: number;
  age: number;
}

export function GrowthProfilePage({ id, age }: Props) {
  const { search } = useLocation();
  const isAdmin = useIsAdmin();
  const { characters, error } = useCharacters();
  const goToList = () => navigate(`/${search}`);
  const goToDetail = () => navigate(`/character/${id}${search}`);

  if (error) {
    return <StatusMessage message="캐릭터 정보를 불러오지 못했습니다." action={{ label: '목록으로', onClick: goToList }} />;
  }
  if (!characters) {
    return <StatusMessage message="캐릭터를 불러오는 중입니다." />;
  }

  const character = characters.find((item) => item.id === id);
  if (!character || (!character.is_public && !isAdmin)) {
    return <StatusMessage message="해당 캐릭터를 찾을 수 없습니다." action={{ label: '목록으로', onClick: goToList }} />;
  }

  const profile = character.growth_profiles.find((item) => item.age === age);
  if (!profile) {
    return <StatusMessage message="해당 나이의 프로필을 찾을 수 없습니다." action={{ label: '캐릭터 상세로', onClick: goToDetail }} />;
  }

  const fullBodySrc = (profile.full_body_url ? character.image_srcs[profile.full_body_url] : undefined) ?? SILHOUETTE_SRC;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <DetailHeader title="성장 프로필" dexNumber={character.dex_number}>
        {isAdmin && (
          <DetailHeaderButton onClick={() => navigate(`/admin/characters/${character.id}`)}>
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            수정
          </DetailHeaderButton>
        )}
        <DetailHeaderButton onClick={goToDetail}>
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          캐릭터 상세로
        </DetailHeaderButton>
      </DetailHeader>

      <div className="mt-[72px]">
        <CharacterHero
          character={character}
          profileRows={buildProfileRows(character, `${age}세`)}
          fullBodySrc={fullBodySrc}
          activeAge={age}
          onOpenGrowth={(nextAge) => navigate(`/character/${id}/growth/${nextAge}${search}`)}
        />
      </div>

      <div className="mt-[80px] space-y-8">
        <DetailSection title="프로필" blocks={profile.profile_blocks} imageSrcs={character.image_srcs} />
        <DetailSection title="설정" blocks={profile.settings_blocks} imageSrcs={character.image_srcs} />
      </div>
    </main>
  );
}

import { ArrowLeft } from 'lucide-react';
import { DetailSection } from '@/components/detail/DetailSection';
import { GrowthAgeButtons } from '@/components/common/GrowthAgeButtons';
import { StatusMessage } from '@/components/common/StatusMessage';
import { navigate } from '@/lib/navigation';
import { useCharacters } from '@/hooks/useCharacters';
import { useLocation } from '@/hooks/useLocation';

interface Props {
  id: number;
  age: number;
}

export function GrowthProfilePage({ id, age }: Props) {
  const { search } = useLocation();
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
  if (!character || !character.is_public) {
    return <StatusMessage message="해당 캐릭터를 찾을 수 없습니다." action={{ label: '목록으로', onClick: goToList }} />;
  }

  const profile = character.growth_profiles.find((item) => item.age === age);
  if (!profile) {
    return <StatusMessage message="해당 나이의 프로필을 찾을 수 없습니다." action={{ label: '캐릭터 상세로', onClick: goToDetail }} />;
  }

  const ages = character.growth_profiles.map((item) => item.age);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-6 sm:px-6">
      <button
        type="button"
        onClick={goToDetail}
        className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium transition hover:border-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        캐릭터 상세로
      </button>

      <article className="mt-4 space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
        <header className="space-y-4">
          <p className="text-sm font-semibold text-zinc-500">성장 프로필</p>
          <h1 className="text-3xl font-bold leading-tight">{character.name}</h1>
          <GrowthAgeButtons
            ages={ages}
            activeAge={age}
            onSelect={(nextAge) => navigate(`/character/${id}/growth/${nextAge}${search}`)}
          />
        </header>

        <p className="text-2xl font-bold text-zinc-900">{age}세</p>

        <DetailSection title="프로필" blocks={profile.profile_blocks} imageSrcs={character.image_srcs} />
        <DetailSection title="설정" blocks={profile.settings_blocks} imageSrcs={character.image_srcs} />
      </article>
    </main>
  );
}

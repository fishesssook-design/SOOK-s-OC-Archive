import { ArrowLeft } from 'lucide-react';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { GrowthProfileForm } from '@/components/admin/GrowthProfileForm';
import { StatusMessage } from '@/components/common/StatusMessage';
import { useCharacters } from '@/hooks/useCharacters';
import { createEmptyGrowthRow, growthRowFromProfile } from '@/lib/characterForm';
import { navigate } from '@/lib/navigation';

interface Props {
  characterId: number;
  age: number | null;
}

export function AdminGrowthProfilePage({ characterId, age }: Props) {
  const { characters, error } = useCharacters();
  const goToCharacter = () => navigate(`/admin/characters/${characterId}`);
  const isEdit = age !== null;

  let body;
  if (error) {
    body = <StatusMessage message="캐릭터 정보를 불러오지 못했습니다." action={{ label: '목록으로', onClick: () => navigate('/admin/characters') }} />;
  } else if (!characters) {
    body = <StatusMessage message="캐릭터를 불러오는 중입니다." />;
  } else {
    const character = characters.find((item) => item.id === characterId) ?? null;
    const profile = isEdit ? (character?.growth_profiles.find((item) => item.age === age) ?? null) : null;

    if (!character) {
      body = <StatusMessage message="해당 캐릭터를 찾을 수 없습니다." action={{ label: '목록으로', onClick: () => navigate('/admin/characters') }} />;
    } else if (isEdit && !profile) {
      body = <StatusMessage message="해당 나이의 성장 프로필을 찾을 수 없습니다." action={{ label: '캐릭터 수정으로', onClick: goToCharacter }} />;
    } else {
      const takenAges = character.growth_profiles.map((item) => item.age).filter((item) => item !== age);
      body = (
        <GrowthProfileForm
          key={`${characterId}-${age ?? 'new'}`}
          character={character}
          originalAge={age}
          initial={profile ? growthRowFromProfile(profile, character.image_srcs) : createEmptyGrowthRow()}
          takenAges={takenAges}
          onDone={goToCharacter}
        />
      );
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <AdminTabs active="characters" />

      <button
        type="button"
        onClick={goToCharacter}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        캐릭터 수정으로
      </button>

      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{isEdit ? '성장 프로필 수정' : '성장 프로필 추가'}</h1>
        <p className="text-sm text-zinc-500">저장하면 해당 캐릭터의 성장 프로필 화면에 바로 반영됩니다.</p>
      </header>

      {body}
    </main>
  );
}

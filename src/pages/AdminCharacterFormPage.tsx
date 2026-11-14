import { ArrowLeft } from 'lucide-react';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { CharacterForm } from '@/components/admin/CharacterForm';
import { StatusMessage } from '@/components/common/StatusMessage';
import { useCharacters } from '@/hooks/useCharacters';
import { characterToFormValues, createEmptyCharacterForm } from '@/lib/characterForm';
import { navigate } from '@/lib/navigation';

interface Props {
  characterId: number | null;
}

export function AdminCharacterFormPage({ characterId }: Props) {
  const { characters, error } = useCharacters();
  const goToList = () => navigate('/admin/characters');
  const isEdit = characterId !== null;

  let body;
  if (error) {
    body = <StatusMessage message="캐릭터 정보를 불러오지 못했습니다." action={{ label: '목록으로', onClick: goToList }} />;
  } else if (!characters) {
    body = <StatusMessage message="캐릭터를 불러오는 중입니다." />;
  } else {
    const existing = isEdit ? (characters.find((character) => character.id === characterId) ?? null) : null;

    if (isEdit && !existing) {
      body = <StatusMessage message="해당 캐릭터를 찾을 수 없습니다." action={{ label: '목록으로', onClick: goToList }} />;
    } else {
      body = (
        <CharacterForm
          key={existing?.id ?? 'new'}
          initial={existing ? characterToFormValues(existing) : createEmptyCharacterForm()}
          existing={existing}
          onSaved={goToList}
        />
      );
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <AdminTabs active="characters" />

      <button
        type="button"
        onClick={goToList}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        캐릭터 목록으로
      </button>

      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{isEdit ? '캐릭터 수정' : '캐릭터 추가'}</h1>
        <p className="text-sm text-zinc-500">입력한 내용은 저장 즉시 목록과 상세 화면에 반영됩니다.</p>
      </header>

      {body}
    </main>
  );
}

import { Pencil, Plus } from 'lucide-react';
import { CharacterImage } from '@/components/common/CharacterImage';
import type { Character } from '@/lib/data';

interface Props {
  character: Character | null;
  onOpen: (path: string) => void;
}

const ADD_BUTTON_CLASS =
  'inline-flex h-9 items-center gap-2 rounded-lg border border-dashed border-zinc-400 px-3 text-xs font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-zinc-400 disabled:hover:text-zinc-700';

export function CharacterGrowthSection({ character, onOpen }: Props) {
  const stages = character ? [...character.growth_profiles].sort((a, b) => a.age - b.age) : [];

  return (
    <div className="space-y-4">
      {stages.length === 0 && <p className="text-xs text-zinc-500">등록된 성장 프로필이 없습니다.</p>}
      <ul className="space-y-3">
        {character &&
          stages.map((stage) => (
            <li
              key={stage.age}
              className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50/60 p-3"
            >
              <CharacterImage
                src={stage.thumbnail_url ? (character.image_srcs[stage.thumbnail_url] ?? null) : null}
                name={`${stage.age}세`}
                className="h-16 w-16 shrink-0 rounded-md object-cover"
              />
              <p className="min-w-0 flex-1 text-sm font-semibold text-zinc-900">{stage.age}세</p>
              <button
                type="button"
                onClick={() => onOpen(`/admin/characters/${character.id}/growth/${stage.age}`)}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 text-xs font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                편집
              </button>
            </li>
          ))}
      </ul>
      <div className="space-y-2">
        <button
          type="button"
          disabled={!character}
          onClick={() => character && onOpen(`/admin/characters/${character.id}/growth/new`)}
          className={ADD_BUTTON_CLASS}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          성장 프로필 추가
        </button>
        {!character && (
          <p className="text-xs text-zinc-500">캐릭터를 먼저 저장한 뒤 성장 프로필을 추가할 수 있어요.</p>
        )}
      </div>
    </div>
  );
}

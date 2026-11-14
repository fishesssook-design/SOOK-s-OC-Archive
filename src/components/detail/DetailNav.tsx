import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Character } from '@/lib/data';
import type { Neighbors } from '@/lib/characterFilters';

interface Props {
  neighbors: Neighbors;
  onSelect: (id: number) => void;
}

export function DetailNav({ neighbors, onSelect }: Props) {
  const { prev, next } = neighbors;
  if (!prev && !next) return null;

  return (
    <nav aria-label="캐릭터 이동" className="grid grid-cols-2 gap-3 border-t border-zinc-200 pt-6">
      <div>{prev && <NavButton direction="prev" character={prev} onClick={() => onSelect(prev.id)} />}</div>
      <div className="flex justify-end">
        {next && <NavButton direction="next" character={next} onClick={() => onSelect(next.id)} />}
      </div>
    </nav>
  );
}

function NavButton({
  direction,
  character,
  onClick,
}: {
  direction: 'prev' | 'next';
  character: Character;
  onClick: () => void;
}) {
  const isPrev = direction === 'prev';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-2 rounded-lg px-3 py-3 transition hover:bg-yellow-50 ${
        isPrev ? 'flex-row' : 'flex-row-reverse text-right'
      }`}
    >
      {isPrev ? (
        <ChevronLeft className="h-4 w-4 shrink-0 transition group-hover:-translate-x-0.5" aria-hidden="true" />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" aria-hidden="true" />
      )}
      <span className={`min-w-0 flex flex-col ${isPrev ? 'items-start text-left' : 'items-end text-right'}`}>
        <span className="block text-xs text-zinc-500">{isPrev ? '이전 캐릭터' : '다음 캐릭터'}</span>
        <span className="block truncate font-semibold text-zinc-900">{character.name}</span>
      </span>
    </button>
  );
}

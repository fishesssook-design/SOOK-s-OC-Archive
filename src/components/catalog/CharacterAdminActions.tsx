import { Pencil, Trash2 } from 'lucide-react';
import { navigate } from '@/lib/navigation';

interface Props {
  characterId: number;
  characterName: string;
  onDelete: () => void;
  className?: string;
}

const BUTTON_CLASS =
  'inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-sm transition';

export function CharacterAdminActions({ characterId, characterName, onDelete, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        title="수정"
        aria-label={`${characterName} 수정`}
        onClick={() => navigate(`/admin/characters/${characterId}`)}
        className={`${BUTTON_CLASS} hover:border-zinc-900 hover:text-zinc-900`}
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        title="삭제"
        aria-label={`${characterName} 삭제`}
        onClick={onDelete}
        className={`${BUTTON_CLASS} hover:border-red-500 hover:text-red-600`}
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

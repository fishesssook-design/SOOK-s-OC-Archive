import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { CharacterImage } from '@/components/common/CharacterImage';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { StatusMessage } from '@/components/common/StatusMessage';
import { useCharacters } from '@/hooks/useCharacters';
import type { Character } from '@/lib/data';
import { formatDexNumber } from '@/lib/format';
import { navigate } from '@/lib/navigation';
import { deleteCharacter } from '@/lib/characterWrite';

type Status = { tone: 'success' | 'error'; text: string } | null;

export function AdminCharactersPage() {
  const { characters, error, reload } = useCharacters();
  const [pendingDelete, setPendingDelete] = useState<Character | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const handleConfirmDelete = async () => {
    if (!pendingDelete || deleting) return;

    setDeleting(true);
    setStatus(null);
    try {
      await deleteCharacter(pendingDelete);
      setPendingDelete(null);
      setStatus({ tone: 'success', text: `${pendingDelete.name} 캐릭터를 삭제했습니다.` });
      await reload();
    } catch (err) {
      console.error('[characters] delete failed:', err);
      setStatus({ tone: 'error', text: '삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.' });
    } finally {
      setDeleting(false);
    }
  };

  let body;
  if (error) {
    body = <StatusMessage message="캐릭터 정보를 불러오지 못했습니다." />;
  } else if (!characters) {
    body = <StatusMessage message="캐릭터를 불러오는 중입니다." />;
  } else if (characters.length === 0) {
    body = <StatusMessage message="아직 등록된 캐릭터가 없습니다." />;
  } else {
    body = (
      <ul className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {characters.map((character) => (
          <li key={character.id} className="flex items-center gap-4 px-4 py-3 sm:px-5">
            <CharacterImage
              src={character.thumbnail_src}
              name={character.name}
              className="h-12 w-12 shrink-0 rounded-md"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-zinc-900">{character.name}</p>
              <p className="text-xs text-zinc-500">
                No. {formatDexNumber(character.dex_number)} · {character.is_public ? '공개' : '비공개'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/admin/characters/${character.id}`)}
              aria-label={`${character.name} 수정`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              수정
            </button>
            <button
              type="button"
              onClick={() => setPendingDelete(character)}
              aria-label={`${character.name} 삭제`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 transition hover:border-red-500 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              삭제
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <AdminTabs active="characters" />

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">캐릭터 관리</h1>
          <p className="text-sm text-zinc-500">캐릭터를 추가하거나 수정하고, 필요 없는 캐릭터를 삭제할 수 있습니다.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/characters/new')}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-yellow-400 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-yellow-300"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          캐릭터 추가
        </button>
      </header>

      {status && (
        <p
          role={status.tone === 'error' ? 'alert' : 'status'}
          className={`mb-6 rounded-lg px-4 py-3 text-sm ${
            status.tone === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'
          }`}
        >
          {status.text}
        </p>
      )}

      {body}

      {pendingDelete && (
        <ConfirmDialog
          title="정말 삭제할까요?"
          message={`${pendingDelete.name} 캐릭터와 등록된 이미지가 함께 삭제되며 되돌릴 수 없습니다.`}
          confirmLabel="삭제"
          busy={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </main>
  );
}

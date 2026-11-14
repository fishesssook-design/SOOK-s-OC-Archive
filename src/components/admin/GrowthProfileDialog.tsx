import { useState } from 'react';
import { X } from 'lucide-react';
import { CharacterImageField } from '@/components/admin/CharacterImageField';
import { ContentBlocksField } from '@/components/admin/ContentBlocksField';
import type { GrowthFormRow } from '@/lib/characterForm';

interface Props {
  title: string;
  initial: GrowthFormRow;
  onSave: (row: GrowthFormRow) => void;
  onCancel: () => void;
}

const INPUT_CLASS =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300/60';

export function GrowthProfileDialog({ title, initial, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<GrowthFormRow>(initial);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<GrowthFormRow>) => setDraft((current) => ({ ...current, ...patch }));

  const handleSave = () => {
    if (draft.age.trim() === '') {
      setError('나이를 입력해 주세요.');
      return;
    }
    onSave(draft);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="성장 프로필 편집 닫기"
        onClick={onCancel}
        className="absolute inset-0 bg-zinc-900/50 animate-fade-in"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="growth-profile-dialog-title"
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl animate-pop-in"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <h2 id="growth-profile-dialog-title" className="text-lg font-bold text-zinc-900">
            {title}
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onCancel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto px-6 py-5">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-zinc-800">나이</span>
            <input
              type="number"
              min={1}
              max={999}
              value={draft.age}
              onChange={(event) => {
                setError(null);
                update({ age: event.target.value });
              }}
              className={`${INPUT_CLASS} sm:w-32`}
            />
          </label>

          <div className="grid gap-6 sm:grid-cols-2">
            <CharacterImageField label="썸네일" slot={draft.thumbnail} onChange={(slot) => update({ thumbnail: slot })} />
            <CharacterImageField label="전신" slot={draft.fullBody} onChange={(slot) => update({ fullBody: slot })} />
          </div>

          <ContentBlocksField label="프로필" blocks={draft.profile} onChange={(blocks) => update({ profile: blocks })} />
          <ContentBlocksField label="설정" blocks={draft.settings} onChange={(blocks) => update({ settings: blocks })} />

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-200 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-10 rounded-lg bg-yellow-400 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-yellow-300"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
}

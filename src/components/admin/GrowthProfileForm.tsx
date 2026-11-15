import { useState, type FormEvent } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { CharacterImageField } from '@/components/admin/CharacterImageField';
import { ContentBlocksField } from '@/components/admin/ContentBlocksField';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import type { Character } from '@/lib/data';
import { validateGrowthForm, type GrowthFormRow } from '@/lib/characterForm';
import { deleteGrowthProfile, describeSaveError, saveGrowthProfile } from '@/lib/characterWrite';

interface Props {
  character: Character;
  originalAge: number | null;
  initial: GrowthFormRow;
  takenAges: number[];
  onDone: () => void;
}

type Status = { tone: 'error'; text: string } | null;

const INPUT_CLASS =
  'w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300/60';

export function GrowthProfileForm({ character, originalAge, initial, takenAges, onDone }: Props) {
  const [values, setValues] = useState<GrowthFormRow>(initial);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const update = (patch: Partial<GrowthFormRow>) => setValues((current) => ({ ...current, ...patch }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const problem = validateGrowthForm(values, takenAges);
    if (problem) {
      setStatus({ tone: 'error', text: problem });
      return;
    }

    setSaving(true);
    setStatus(null);
    try {
      await saveGrowthProfile(character, originalAge, values);
      onDone();
    } catch (err) {
      console.error('[characters] growth profile save failed:', err);
      setStatus({ tone: 'error', text: describeSaveError(err) });
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (originalAge === null || deleting) return;

    setDeleting(true);
    setStatus(null);
    try {
      await deleteGrowthProfile(character, originalAge);
      onDone();
    } catch (err) {
      console.error('[characters] growth profile delete failed:', err);
      setConfirmingDelete(false);
      setStatus({ tone: 'error', text: describeSaveError(err) });
      setDeleting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <section className="space-y-5">
          <label className="block space-y-2">
            <span className="block text-sm font-semibold text-zinc-800">나이</span>
            <input
              type="number"
              min={1}
              max={999}
              value={values.age}
              onChange={(event) => update({ age: event.target.value })}
              className={`${INPUT_CLASS} sm:w-40`}
            />
          </label>

          <div className="grid gap-6 sm:grid-cols-2">
            <CharacterImageField label="썸네일" slot={values.thumbnail} onChange={(slot) => update({ thumbnail: slot })} />
            <CharacterImageField label="전신" slot={values.fullBody} onChange={(slot) => update({ fullBody: slot })} />
          </div>
        </section>

        <section className="space-y-5">
          <ContentBlocksField label="프로필" blocks={values.profile} onChange={(blocks) => update({ profile: blocks })} />
          <ContentBlocksField label="설정" blocks={values.settings} onChange={(blocks) => update({ settings: blocks })} />
        </section>

        {status && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {status.text}
          </p>
        )}

        <div className="flex items-center justify-between gap-3">
          {originalAge !== null ? (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              disabled={saving || deleting}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              이 성장 프로필 삭제
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={saving || deleting}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-yellow-400 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {saving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>

      {confirmingDelete && (
        <ConfirmDialog
          title="성장 프로필 삭제"
          message={`${values.age || '?'}세 성장 프로필을 삭제할까요? 삭제한 내용은 되돌릴 수 없어요.`}
          confirmLabel="삭제하기"
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </>
  );
}

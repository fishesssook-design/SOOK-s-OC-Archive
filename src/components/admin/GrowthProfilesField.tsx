import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { CharacterImage } from '@/components/common/CharacterImage';
import { GrowthProfileDialog } from '@/components/admin/GrowthProfileDialog';
import { createEmptyGrowthRow, type GrowthFormRow, type ImageSlot } from '@/lib/characterForm';

interface Props {
  rows: GrowthFormRow[];
  onChange: (rows: GrowthFormRow[]) => void;
}

interface Editing {
  row: GrowthFormRow;
  isNew: boolean;
}

const ADD_BUTTON_CLASS =
  'inline-flex h-9 items-center gap-2 rounded-lg border border-dashed border-zinc-400 px-3 text-xs font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900';

export function GrowthProfilesField({ rows, onChange }: Props) {
  const [editing, setEditing] = useState<Editing | null>(null);

  const save = (row: GrowthFormRow) => {
    if (!editing) return;
    if (editing.isNew) {
      onChange([...rows, row]);
    } else {
      onChange(rows.map((current) => (current.key === row.key ? row : current)));
    }
    setEditing(null);
  };

  const removeRow = (key: string) => {
    onChange(rows.filter((row) => row.key !== key));
  };

  return (
    <div className="space-y-4">
      {rows.length === 0 && <p className="text-xs text-zinc-500">성장 프로필을 추가해 주세요.</p>}
      <ul className="space-y-3">
        {rows.map((row) => (
          <li
            key={row.key}
            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50/60 p-3"
          >
            <GrowthThumbnail slot={row.thumbnail} label={`${row.age || '?' }세`} />
            <p className="min-w-0 flex-1 text-sm font-semibold text-zinc-900">{row.age || '?'}세</p>
            <button
              type="button"
              onClick={() => setEditing({ row, isNew: false })}
              aria-label={`${row.age || '?'}세 성장 프로필 편집`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => removeRow(row.key)}
              aria-label={`${row.age || '?'}세 성장 프로필 삭제`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 transition hover:border-red-500 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => setEditing({ row: createEmptyGrowthRow(), isNew: true })} className={ADD_BUTTON_CLASS}>
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        성장 프로필 추가
      </button>

      {editing && (
        <GrowthProfileDialog
          key={editing.row.key}
          title={editing.isNew ? '성장 프로필 추가' : '성장 프로필 편집'}
          initial={editing.row}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function GrowthThumbnail({ slot, label }: { slot: ImageSlot; label: string }) {
  const [localUrl, setLocalUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!slot.file) return;
    const url = URL.createObjectURL(slot.file);
    setLocalUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [slot.file]);

  return (
    <CharacterImage
      src={slot.file ? localUrl : slot.src}
      name={label}
      className="h-16 w-16 shrink-0 rounded-md"
    />
  );
}

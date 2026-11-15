import { useState, type FormEvent, type ReactNode } from 'react';
import { Save } from 'lucide-react';
import { CharacterImageField } from '@/components/admin/CharacterImageField';
import { ContentBlocksField } from '@/components/admin/ContentBlocksField';
import { GrowthProfilesField } from '@/components/admin/GrowthProfilesField';
import type { Character } from '@/lib/data';
import { validateCharacterForm, type CharacterFormValues } from '@/lib/characterForm';
import { describeSaveError, saveCharacter } from '@/lib/characterWrite';

interface Props {
  initial: CharacterFormValues;
  existing: Character | null;
  onSaved: () => void;
}

type Status = { tone: 'error'; text: string } | null;

const INPUT_CLASS =
  'w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300/60';

export function CharacterForm({ initial, existing, onSaved }: Props) {
  const [values, setValues] = useState<CharacterFormValues>(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const set = <K extends keyof CharacterFormValues>(key: K, value: CharacterFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const problem = validateCharacterForm(values);
    if (problem) {
      setStatus({ tone: 'error', text: problem });
      return;
    }

    setSaving(true);
    setStatus(null);
    try {
      await saveCharacter(existing, values);
      onSaved();
    } catch (err) {
      console.error('[characters] save failed:', err);
      setStatus({ tone: 'error', text: describeSaveError(err) });
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <FormSection title="기본 정보">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="char-name" label="이름" value={values.name} onChange={(v) => set('name', v)} />
          <TextField id="char-english-name" label="영문 이름" value={values.englishName} onChange={(v) => set('englishName', v)} />
        </div>
        <TextField id="char-catchphrase" label="한마디" value={values.catchphrase} onChange={(v) => set('catchphrase', v)} />
        <TextField
          id="char-keywords"
          label="키워드"
          hint="쉼표로 구분해 입력해 주세요. 예: 미스터리, 야간, 츤데레"
          value={values.keywords}
          onChange={(v) => set('keywords', v)}
        />
      </FormSection>

      <FormSection title="인물 정보">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="char-gender" label="성별" value={values.gender} onChange={(v) => set('gender', v)} />
          <TextField id="char-age" label="나이" value={values.age} onChange={(v) => set('age', v)} />
          <TextField id="char-species" label="종족" value={values.species} onChange={(v) => set('species', v)} />
          <TextField id="char-height" label="신장" value={values.height} onChange={(v) => set('height', v)} />
          <TextField id="char-body-type" label="체형" value={values.bodyType} onChange={(v) => set('bodyType', v)} />
          <TextField id="char-job" label="직업" value={values.job} onChange={(v) => set('job', v)} />
          <div className="grid gap-5 sm:col-span-2 sm:grid-cols-2">
            <TextField id="char-community" label="활동 커뮤" value={values.community} onChange={(v) => set('community', v)} />
            <TextField
              id="char-started"
              label="활동 시작"
              type="date"
              value={values.startedAt}
              onChange={(v) => set('startedAt', v)}
            />
          </div>
        </div>
        <label className="flex items-center gap-3 text-sm font-medium text-zinc-800">
          <input
            type="checkbox"
            checked={!values.isPublic}
            onChange={(event) => set('isPublic', !event.target.checked)}
            className="h-4 w-4 accent-yellow-400"
          />
          비공개 캐릭터 (체크하면 목록에서 기밀 카드로 표시됩니다)
        </label>
      </FormSection>

      <FormSection title="이미지">
        <div className="grid gap-6 sm:grid-cols-2">
          <CharacterImageField
            label="썸네일"
            slot={values.thumbnail}
            onChange={(slot) => set('thumbnail', slot)}
          />
          <CharacterImageField
            label="전신"
            slot={values.fullBody}
            onChange={(slot) => set('fullBody', slot)}
          />
          <CharacterImageField
            label="배경"
            slot={values.background}
            onChange={(slot) => set('background', slot)}
          />
        </div>
      </FormSection>

      <FormSection title="설정">
        <ContentBlocksField label="성격" blocks={values.personality} onChange={(blocks) => set('personality', blocks)} />
        <ContentBlocksField label="특징" blocks={values.features} onChange={(blocks) => set('features', blocks)} />
      </FormSection>

      <FormSection title="성장">
        <GrowthProfilesField rows={values.growthProfiles} onChange={(rows) => set('growthProfiles', rows)} />
      </FormSection>

      {status && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {status.text}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-yellow-400 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {saving ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <h2 className="flex items-center gap-2 border-b border-zinc-200 pb-2 text-sm font-bold text-zinc-900">
        <span className="h-4 w-1 rounded-full bg-yellow-400" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'date';
  hint?: string;
}

function TextField({ id, label, value, onChange, type = 'text', hint }: TextFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-zinc-800">
        {label}
      </label>
      <input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} className={INPUT_CLASS} />
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

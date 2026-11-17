import type { ReactNode } from 'react';
import { CharacterImageField } from '@/components/admin/CharacterImageField';
import { ContentBlocksField } from '@/components/admin/ContentBlocksField';
import type { BlockDraft, ImageSlot } from '@/lib/characterForm';

const INPUT_CLASS =
  'w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300/60';

export { FormSection, TextField };
export type { FieldTextProps };

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

interface FieldTextProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'date';
  hint?: string;
}

function TextField({ id, label, value, onChange, type = 'text', hint }: FieldTextProps) {
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

export function CharacterBasicsFields({
  name,
  englishName,
  catchphrase,
  keywords,
  onChange,
}: {
  name: string;
  englishName: string;
  catchphrase: string;
  keywords: string;
  onChange: (patch: CharacterBasicsPatch) => void;
}) {
  return (
    <FormSection title="기본 정보">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="char-name" label="이름" value={name} onChange={(v) => onChange({ name: v })} />
        <TextField id="char-english-name" label="영문 이름" value={englishName} onChange={(v) => onChange({ englishName: v })} />
      </div>
      <TextField id="char-catchphrase" label="한마디" value={catchphrase} onChange={(v) => onChange({ catchphrase: v })} />
      <TextField
        id="char-keywords"
        label="키워드"
        hint="쉼표로 구분해 입력해 주세요. 예: 미스터리, 야간, 츤데레"
        value={keywords}
        onChange={(v) => onChange({ keywords: v })}
      />
    </FormSection>
  );
}

export interface CharacterBasicsPatch {
  name?: string;
  englishName?: string;
  catchphrase?: string;
  keywords?: string;
}

export function CharacterProfileFields({
  gender,
  ageLabel,
  species,
  height,
  bodyType,
  job,
  community,
  startedAt,
  onChange,
}: {
  gender: string;
  ageLabel: string;
  species: string;
  height: string;
  bodyType: string;
  job: string;
  community: string;
  startedAt: string;
  onChange: (patch: CharacterProfilePatch) => void;
}) {
  return (
    <FormSection title="인물 정보">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="char-gender" label="성별" value={gender} onChange={(v) => onChange({ gender: v })} />
        <TextField id="char-age" label="나이" value={ageLabel} onChange={(v) => onChange({ ageLabel: v })} />
        <TextField id="char-species" label="종족" value={species} onChange={(v) => onChange({ species: v })} />
        <TextField id="char-height" label="신장" value={height} onChange={(v) => onChange({ height: v })} />
        <TextField id="char-body-type" label="체형" value={bodyType} onChange={(v) => onChange({ bodyType: v })} />
        <TextField id="char-job" label="직업" value={job} onChange={(v) => onChange({ job: v })} />
        <div className="grid gap-5 sm:col-span-2 sm:grid-cols-2">
          <TextField id="char-community" label="활동 커뮤" value={community} onChange={(v) => onChange({ community: v })} />
          <TextField id="char-started" label="활동 시작" type="date" value={startedAt} onChange={(v) => onChange({ startedAt: v })} />
        </div>
      </div>
    </FormSection>
  );
}

export interface CharacterProfilePatch {
  gender?: string;
  ageLabel?: string;
  species?: string;
  height?: string;
  bodyType?: string;
  job?: string;
  community?: string;
  startedAt?: string;
}

export function CharacterImageFields({
  thumbnail,
  fullBody,
  background,
  onChange,
}: {
  thumbnail: ImageSlot;
  fullBody: ImageSlot;
  background: ImageSlot;
  onChange: (patch: CharacterImagesPatch) => void;
}) {
  return (
    <FormSection title="이미지">
      <div className="grid gap-6 sm:grid-cols-2">
        <CharacterImageField label="썸네일" slot={thumbnail} onChange={(slot) => onChange({ thumbnail: slot })} />
        <CharacterImageField label="전신" slot={fullBody} onChange={(slot) => onChange({ fullBody: slot })} />
        <CharacterImageField label="배경" slot={background} onChange={(slot) => onChange({ background: slot })} />
      </div>
    </FormSection>
  );
}

export interface CharacterImagesPatch {
  thumbnail?: ImageSlot;
  fullBody?: ImageSlot;
  background?: ImageSlot;
}

export function CharacterDescriptionFields({
  personality,
  features,
  details,
  onChange,
}: {
  personality: BlockDraft[];
  features: BlockDraft[];
  details: BlockDraft[];
  onChange: (patch: CharacterDescriptionPatch) => void;
}) {
  return (
    <FormSection title="설정">
      <ContentBlocksField label="성격" blocks={personality} onChange={(blocks) => onChange({ personality: blocks })} />
      <ContentBlocksField label="특징" blocks={features} onChange={(blocks) => onChange({ features: blocks })} />
      <ContentBlocksField label="세부" blocks={details} onChange={(blocks) => onChange({ details: blocks })} />
    </FormSection>
  );
}

export interface CharacterDescriptionPatch {
  personality?: BlockDraft[];
  features?: BlockDraft[];
  details?: BlockDraft[];
}

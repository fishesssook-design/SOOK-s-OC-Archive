import type { Character } from '@/lib/data';
import { formatActivityPeriod, formatDexNumber } from '@/lib/format';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { GrowthAgeButtons } from '@/components/common/GrowthAgeButtons';
import { KeywordChip } from '@/components/common/KeywordChip';
import { PrivateBadge } from '@/components/common/PrivateBadge';
import { ClassifiedCard } from '@/components/catalog/ClassifiedCard';
import { CharacterAdminActions } from '@/components/catalog/CharacterAdminActions';

interface Props {
  character: Character;
  onSelect: (id: number) => void;
  onOpenGrowth: (age: number) => void;
  onDelete: (character: Character) => void;
}

const ROW_CLASS =
  'group relative flex w-full items-center gap-4 px-4 py-3 transition hover:bg-yellow-50 sm:px-5';

const STRETCHED_BUTTON_CLASS =
  'absolute inset-0 z-0 focus-visible:bg-yellow-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-400';

export function CharacterListRow({ character, onSelect, onOpenGrowth, onDelete }: Props) {
  const isAdmin = useIsAdmin();
  const openLabel = `도감 No. ${formatDexNumber(character.dex_number)} 상세 보기`;

  if (!character.is_public && !isAdmin) {
    return (
      <div className={ROW_CLASS}>
        <button type="button" aria-label={openLabel} onClick={() => onSelect(character.id)} className={STRETCHED_BUTTON_CLASS} />
        <ClassifiedCard variant="row" dexNumber={character.dex_number} />
      </div>
    );
  }

  const ages = character.growth_profiles.map((profile) => profile.age);

  return (
    <div className={ROW_CLASS}>
      <button
        type="button"
        aria-label={`${character.name} 상세 보기`}
        onClick={() => onSelect(character.id)}
        className={STRETCHED_BUTTON_CLASS}
      />
      <div className="pointer-events-none flex w-full items-center gap-4">
        <span className="flex w-20 shrink-0 items-center gap-1.5 truncate font-semibold sm:w-32">
          <span className="shrink-0 text-xs text-zinc-400 sm:text-sm">{formatDexNumber(character.dex_number)}</span>
          <span className="truncate">{character.name}</span>
          {!character.is_public && <PrivateBadge />}
        </span>
        <span className="hidden min-w-0 flex-1 flex-wrap gap-1.5 sm:flex">
          {character.keywords.map((keyword) => (
            <KeywordChip key={keyword} label={keyword} />
          ))}
        </span>
        {ages.length > 0 && (
          <GrowthAgeButtons ages={ages} onSelect={onOpenGrowth} className="pointer-events-auto relative z-10 shrink-0" />
        )}
        <span className="ml-auto shrink-0 text-right text-xs text-zinc-500 sm:text-sm">
          {formatActivityPeriod(character.started_at)}
        </span>
        {isAdmin && (
          <CharacterAdminActions
            characterId={character.id}
            characterName={character.name}
            onDelete={() => onDelete(character)}
            className="pointer-events-auto relative z-10 shrink-0"
          />
        )}
      </div>
    </div>
  );
}

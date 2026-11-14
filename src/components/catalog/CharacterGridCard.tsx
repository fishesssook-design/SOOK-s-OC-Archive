import { useState } from 'react';
import { PrivateBadge } from '@/components/common/PrivateBadge';
import type { Character } from '@/lib/data';
import { formatActivityPeriod, formatDexNumber } from '@/lib/format';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { CharacterImage } from '@/components/common/CharacterImage';
import { GrowthAgeButtons } from '@/components/common/GrowthAgeButtons';
import { KeywordChip } from '@/components/common/KeywordChip';
import { ClassifiedCard } from '@/components/catalog/ClassifiedCard';
import { CharacterAdminActions } from '@/components/catalog/CharacterAdminActions';

interface Props {
  character: Character;
  onSelect: (id: number) => void;
  onOpenGrowth: (age: number) => void;
  onDelete: (character: Character) => void;
}

const CARD_CLASS =
  'group relative flex w-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-left transition duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg';

const STRETCHED_BUTTON_CLASS =
  'absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400';

export function CharacterGridCard({ character, onSelect, onOpenGrowth, onDelete }: Props) {
  const isAdmin = useIsAdmin();
  const [hoveredAge, setHoveredAge] = useState<number | null>(null);
  const openLabel = `도감 No. ${formatDexNumber(character.dex_number)} 상세 보기`;

  if (!character.is_public && !isAdmin) {
    return (
      <div className={CARD_CLASS}>
        <button type="button" aria-label={openLabel} onClick={() => onSelect(character.id)} className={STRETCHED_BUTTON_CLASS} />
        <ClassifiedCard variant="card" dexNumber={character.dex_number} />
      </div>
    );
  }

  const ages = character.growth_profiles.map((profile) => profile.age);
  const hoveredThumbnailUrl = character.growth_profiles.find((profile) => profile.age === hoveredAge)?.thumbnail_url;
  const hoveredThumbnailSrc = hoveredThumbnailUrl ? character.image_srcs[hoveredThumbnailUrl] : undefined;
  const displayThumbnailSrc = hoveredThumbnailSrc ?? character.thumbnail_src;

  return (
    <div className={CARD_CLASS}>
      <button
        type="button"
        aria-label={`${character.name} 상세 보기`}
        onClick={() => onSelect(character.id)}
        className={STRETCHED_BUTTON_CLASS}
      />
      <div className="pointer-events-none relative overflow-hidden">
        <CharacterImage
          src={displayThumbnailSrc}
          name={character.name}
          className="aspect-[3/4] w-full object-cover object-top transition duration-500 group-hover:scale-105"
        />
        {ages.length > 0 && (
          <GrowthAgeButtons
            ages={ages}
            onSelect={onOpenGrowth}
            onHoverChange={setHoveredAge}
            className="pointer-events-auto absolute left-2 right-2 top-2 z-10"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="flex items-center gap-1.5 font-semibold">
          {character.name}
          {!character.is_public && <PrivateBadge />}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {character.keywords.slice(0, 3).map((keyword) => (
            <KeywordChip key={keyword} label={keyword} />
          ))}
        </div>
        <span className="mt-auto pt-1 text-xs text-zinc-500">
          {formatActivityPeriod(character.started_at)}
        </span>
        {isAdmin && (
          <CharacterAdminActions
            characterId={character.id}
            characterName={character.name}
            onDelete={() => onDelete(character)}
            className="pointer-events-auto relative z-10 pt-1"
          />
        )}
      </div>
    </div>
  );
}

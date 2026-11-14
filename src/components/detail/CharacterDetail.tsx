import type { Character } from '@/lib/data';
import { buildProfileRows } from '@/lib/characterProfile';
import type { Neighbors } from '@/lib/characterFilters';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { SILHOUETTE_SRC } from '@/components/common/CharacterImage';
import { ClassifiedCard } from '@/components/catalog/ClassifiedCard';
import { CharacterHero } from '@/components/detail/CharacterHero';
import { DetailNav } from '@/components/detail/DetailNav';
import { DetailSection } from '@/components/detail/DetailSection';

interface Props {
  character: Character;
  neighbors: Neighbors;
  onSelect: (id: number) => void;
  onOpenGrowth: (age: number) => void;
}

export function CharacterDetail({ character, neighbors, onSelect, onOpenGrowth }: Props) {
  const isAdmin = useIsAdmin();

  if (!character.is_public && !isAdmin) {
    return <ClassifiedCard variant="notice" dexNumber={character.dex_number} />;
  }

  const personalityBlocks = character.personality_blocks.length > 0
    ? character.personality_blocks
    : [{ kind: 'text' as const, text: '차분하고 세심하며 주변 사람을 따뜻하게 배려합니다.' }];
  const featuresBlocks = character.features_blocks.length > 0
    ? character.features_blocks
    : [{ kind: 'text' as const, text: '작은 습관과 섬세한 관찰력이 인상적인 캐릭터입니다.' }];

  return (
    <article>
      <CharacterHero
        character={character}
        profileRows={buildProfileRows(character, character.age)}
        fullBodySrc={character.full_body_src ?? SILHOUETTE_SRC}
        onOpenGrowth={onOpenGrowth}
      />

      <div className="mt-[80px] space-y-8">
        <DetailSection title="성격" blocks={personalityBlocks} imageSrcs={character.image_srcs} tone="personality" />
        <DetailSection title="특징" blocks={featuresBlocks} imageSrcs={character.image_srcs} tone="features" />
      </div>

      <div className="mt-12">
        <DetailNav neighbors={neighbors} onSelect={onSelect} />
      </div>
    </article>
  );
}

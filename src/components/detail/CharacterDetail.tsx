import { useState, type ReactNode } from 'react';
import { Calendar } from 'lucide-react';
import type { Character } from '@/lib/data';
import { formatActivityPeriod } from '@/lib/format';
import type { Neighbors } from '@/lib/characterFilters';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { CharacterImage, SILHOUETTE_SRC } from '@/components/common/CharacterImage';
import { ImageLightbox } from '@/components/common/ImageLightbox';
import { ClassifiedCard } from '@/components/catalog/ClassifiedCard';
import { DetailNav } from '@/components/detail/DetailNav';
import { DetailSection, SectionTitle } from '@/components/detail/DetailSection';

interface Props {
  character: Character;
  neighbors: Neighbors;
  onSelect: (id: number) => void;
  onOpenGrowth: (age: number) => void;
}

interface LightboxImage {
  src: string;
  alt: string;
}

export function CharacterDetail({ character, neighbors, onSelect, onOpenGrowth }: Props) {
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);
  const isAdmin = useIsAdmin();

  if (!character.is_public && !isAdmin) {
    return <ClassifiedCard variant="notice" dexNumber={character.dex_number} />;
  }

  const hasGrowthProfiles = character.growth_profiles.length > 0;
  const growthProfiles = character.growth_profiles;
  const name = character.name || '한글이름';
  const catchphrase = character.catchphrase || '오늘도 평온한 하루가 되기를.';
  const fullBodySrc = character.full_body_src ?? SILHOUETTE_SRC;
  const profileRows = [
    { label: '성별', value: character.gender || '여성' },
    { label: '나이', value: character.age || '20세' },
    { label: '종족', value: character.species || '인간' },
    { label: '신장', value: character.height || '170cm' },
    { label: '체형', value: character.body_type || '보통' },
    { label: '직업', value: character.job || '작가' },
  ];
  const personalityBlocks = character.personality_blocks.length > 0
    ? character.personality_blocks
    : [{ kind: 'text' as const, text: '차분하고 세심하며 주변 사람을 따뜻하게 배려합니다.' }];
  const featuresBlocks = character.features_blocks.length > 0
    ? character.features_blocks
    : [{ kind: 'text' as const, text: '작은 습관과 섬세한 관찰력이 인상적인 캐릭터입니다.' }];

  return (
    <article>
      <div className="relative flex w-full flex-col gap-10 md:flex-row md:gap-[44px]">
        <div className="absolute left-0 top-0 z-[5]">
          <div className="flex min-h-[70px] w-max min-w-[530px] items-center justify-center rounded-full bg-[#f8f8f8] px-6 shadow-[0_8px_18px_rgba(0,0,0,0.07)]">
            <p className="whitespace-nowrap text-lg font-bold text-zinc-800" style={{ fontFamily: '"Noto Serif KR", serif' }}>
              “{catchphrase}”
            </p>
          </div>
          <span
            aria-hidden="true"
            className="absolute left-[240px] top-[70px] h-0 w-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#f8f8f8]"
          />
        </div>

        <aside className="relative z-[4] flex min-w-[320px] shrink-0 flex-col pt-[118px]">
          <section className="min-h-[86px] shrink-0">
            <h1 className="text-4xl font-bold leading-[1.2] tracking-tight text-zinc-900">{name}</h1>
            <p className="mt-2 text-base font-semibold text-zinc-400">{character.english_name || 'English name'}</p>
          </section>

          <div className={`mt-[40px] flex flex-1 flex-col gap-10 ${hasGrowthProfiles ? 'justify-between' : ''}`}>
            <section className="flex flex-col">
              <SectionTitle>프로필</SectionTitle>
              <dl className="mt-4 flex flex-col divide-y divide-zinc-200">
                {profileRows.map((row) => (
                  <InfoItem key={row.label} label={row.label} value={row.value} />
                ))}
              </dl>
            </section>

            <section className="flex flex-col gap-3">
              <SectionTitle>활동</SectionTitle>
              <p className="text-base font-bold text-zinc-900">{character.community || '캐릭터 커뮤니티'}</p>
              <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Calendar className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                {formatActivityPeriod(character.started_at || '2022-11-08')}
              </p>
            </section>

            {hasGrowthProfiles && (
              <section className="flex flex-col gap-3">
                <SectionTitle>성장</SectionTitle>
                <div className="flex items-start gap-[10px]">
                  <div className="flex min-w-[290px] shrink-0 gap-[10px] overflow-x-auto [scrollbar-width:none]">
                    {growthProfiles.map((profile) => {
                      const thumbnailSrc = profile.thumbnail_url ? (character.image_srcs[profile.thumbnail_url] ?? null) : null;
                      return (
                        <button
                          type="button"
                          key={profile.age}
                          onClick={() => onOpenGrowth(profile.age)}
                          className="min-w-[90px] shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-yellow-400 hover:shadow-sm"
                        >
                          <CharacterImage src={thumbnailSrc} name={`${profile.age}세 성장 프로필`} className="min-h-[90px] min-w-[90px] shrink-0 object-cover" />
                          <span className="block py-1 text-center text-xs font-semibold text-zinc-600">{profile.age}세</span>
                        </button>
                      );
                    })}
                  </div>
                  {growthProfiles.length >= 4 && <div aria-hidden="true" className="min-w-1 shrink-0 self-stretch rounded-full bg-zinc-300" />}
                </div>
              </section>
            )}
          </div>
        </aside>

        <div className="relative mt-[40px] min-h-[890px] min-w-0 flex-1 self-start">
          <div className="absolute inset-x-0 top-0 z-[1] h-[890px] overflow-hidden rounded-lg bg-[#f8f8f8]">
            <CharacterImage src={character.background_src} name={name} className="h-full w-full object-cover" />
          </div>
          <button
            type="button"
            onClick={() => setLightbox({ src: fullBodySrc, alt: `${name} 전신` })}
            className="absolute inset-x-0 top-[-35px] z-[3] flex h-[960px] cursor-zoom-in items-center justify-center"
          >
            <CharacterImage src={fullBodySrc} name={name} className="h-full w-full object-contain transition duration-500 hover:scale-[1.015]" />
          </button>
          <p className="absolute -bottom-6 right-0 z-[3] text-[10px] text-zinc-400">© SOOK. All rights reserved.</p>
        </div>
      </div>

      <div className="mt-[80px] space-y-8">
        <DetailSection title="성격" blocks={personalityBlocks} imageSrcs={character.image_srcs} tone="personality" />
        <DetailSection title="특징" blocks={featuresBlocks} imageSrcs={character.image_srcs} tone="features" />
      </div>

      <div className="mt-12">
        <DetailNav neighbors={neighbors} onSelect={onSelect} />
      </div>

      {lightbox && <ImageLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </article>
  );
}

function InfoItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <dt className="w-[56px] shrink-0 rounded-full border border-zinc-300 px-2 py-1 text-center text-xs text-zinc-500">{label}</dt>
      <dd className="min-w-0 break-words text-base font-semibold text-zinc-800">{value}</dd>
    </div>
  );
}

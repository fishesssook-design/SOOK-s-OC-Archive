import { useState, type ReactNode } from 'react';
import { Calendar } from 'lucide-react';
import type { Character } from '@/lib/data';
import type { ProfileRow } from '@/lib/characterProfile';
import { formatActivityPeriod } from '@/lib/format';
import { CharacterImage } from '@/components/common/CharacterImage';
import { ImageLightbox } from '@/components/common/ImageLightbox';
import { SectionTitle } from '@/components/detail/DetailSection';

interface Props {
  character: Character;
  profileRows: ProfileRow[];
  fullBodySrc: string;
  activeAge?: number;
  onOpenGrowth: (age: number) => void;
}

export function CharacterHero({ character, profileRows, fullBodySrc, activeAge, onOpenGrowth }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const name = character.name || '한글이름';
  const catchphrase = character.catchphrase || '오늘도 평온한 하루가 되기를.';
  const growthProfiles = character.growth_profiles;
  const hasGrowthProfiles = growthProfiles.length > 0;

  return (
    <>
      <div className="relative flex w-full flex-col gap-10 md:flex-row md:gap-[44px]">
        <div className="absolute left-0 top-0 z-[5]">
          <div className="min-h-[70px] w-max min-w-[530px] rounded-full bg-zinc-200 p-px">
            <div className="flex min-h-[68px] items-center justify-center rounded-full bg-white px-6">
              <p className="whitespace-nowrap text-lg font-bold text-zinc-800" style={{ fontFamily: '"Noto Serif KR", serif' }}>
                “{catchphrase}”
              </p>
            </div>
          </div>
          <div aria-hidden="true" className="absolute left-[345px] top-[69px] h-[19px] w-[19px] bg-zinc-200" style={{ clipPath: 'polygon(0 0, 100% 100%, 100% 0)' }} />
          <div aria-hidden="true" className="absolute left-[345px] top-[69px] h-[19px] w-[19px] bg-white" style={{ clipPath: 'polygon(1.41px 0, 18px 16.59px, 18px 0)' }} />
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
                      const isActive = profile.age === activeAge;
                      return (
                        <button
                          type="button"
                          key={profile.age}
                          onClick={() => onOpenGrowth(profile.age)}
                          disabled={isActive}
                          aria-current={isActive ? 'page' : undefined}
                          className={`min-w-[90px] shrink-0 overflow-hidden rounded-lg border bg-white text-left transition ${
                            isActive ? 'cursor-default border-transparent' : 'border-zinc-200 hover:border-yellow-400'
                          }`}
                        >
                          <div className="relative">
                            <CharacterImage src={thumbnailSrc} name={`${profile.age}세 성장 프로필`} className="min-h-[90px] min-w-[90px] shrink-0 object-cover" />
                            {isActive && <div aria-hidden="true" className="absolute inset-0 rounded-t-[7px] bg-black/30" />}
                          </div>
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
            onClick={() => setLightboxOpen(true)}
            className="absolute inset-x-0 top-[-35px] z-[3] flex h-[960px] cursor-zoom-in items-center justify-center"
          >
            <CharacterImage src={fullBodySrc} name={name} className="h-full w-full object-contain transition duration-500 hover:scale-[1.015]" />
          </button>
          <p className="absolute -bottom-6 right-0 z-[3] text-[10px] text-zinc-400">© SOOK. All rights reserved.</p>
        </div>
      </div>

      {lightboxOpen && <ImageLightbox src={fullBodySrc} alt={`${name} 전신`} onClose={() => setLightboxOpen(false)} />}
    </>
  );
}

function InfoItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <dt className="w-[56px] shrink-0 rounded-full border border-zinc-300 px-2 py-1 text-center text-xs text-zinc-500">{label}</dt>
      <dd className="min-w-0 break-words text-base font-semibold text-zinc-800">{value}</dd>
    </div>
  );
}

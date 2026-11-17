import type { Character, ContentBlock, GrowthProfile } from '@/lib/data';

export interface ProfileRow {
  label: string;
  value: string;
}

export interface CharacterGrowthView {
  name: string;
  englishName: string;
  catchphrase: string;
  ageLabel: string;
  gender: string;
  species: string;
  height: string;
  bodyType: string;
  job: string;
  keywords: string[];
  community: string;
  startedAt: string;
  personalityBlocks: ContentBlock[];
  featuresBlocks: ContentBlock[];
  detailsBlocks: ContentBlock[];
  thumbnailSrc: string | null;
  fullBodySrc: string | null;
  backgroundSrc: string | null;
}

export function characterView(character: Character): CharacterGrowthView {
  return {
    name: character.name,
    englishName: character.english_name,
    catchphrase: character.catchphrase,
    ageLabel: character.age,
    gender: character.gender,
    species: character.species,
    height: character.height,
    bodyType: character.body_type,
    job: character.job,
    keywords: character.keywords,
    community: character.community,
    startedAt: character.started_at,
    personalityBlocks: character.personality_blocks,
    featuresBlocks: character.features_blocks,
    detailsBlocks: character.details_blocks,
    thumbnailSrc: character.thumbnail_src,
    fullBodySrc: character.full_body_src,
    backgroundSrc: character.background_src,
  };
}

export function growthView(character: Character, profile: GrowthProfile): CharacterGrowthView {
  return {
    ...characterView(character),
    name: profile.name || character.name,
    englishName: profile.english_name || character.english_name,
    catchphrase: profile.catchphrase || character.catchphrase,
    ageLabel: profile.age_label || `${profile.age}세`,
    gender: profile.gender || character.gender,
    species: profile.species || character.species,
    height: profile.height || character.height,
    bodyType: profile.body_type || character.body_type,
    job: profile.job || character.job,
    keywords: profile.keywords.length > 0 ? profile.keywords : character.keywords,
    community: profile.community || character.community,
    startedAt: profile.started_at || character.started_at,
    personalityBlocks: withFallback(profile.personality_blocks, character.personality_blocks),
    featuresBlocks: withFallback(profile.features_blocks, character.features_blocks),
    detailsBlocks: withFallback(profile.details_blocks, character.details_blocks),
    thumbnailSrc: profile.thumbnail_url ? (character.image_srcs[profile.thumbnail_url] ?? null) : character.thumbnail_src,
    fullBodySrc: profile.full_body_url ? (character.image_srcs[profile.full_body_url] ?? null) : character.full_body_src,
    backgroundSrc: profile.background_url ? (character.image_srcs[profile.background_url] ?? null) : character.background_src,
  };
}

function withFallback(blocks: ContentBlock[], fallback: ContentBlock[]): ContentBlock[] {
  return blocks.length > 0 ? blocks : fallback;
}

export function buildProfileRows(view: CharacterGrowthView): ProfileRow[] {
  return [
    { label: '성별', value: view.gender || '여성' },
    { label: '나이', value: view.ageLabel || '20세' },
    { label: '종족', value: view.species || '인간' },
    { label: '신장', value: view.height || '170cm' },
    { label: '체형', value: view.bodyType || '보통' },
    { label: '직업', value: view.job || '작가' },
  ];
}

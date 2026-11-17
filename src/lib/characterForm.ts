import type { Character, CharacterRecord, ContentBlock, GrowthProfile } from '@/lib/data';
import { CHARACTER_IMAGE_MAX_BYTES, CHARACTER_IMAGE_TYPES } from '@/lib/characterImages';

export interface ImageSlot {
  path: string | null;
  src: string | null;
  file: File | null;
}

export type BlockDraft =
  | { key: string; kind: 'text'; text: string }
  | { key: string; kind: 'image'; image: ImageSlot };

export interface GrowthFormValues {
  age: string;
  name: string;
  englishName: string;
  catchphrase: string;
  gender: string;
  ageLabel: string;
  species: string;
  height: string;
  bodyType: string;
  job: string;
  keywords: string;
  community: string;
  startedAt: string;
  personality: BlockDraft[];
  features: BlockDraft[];
  thumbnail: ImageSlot;
  fullBody: ImageSlot;
  background: ImageSlot;
}

export type DescriptionSection = 'personality' | 'features' | 'details';

const EMPTY_IMAGE: ImageSlot = { path: null, src: null, file: null };
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_AGE = 999;

function blocksToDrafts(blocks: ContentBlock[], imageSrcs: Record<string, string>): BlockDraft[] {
  if (blocks.length === 0) return [createBlockDraft('text')];
  return blocks.map((block) =>
    block.kind === 'text'
      ? { key: crypto.randomUUID(), kind: 'text', text: block.text }
      : {
          key: crypto.randomUUID(),
          kind: 'image',
          image: { path: block.path, src: imageSrcs[block.path] ?? null, file: null },
        },
  );
}

function slotFromPath(path: string | null, imageSrcs: Record<string, string>): ImageSlot {
  return { path, src: path ? (imageSrcs[path] ?? null) : null, file: null };
}

export function createBlockDraft(kind: 'text' | 'image'): BlockDraft {
  const key = crypto.randomUUID();
  return kind === 'text' ? { key, kind, text: '' } : { key, kind, image: EMPTY_IMAGE };
}

export function growthFormFromCharacter(character: Character): GrowthFormValues {
  return {
    age: '',
    name: character.name,
    englishName: character.english_name,
    catchphrase: character.catchphrase,
    gender: character.gender,
    ageLabel: character.age,
    species: character.species,
    height: character.height,
    bodyType: character.body_type,
    job: character.job,
    keywords: character.keywords.join(', '),
    community: character.community,
    startedAt: character.started_at,
    personality: blocksToDrafts(character.personality_blocks, character.image_srcs),
    features: blocksToDrafts(character.features_blocks, character.image_srcs),
    thumbnail: { path: character.thumbnail_url, src: character.thumbnail_src, file: null },
    fullBody: { path: character.full_body_url, src: character.full_body_src, file: null },
    background: { path: character.background_url, src: character.background_src, file: null },
  };
}

export function growthFormFromProfile(profile: GrowthProfile, imageSrcs: Record<string, string>): GrowthFormValues {
  return {
    age: String(profile.age),
    name: profile.name,
    englishName: profile.english_name,
    catchphrase: profile.catchphrase,
    gender: profile.gender,
    ageLabel: profile.age_label,
    species: profile.species,
    height: profile.height,
    bodyType: profile.body_type,
    job: profile.job,
    keywords: profile.keywords.join(', '),
    community: profile.community,
    startedAt: profile.started_at,
    personality: blocksToDrafts(profile.personality_blocks, imageSrcs),
    features: blocksToDrafts(profile.features_blocks, imageSrcs),
    thumbnail: slotFromPath(profile.thumbnail_url, imageSrcs),
    fullBody: slotFromPath(profile.full_body_url, imageSrcs),
    background: slotFromPath(profile.background_url, imageSrcs),
  };
}

export function parseKeywords(text: string): string[] {
  const keywords = text
    .split(',')
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0);
  return [...new Set(keywords)];
}

export function validateGrowthForm(values: GrowthFormValues, takenAges: number[]): string | null {
  const age = Number(values.age);
  if (!Number.isInteger(age) || age < 1 || age > MAX_AGE) {
    return `나이는 1부터 ${MAX_AGE}까지의 숫자로 입력해 주세요.`;
  }
  if (takenAges.includes(age)) return '이미 등록된 나이입니다.';
  if (!values.name.trim()) return '이름을 입력해 주세요.';
  if (!DATE_PATTERN.test(values.startedAt)) return '활동 시작일을 입력해 주세요.';

  const imageSlots = [
    values.thumbnail,
    values.fullBody,
    values.background,
    ...[...values.personality, ...values.features].flatMap((draft) =>
      draft.kind === 'image' ? [draft.image] : [],
    ),
  ];
  return imageSlots.map((slot) => validateImageFile(slot.file)).find((message) => message !== null) ?? null;
}

function validateImageFile(file: File | null): string | null {
  if (!file) return null;
  if (!CHARACTER_IMAGE_TYPES.includes(file.type)) return 'JPG, PNG, WebP, GIF 이미지만 올릴 수 있어요.';
  if (file.size > CHARACTER_IMAGE_MAX_BYTES) return '이미지는 5MB 이하만 올릴 수 있어요.';
  return null;
}

export type CharacterInput = Omit<CharacterRecord, 'id' | 'ended_at' | 'dex_number' | 'growth_profiles'>;

export interface ResolvedGrowth {
  thumbnail_url: string | null;
  full_body_url: string | null;
  background_url: string | null;
  blocks: Record<DescriptionSection, ContentBlock[]>;
}

export interface ResolvedCharacter {
  thumbnail_url: string | null;
  full_body_url: string | null;
  background_url: string | null;
  blocks: Record<DescriptionSection, ContentBlock[]>;
}

export function buildGrowthProfile(values: GrowthFormValues, resolved: ResolvedGrowth): GrowthProfile {
  const personality = dropEmptyText(resolved.blocks.personality);
  const features = dropEmptyText(resolved.blocks.features);

  return {
    age: Number(values.age),
    name: values.name.trim(),
    english_name: values.englishName.trim(),
    catchphrase: values.catchphrase.trim(),
    gender: values.gender.trim(),
    age_label: values.ageLabel.trim(),
    species: values.species.trim(),
    height: values.height.trim(),
    body_type: values.bodyType.trim(),
    job: values.job.trim(),
    keywords: parseKeywords(values.keywords),
    community: values.community.trim(),
    started_at: values.startedAt,
    personality: blocksToText(personality),
    features: blocksToText(features),
    personality_blocks: personality,
    features_blocks: features,
    thumbnail_url: resolved.thumbnail_url,
    full_body_url: resolved.full_body_url,
    background_url: resolved.background_url,
  };
}

function dropEmptyText(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.filter((block) => block.kind === 'image' || block.text.trim() !== '');
}

function blocksToText(blocks: ContentBlock[]): string {
  return blocks
    .flatMap((block) => (block.kind === 'text' ? [block.text] : []))
    .join('\n');
}

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

export interface GrowthFormRow {
  key: string;
  age: string;
  thumbnail: ImageSlot;
  fullBody: ImageSlot;
  profile: BlockDraft[];
  settings: BlockDraft[];
}

export interface CharacterFormValues {
  name: string;
  englishName: string;
  catchphrase: string;
  gender: string;
  age: string;
  species: string;
  height: string;
  bodyType: string;
  job: string;
  keywords: string;
  personality: BlockDraft[];
  features: BlockDraft[];
  details: BlockDraft[];
  community: string;
  startedAt: string;
  isPublic: boolean;
  thumbnail: ImageSlot;
  fullBody: ImageSlot;
  background: ImageSlot;
  growthProfiles: GrowthFormRow[];
}

export type DescriptionSection = 'personality' | 'features' | 'details';

const EMPTY_IMAGE: ImageSlot = { path: null, src: null, file: null };
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_AGE = 999;

export function createEmptyGrowthRow(): GrowthFormRow {
  return {
    key: crypto.randomUUID(),
    age: '',
    thumbnail: EMPTY_IMAGE,
    fullBody: EMPTY_IMAGE,
    profile: [createBlockDraft('text')],
    settings: [createBlockDraft('text')],
  };
}

export function createBlockDraft(kind: 'text' | 'image'): BlockDraft {
  const key = crypto.randomUUID();
  return kind === 'text' ? { key, kind, text: '' } : { key, kind, image: EMPTY_IMAGE };
}

export function createEmptyCharacterForm(): CharacterFormValues {
  return {
    name: '',
    englishName: '',
    catchphrase: '',
    gender: '',
    age: '',
    species: '',
    height: '',
    bodyType: '',
    job: '',
    keywords: '',
    personality: [createBlockDraft('text')],
    features: [createBlockDraft('text')],
    details: [createBlockDraft('text')],
    community: '',
    startedAt: '',
    isPublic: true,
    thumbnail: EMPTY_IMAGE,
    fullBody: EMPTY_IMAGE,
    background: EMPTY_IMAGE,
    growthProfiles: [],
  };
}

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

export function characterToFormValues(character: Character): CharacterFormValues {
  return {
    name: character.name,
    englishName: character.english_name,
    catchphrase: character.catchphrase,
    gender: character.gender,
    age: character.age,
    species: character.species,
    height: character.height,
    bodyType: character.body_type,
    job: character.job,
    keywords: character.keywords.join(', '),
    personality: blocksToDrafts(character.personality_blocks, character.image_srcs),
    features: blocksToDrafts(character.features_blocks, character.image_srcs),
    details: blocksToDrafts(character.details_blocks, character.image_srcs),
    community: character.community,
    startedAt: character.started_at,
    isPublic: character.is_public,
    thumbnail: { path: character.thumbnail_url, src: character.thumbnail_src, file: null },
    fullBody: { path: character.full_body_url, src: character.full_body_src, file: null },
    background: { path: character.background_url, src: character.background_src, file: null },
    growthProfiles: character.growth_profiles.map((profile) => ({
      key: crypto.randomUUID(),
      age: String(profile.age),
      thumbnail: slotFromPath(profile.thumbnail_url, character.image_srcs),
      fullBody: slotFromPath(profile.full_body_url, character.image_srcs),
      profile: blocksToDrafts(profile.profile_blocks, character.image_srcs),
      settings: blocksToDrafts(profile.settings_blocks, character.image_srcs),
    })),
  };
}

function slotFromPath(path: string | null, imageSrcs: Record<string, string>): ImageSlot {
  return { path, src: path ? (imageSrcs[path] ?? null) : null, file: null };
}

export function parseKeywords(text: string): string[] {
  const keywords = text
    .split(',')
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0);
  return [...new Set(keywords)];
}

export function validateCharacterForm(values: CharacterFormValues): string | null {
  if (!values.name.trim()) return '이름을 입력해 주세요.';

  if (!DATE_PATTERN.test(values.startedAt)) return '활동 시작일을 입력해 주세요.';

  const imageSlots = [
    values.thumbnail,
    values.fullBody,
    values.background,
    ...[...values.personality, ...values.features, ...values.details].flatMap((draft) =>
      draft.kind === 'image' ? [draft.image] : [],
    ),
    ...values.growthProfiles.flatMap((row) => [
      row.thumbnail,
      row.fullBody,
      ...[...row.profile, ...row.settings].flatMap((draft) => (draft.kind === 'image' ? [draft.image] : [])),
    ]),
  ];
  const imageError = imageSlots.map((slot) => validateImageFile(slot.file)).find((message) => message !== null);
  if (imageError) return imageError;

  const ages = values.growthProfiles.map((row) => Number(row.age));
  if (ages.some((age) => !Number.isInteger(age) || age < 1 || age > MAX_AGE)) {
    return `성장 프로필의 나이는 1부터 ${MAX_AGE}까지의 숫자로 입력해 주세요.`;
  }
  if (new Set(ages).size !== ages.length) return '성장 프로필의 나이가 중복되었습니다.';

  return null;
}

function validateImageFile(file: File | null): string | null {
  if (!file) return null;
  if (!CHARACTER_IMAGE_TYPES.includes(file.type)) return 'JPG, PNG, WebP, GIF 이미지만 올릴 수 있어요.';
  if (file.size > CHARACTER_IMAGE_MAX_BYTES) return '이미지는 5MB 이하만 올릴 수 있어요.';
  return null;
}

export type CharacterInput = Omit<CharacterRecord, 'id' | 'ended_at' | 'dex_number'>;

export interface ResolvedGrowth {
  thumbnail_url: string | null;
  full_body_url: string | null;
  profile_blocks: ContentBlock[];
  settings_blocks: ContentBlock[];
}

export interface ResolvedImages {
  thumbnail_url: string | null;
  full_body_url: string | null;
  background_url: string | null;
  blocks: Record<DescriptionSection, ContentBlock[]>;
  growth: ResolvedGrowth[];
}

export function buildCharacterInput(values: CharacterFormValues, images: ResolvedImages): CharacterInput {
  const growthProfiles: GrowthProfile[] = values.growthProfiles
    .map((row, index) => {
      const resolved = images.growth[index];
      return {
        age: Number(row.age),
        thumbnail_url: resolved.thumbnail_url,
        full_body_url: resolved.full_body_url,
        profile_blocks: dropEmptyText(resolved.profile_blocks),
        settings_blocks: dropEmptyText(resolved.settings_blocks),
      };
    })
    .sort((a, b) => a.age - b.age);

  const personality = dropEmptyText(images.blocks.personality);
  const features = dropEmptyText(images.blocks.features);
  const details = dropEmptyText(images.blocks.details);

  return {
    name: values.name.trim(),
    english_name: values.englishName.trim(),
    catchphrase: values.catchphrase.trim(),
    gender: values.gender.trim(),
    age: values.age.trim(),
    species: values.species.trim(),
    height: values.height.trim(),
    body_type: values.bodyType.trim(),
    job: values.job.trim(),
    keywords: parseKeywords(values.keywords),
    personality: blocksToText(personality),
    features: blocksToText(features),
    details: blocksToText(details),
    personality_blocks: personality,
    features_blocks: features,
    details_blocks: details,
    community: values.community.trim(),
    started_at: values.startedAt,
    is_public: values.isPublic,
    thumbnail_url: images.thumbnail_url,
    full_body_url: images.full_body_url,
    background_url: images.background_url,
    growth_profiles: growthProfiles,
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

import { supabase } from '@/lib/supabase';
import { createImageUrls } from '@/lib/characterImages';

export interface GrowthProfile {
  age: number;
  thumbnail_url: string | null;
  full_body_url: string | null;
  profile_blocks: ContentBlock[];
  settings_blocks: ContentBlock[];
}

export type ContentBlock = { kind: 'text'; text: string } | { kind: 'image'; path: string };

export interface CharacterRecord {
  id: number;
  dex_number: number;
  catchphrase: string;
  name: string;
  english_name: string;
  gender: string;
  age: string;
  species: string;
  height: string;
  body_type: string;
  job: string;
  keywords: string[];
  personality: string;
  features: string;
  details: string;
  personality_blocks: ContentBlock[];
  features_blocks: ContentBlock[];
  details_blocks: ContentBlock[];
  community: string;
  started_at: string;
  ended_at: string | null;
  is_public: boolean;
  thumbnail_url: string | null;
  full_body_url: string | null;
  background_url: string | null;
  growth_profiles: GrowthProfile[];
}

export interface Character extends CharacterRecord {
  thumbnail_src: string | null;
  full_body_src: string | null;
  background_src: string | null;
  image_srcs: Record<string, string>;
}

type ImagePathSource = Pick<
  CharacterRecord,
  | 'thumbnail_url'
  | 'full_body_url'
  | 'background_url'
  | 'personality_blocks'
  | 'features_blocks'
  | 'details_blocks'
  | 'growth_profiles'
>;

export function getCharacterImagePaths(record: ImagePathSource): string[] {
  const blockPaths = [
    record.personality_blocks,
    record.features_blocks,
    record.details_blocks,
    ...record.growth_profiles.flatMap((profile) => [profile.profile_blocks, profile.settings_blocks]),
  ]
    .flat()
    .flatMap((block) => (block.kind === 'image' ? [block.path] : []));
  const growthImagePaths = record.growth_profiles.flatMap((profile) =>
    [profile.thumbnail_url, profile.full_body_url].filter((path): path is string => path !== null),
  );
  return [record.thumbnail_url, record.full_body_url, record.background_url, ...growthImagePaths, ...blockPaths].filter(
    (path): path is string => path !== null,
  );
}

export async function fetchCharacters(): Promise<Character[]> {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw new Error(error.message);
  if (!Array.isArray(data)) throw new Error('Unexpected character response');

  const records = data as CharacterRecord[];
  const urls = await createImageUrls(records.flatMap(getCharacterImagePaths));

  return records.map((record) => ({
    ...record,
    thumbnail_src: record.thumbnail_url ? (urls.get(record.thumbnail_url) ?? null) : null,
    full_body_src: record.full_body_url ? (urls.get(record.full_body_url) ?? null) : null,
    background_src: record.background_url ? (urls.get(record.background_url) ?? null) : null,
    image_srcs: Object.fromEntries(urls),
  }));
}

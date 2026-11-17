import { supabase } from '@/lib/supabase';
import { getCharacterImagePaths, type Character, type ContentBlock, type GrowthProfile } from '@/lib/data';
import { removeCharacterImages, uploadCharacterImage } from '@/lib/characterImages';
import {
  buildGrowthProfile,
  type BlockDraft,
  type DescriptionSection,
  type GrowthFormValues,
  type ImageSlot,
  type ResolvedGrowth,
} from '@/lib/characterForm';

const PERMISSION_ERROR_PATTERNS = ['row-level security', 'affected no rows'];

export function describeSaveError(err: unknown): string {
  const message = err instanceof Error ? err.message : '';
  if (PERMISSION_ERROR_PATTERNS.some((pattern) => message.includes(pattern))) {
    return '관리자 권한이 없습니다. 관리자 계정으로 로그인했는지 확인해 주세요.';
  }
  return '저장하지 못했습니다. 잠시 후 다시 시도해 주세요.';
}

export async function saveGrowthProfile(character: Character, originalAge: number | null, values: GrowthFormValues): Promise<void> {
  const uploaded: string[] = [];

  try {
    const resolved: ResolvedGrowth = {
      thumbnail_url: await resolveImage(values.thumbnail, uploaded),
      full_body_url: await resolveImage(values.fullBody, uploaded),
      background_url: await resolveImage(values.background, uploaded),
      blocks: {
        personality: await resolveBlocks(values.personality, uploaded),
        features: await resolveBlocks(values.features, uploaded),
        details: await resolveBlocks(values.details, uploaded),
      },
    };
    const profile = buildGrowthProfile(values, resolved);

    const current = await fetchGrowthProfiles(character.id);
    const next = [...current.filter((item) => item.age !== originalAge), profile].sort((a, b) => a.age - b.age);
    await updateGrowthProfiles(character.id, next);
    await cleanupImages(replacedImagePaths(character, current, next));
  } catch (err) {
    await cleanupImages(uploaded);
    throw err;
  }
}

export async function deleteGrowthProfile(character: Character, age: number): Promise<void> {
  const current = await fetchGrowthProfiles(character.id);
  const next = current.filter((item) => item.age !== age);
  await updateGrowthProfiles(character.id, next);
  await cleanupImages(replacedImagePaths(character, current, next));
}

export async function deleteCharacter(character: Character): Promise<void> {
  const { data, error } = await supabase
    .from('characters')
    .delete()
    .eq('id', character.id)
    .select('id')
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Character delete affected no rows');

  await cleanupImages(getCharacterImagePaths(character));
}

function replacedImagePaths(character: Character, before: GrowthProfile[], after: GrowthProfile[]): string[] {
  const keptPaths = getCharacterImagePaths({ ...character, growth_profiles: after });
  return getCharacterImagePaths({ ...character, growth_profiles: before }).filter((path) => !keptPaths.includes(path));
}

async function resolveImage(slot: ImageSlot, uploaded: string[]): Promise<string | null> {
  if (!slot.file) return slot.path;

  const path = await uploadCharacterImage(slot.file);
  uploaded.push(path);
  return path;
}

async function resolveBlocks(drafts: BlockDraft[], uploaded: string[]): Promise<ContentBlock[]> {
  const blocks: ContentBlock[] = [];
  for (const draft of drafts) {
    if (draft.kind === 'text') {
      const text = draft.text.trim();
      if (text) blocks.push({ kind: 'text', text });
      continue;
    }
    const path = await resolveImage(draft.image, uploaded);
    if (path) blocks.push({ kind: 'image', path });
  }
  return blocks;
}

async function fetchGrowthProfiles(id: number): Promise<GrowthProfile[]> {
  const { data, error } = await supabase.from('characters').select('growth_profiles').eq('id', id).maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Character not found');
  return data.growth_profiles as GrowthProfile[];
}

async function updateGrowthProfiles(id: number, profiles: GrowthProfile[]): Promise<void> {
  const { data, error } = await supabase
    .from('characters')
    .update({ growth_profiles: profiles })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Character update affected no rows');
}

async function cleanupImages(paths: string[]): Promise<void> {
  if (paths.length === 0) return;

  try {
    await removeCharacterImages(paths);
  } catch (err) {
    console.error('[characters] could not remove image files:', err);
  }
}

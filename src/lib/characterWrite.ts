import { supabase } from '@/lib/supabase';
import { getCharacterImagePaths, type Character, type ContentBlock } from '@/lib/data';
import { removeCharacterImages, uploadCharacterImage } from '@/lib/characterImages';
import {
  buildCharacterInput,
  type BlockDraft,
  type CharacterFormValues,
  type CharacterInput,
  type ImageSlot,
  type ResolvedGrowth,
  type ResolvedImages,
} from '@/lib/characterForm';

const PERMISSION_ERROR_PATTERNS = ['row-level security', 'affected no rows'];

export function describeSaveError(err: unknown): string {
  const message = err instanceof Error ? err.message : '';
  if (PERMISSION_ERROR_PATTERNS.some((pattern) => message.includes(pattern))) {
    return '관리자 권한이 없습니다. 관리자 계정으로 로그인했는지 확인해 주세요.';
  }
  return '저장하지 못했습니다. 잠시 후 다시 시도해 주세요.';
}

export async function saveCharacter(existing: Character | null, values: CharacterFormValues): Promise<void> {
  const uploaded: string[] = [];

  try {
    const thumbnailPath = await resolveImage(values.thumbnail, uploaded);
    const fullBodyPath = await resolveImage(values.fullBody, uploaded);
    const backgroundPath = await resolveImage(values.background, uploaded);
    const blocks = {
      personality: await resolveBlocks(values.personality, uploaded),
      features: await resolveBlocks(values.features, uploaded),
      details: await resolveBlocks(values.details, uploaded),
    };
    const growth: ResolvedGrowth[] = [];
    for (const row of values.growthProfiles) {
      growth.push({
        thumbnail_url: await resolveImage(row.thumbnail, uploaded),
        full_body_url: await resolveImage(row.fullBody, uploaded),
        profile_blocks: await resolveBlocks(row.profile, uploaded),
        settings_blocks: await resolveBlocks(row.settings, uploaded),
      });
    }
    const images: ResolvedImages = { thumbnail_url: thumbnailPath, full_body_url: fullBodyPath, background_url: backgroundPath, blocks, growth };
    const input = buildCharacterInput(values, images);

    if (existing) {
      await updateCharacterRow(existing.id, input);
    } else {
      await insertCharacterRow(input);
    }

    const keptPaths = getCharacterImagePaths(input);
    const replacedPaths = (existing ? getCharacterImagePaths(existing) : []).filter(
      (path) => !keptPaths.includes(path),
    );
    await cleanupImages(replacedPaths);
  } catch (err) {
    await cleanupImages(uploaded);
    throw err;
  }
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

async function insertCharacterRow(input: CharacterInput): Promise<void> {
  const { data, error } = await supabase.from('characters').insert(input).select('id').maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Character insert returned no row');
}

async function updateCharacterRow(id: number, input: CharacterInput): Promise<void> {
  const { data, error } = await supabase
    .from('characters')
    .update(input)
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

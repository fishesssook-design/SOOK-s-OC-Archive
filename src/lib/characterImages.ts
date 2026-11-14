import { supabase } from '@/lib/supabase';

const BUCKET = 'character-images';
const SIGNED_URL_SECONDS = 60 * 60;

export const CHARACTER_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export const CHARACTER_IMAGE_TYPES = Object.keys(EXTENSION_BY_TYPE);

export async function createImageUrls(paths: string[]): Promise<Map<string, string>> {
  const urls = new Map<string, string>();
  if (paths.length === 0) return urls;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, SIGNED_URL_SECONDS);

  if (error) {
    console.error('[images] could not sign image URLs:', error.message);
    return urls;
  }
  if (!Array.isArray(data)) {
    console.error('[images] unexpected signed URL response');
    return urls;
  }

  for (const item of data) {
    if (item.error || !item.signedUrl || !item.path) {
      console.error('[images] could not sign image URL:', item.path, item.error);
      continue;
    }
    urls.set(item.path, item.signedUrl);
  }
  return urls;
}

export async function uploadCharacterImage(file: File): Promise<string> {
  const extension = EXTENSION_BY_TYPE[file.type];
  if (!extension) throw new Error('Unsupported image type');

  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);
  return path;
}

export async function removeCharacterImages(paths: string[]): Promise<void> {
  if (paths.length === 0) return;

  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) throw new Error(error.message);
}

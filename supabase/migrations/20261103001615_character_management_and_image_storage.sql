/*
# Character management: end dates, IDs, admin write access, and private image storage

1. Modified Tables
- `characters`:
  - New column `ended_at` (date, optional). Empty means the character is still active and is shown as "현재".
  - `id` now gets a value automatically from a counter when a new character is added. The counter starts after the highest existing id, so existing ids are unchanged.

2. New Storage
- Private bucket `character-images` for thumbnails and full-body images.
  - Files are at most 5 MB and must be JPEG, PNG, WebP, or GIF.
  - The bucket is not public. Images are shown through short-lived signed links.

3. Security
- `characters`: signed-in users can read. Only admins (rows in `admins`) can insert, update, or delete. Writes are blocked for everyone else by row rules, and grants are limited to these verbs.
- Image files: any signed-in user can read files in the bucket. Only admins can upload or delete files.
- The anonymous role keeps no access to characters or images.

4. Notes
- Existing rows and their data are not changed.
*/

ALTER TABLE characters ADD COLUMN IF NOT EXISTS ended_at date;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = 'characters_id_seq') THEN
    CREATE SEQUENCE characters_id_seq;
    PERFORM setval('characters_id_seq', COALESCE((SELECT MAX(id) FROM characters), 0) + 1, false);
  END IF;
END $$;

ALTER SEQUENCE characters_id_seq OWNED BY characters.id;
ALTER TABLE characters ALTER COLUMN id SET DEFAULT nextval('characters_id_seq');
GRANT USAGE ON SEQUENCE characters_id_seq TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON characters TO authenticated;

DROP POLICY IF EXISTS "admin_insert_characters" ON characters;
CREATE POLICY "admin_insert_characters" ON characters FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_delete_characters" ON characters;
CREATE POLICY "admin_delete_characters" ON characters FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'character-images',
  'character-images',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

DROP POLICY IF EXISTS "authenticated_read_character_images" ON storage.objects;
CREATE POLICY "authenticated_read_character_images" ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'character-images');

DROP POLICY IF EXISTS "admin_insert_character_images" ON storage.objects;
CREATE POLICY "admin_insert_character_images" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'character-images'
    AND EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "admin_delete_character_images" ON storage.objects;
CREATE POLICY "admin_delete_character_images" ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'character-images'
    AND EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

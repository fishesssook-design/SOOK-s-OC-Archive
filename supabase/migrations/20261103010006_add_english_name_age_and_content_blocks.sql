/*
# Add English name, age, and rich content blocks to characters

1. New Columns on `characters`
- `english_name` (text, default ''): English name shown under the Korean name.
- `age` (text, default ''): free-text age shown next to gender.
- `personality_blocks`, `features_blocks`, `details_blocks` (jsonb, default '[]'): ordered lists of text and image blocks for the description sections. Each block is {"kind":"text","text":...} or {"kind":"image","path":...}.

2. Data Backfill
- Existing plain-text personality, features, and details are copied into a single text block so nothing is lost.

3. Security
- No policy or grant changes. The table-level grants and admin-only write policies from earlier migrations already cover the new columns.

4. Notes
- The original text columns are kept and stay in sync with the text blocks on save.
- Existing rows keep their end date column untouched; it is no longer shown in the app.
*/

ALTER TABLE characters ADD COLUMN IF NOT EXISTS english_name text NOT NULL DEFAULT '';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS age text NOT NULL DEFAULT '';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS personality_blocks jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS features_blocks jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS details_blocks jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE characters
SET personality_blocks = jsonb_build_array(jsonb_build_object('kind', 'text', 'text', personality))
WHERE personality_blocks = '[]'::jsonb AND personality <> '';

UPDATE characters
SET features_blocks = jsonb_build_array(jsonb_build_object('kind', 'text', 'text', features))
WHERE features_blocks = '[]'::jsonb AND features <> '';

UPDATE characters
SET details_blocks = jsonb_build_array(jsonb_build_object('kind', 'text', 'text', details))
WHERE details_blocks = '[]'::jsonb AND details <> '';

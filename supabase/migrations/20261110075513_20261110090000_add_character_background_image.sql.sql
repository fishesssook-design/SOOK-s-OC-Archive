/*
# Add character background image

1. Modified Tables
- `characters`:
  - New column `background_url` (text, optional): stores the private storage path for the background image shown behind the full-body character art.

2. Data Changes
- Existing characters keep their current content and receive an empty background image value.

3. Security
- No new table or policy is introduced.
- Existing authenticated read access and admin-only write access on `characters` continue to protect the new column.
- Existing private `character-images` storage rules continue to protect uploaded files.

4. Notes
- The column is nullable so existing characters remain valid without a background image.
*/

ALTER TABLE characters ADD COLUMN IF NOT EXISTS background_url text;
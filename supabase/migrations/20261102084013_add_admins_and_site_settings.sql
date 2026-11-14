/*
# Add admins table and editable site settings

1. New Tables
- `admins`: one row per site administrator. Holds the auth user id of each admin.
  - Seeded with the admin account (sookpje@gmail.com). The viewer account is intentionally not added.
- `site_settings`: a single row (id = 1) holding the editable site text.
  - `title` (1-40 characters), `subtitle` (up to 80), `intro` (up to 500).
  - Seeded with the current site title and a default subtitle.

2. Modified Tables
- `characters`: admins may update rows. No insert or delete access is granted.

3. Security
- Row level security is enabled on `admins` and `site_settings`.
- `admins`: a signed-in user can read only their own row. No client writes are allowed.
- `site_settings`: every signed-in user can read it. Only admins (rows in `admins`) can update it, and only the text columns are writable.
- `characters`: signed-in users keep read-only access. Only admins can update it.
- Admin checks are enforced by the database, not only by the screen.

4. Notes
- Admin membership is checked against `auth.uid()`, so a user cannot grant themselves admin rights.
*/

CREATE TABLE IF NOT EXISTS admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON admins TO authenticated;

DROP POLICY IF EXISTS "select_own_admin_row" ON admins;
CREATE POLICY "select_own_admin_row" ON admins FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

INSERT INTO admins (user_id)
SELECT id FROM auth.users WHERE email = 'sookpje@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS site_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 40),
  subtitle text NOT NULL DEFAULT '' CHECK (char_length(subtitle) <= 80),
  intro text NOT NULL DEFAULT '' CHECK (char_length(intro) <= 500)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON site_settings TO authenticated;
GRANT UPDATE (title, subtitle, intro) ON site_settings TO authenticated;

DROP POLICY IF EXISTS "authenticated_select_site_settings" ON site_settings;
CREATE POLICY "authenticated_select_site_settings" ON site_settings FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

INSERT INTO site_settings (id, title, subtitle, intro)
VALUES (1, '숙의 자캐도감', '오리지널 캐릭터 도감', '')
ON CONFLICT (id) DO NOTHING;

GRANT UPDATE ON characters TO authenticated;

DROP POLICY IF EXISTS "admin_update_characters" ON characters;
CREATE POLICY "admin_update_characters" ON characters FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

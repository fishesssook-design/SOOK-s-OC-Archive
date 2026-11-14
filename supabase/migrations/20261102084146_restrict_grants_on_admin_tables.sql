/*
# Restrict table privileges on characters, admins, and site_settings

1. Summary
- Supabase grants full table access (insert, update, delete) to the public roles by default.
- This migration removes those broad grants and re-grants only what the app needs.

2. Security changes
- `admins`: signed-in users can read (their own row is still limited by the row rule). No writes.
- `site_settings`: signed-in users can read. Only the title, subtitle, and intro columns can be updated, and the row rule limits that to admins.
- `characters`: signed-in users can read. Updates are allowed only through the admin row rule.
- The anonymous role (not signed in) has no access to any of these tables.

3. Notes
- Row level security stays enabled on all three tables. Existing policies are unchanged.
*/

REVOKE ALL ON admins, site_settings, characters FROM anon, authenticated;

GRANT SELECT ON admins TO authenticated;

GRANT SELECT ON site_settings TO authenticated;
GRANT UPDATE (title, subtitle, intro) ON site_settings TO authenticated;

GRANT SELECT ON characters TO authenticated;
GRANT UPDATE ON characters TO authenticated;

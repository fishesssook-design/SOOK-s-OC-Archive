ALTER TABLE characters ADD COLUMN IF NOT EXISTS body_type text NOT NULL DEFAULT '';

ALTER TABLE characters ALTER COLUMN dex_number DROP DEFAULT;
DROP SEQUENCE IF EXISTS characters_dex_number_seq;

CREATE OR REPLACE FUNCTION renumber_character_dex() RETURNS void AS $$
BEGIN
  WITH ordered AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY started_at ASC, id ASC) AS new_dex
    FROM characters
  )
  UPDATE characters c
  SET dex_number = o.new_dex
  FROM ordered o
  WHERE c.id = o.id AND c.dex_number <> o.new_dex;
END;
$$ LANGUAGE plpgsql;

SELECT renumber_character_dex();

CREATE OR REPLACE FUNCTION trigger_renumber_dex() RETURNS trigger AS $$
BEGIN
  PERFORM renumber_character_dex();
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS characters_renumber_after_insert ON characters;
CREATE TRIGGER characters_renumber_after_insert
  AFTER INSERT ON characters
  FOR EACH ROW EXECUTE FUNCTION trigger_renumber_dex();

DROP TRIGGER IF EXISTS characters_renumber_after_update ON characters;
CREATE TRIGGER characters_renumber_after_update
  AFTER UPDATE OF started_at ON characters
  FOR EACH ROW EXECUTE FUNCTION trigger_renumber_dex();

DROP TRIGGER IF EXISTS characters_renumber_after_delete ON characters;
CREATE TRIGGER characters_renumber_after_delete
  AFTER DELETE ON characters
  FOR EACH ROW EXECUTE FUNCTION trigger_renumber_dex();

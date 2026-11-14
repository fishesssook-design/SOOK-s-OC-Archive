DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = 'characters_dex_number_seq') THEN
    CREATE SEQUENCE characters_dex_number_seq;
    PERFORM setval('characters_dex_number_seq', COALESCE((SELECT MAX(dex_number) FROM characters), 0) + 1, false);
  END IF;
END $$;

ALTER SEQUENCE characters_dex_number_seq OWNED BY characters.dex_number;
ALTER TABLE characters ALTER COLUMN dex_number SET DEFAULT nextval('characters_dex_number_seq');
GRANT USAGE ON SEQUENCE characters_dex_number_seq TO authenticated;

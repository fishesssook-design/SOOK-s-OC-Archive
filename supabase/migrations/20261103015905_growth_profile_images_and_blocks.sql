UPDATE characters c
SET growth_profiles = sub.gp
FROM (
  SELECT c2.id,
    jsonb_agg(
      (elem - 'profile' - 'settings') || jsonb_build_object(
        'thumbnail_url', NULL,
        'full_body_url', NULL,
        'profile_blocks', CASE WHEN coalesce(elem->>'profile', '') = '' THEN '[]'::jsonb
          ELSE jsonb_build_array(jsonb_build_object('kind', 'text', 'text', elem->>'profile')) END,
        'settings_blocks', CASE WHEN coalesce(elem->>'settings', '') = '' THEN '[]'::jsonb
          ELSE jsonb_build_array(jsonb_build_object('kind', 'text', 'text', elem->>'settings')) END
      ) ORDER BY ord
    ) AS gp
  FROM characters c2, jsonb_array_elements(c2.growth_profiles) WITH ORDINALITY AS t(elem, ord)
  GROUP BY c2.id
) sub
WHERE c.id = sub.id;

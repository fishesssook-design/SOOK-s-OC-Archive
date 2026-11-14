import { useCallback, useEffect, useState } from 'react';
import { fetchCharacters, type Character } from '@/lib/data';

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[] | null>(null);
  const [error, setError] = useState(false);

  const reload = useCallback(() => {
    return fetchCharacters()
      .then((data) => {
        setError(false);
        setCharacters(data);
      })
      .catch((err: unknown) => {
        console.error('[characters] could not load characters:', err);
        setError(true);
      });
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { characters, error, reload };
}

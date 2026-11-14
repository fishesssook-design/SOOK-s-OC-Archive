import type { CatalogQuery, SearchScope, SortKey } from '@/lib/catalogQuery';
import type { Character } from '@/lib/data';

export interface Neighbors {
  prev: Character | null;
  next: Character | null;
}

export function getKeywordOptions(characters: Character[]): string[] {
  const keywords = new Set<string>();
  characters.forEach((character) => {
    if (character.is_public) character.keywords.forEach((keyword) => keywords.add(keyword));
  });
  return [...keywords].sort((a, b) => a.localeCompare(b, 'ko'));
}

function compareCharacters(sort: SortKey): (a: Character, b: Character) => number {
  if (sort === 'name') return (a, b) => a.name.localeCompare(b.name, 'ko');
  return (a, b) => a.started_at.localeCompare(b.started_at);
}

function matchesTerm(character: Character, term: string, scope: SearchScope): boolean {
  if (character.name.toLowerCase().includes(term)) return true;
  if (scope === 'name') return false;

  const contentFields = [
    character.catchphrase,
    character.job,
    character.species,
    character.personality,
    character.features,
    character.details,
    ...character.keywords,
  ];
  return contentFields.some((field) => field.toLowerCase().includes(term));
}

export function applyCatalogQuery(characters: Character[], query: CatalogQuery): Character[] {
  const term = query.q.trim().toLowerCase();
  const isFiltering = term !== '' || query.keywords.length > 0;

  const publicMatches = characters
    .filter((character) => character.is_public)
    .filter((character) => !term || matchesTerm(character, term, query.scope))
    .filter((character) => query.keywords.every((keyword) => character.keywords.includes(keyword)))
    .sort(compareCharacters(query.sort));

  if (isFiltering) return publicMatches;

  const locked = characters
    .filter((character) => !character.is_public)
    .sort((a, b) => a.dex_number - b.dex_number);

  return [...publicMatches, ...locked];
}

export function getNeighbors(orderedList: Character[], id: number): Neighbors {
  const index = orderedList.findIndex((character) => character.id === id);
  if (index < 0) return { prev: null, next: null };

  return {
    prev: index > 0 ? orderedList[index - 1] : null,
    next: index < orderedList.length - 1 ? orderedList[index + 1] : null,
  };
}

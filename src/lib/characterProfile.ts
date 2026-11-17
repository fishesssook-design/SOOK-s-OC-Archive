import type { Character } from '@/lib/data';

export interface ProfileRow {
  label: string;
  value: string;
}

export function buildProfileRows(character: Character, age: string): ProfileRow[] {
  return [
    { label: '성별', value: character.gender || '여성' },
    { label: '나이', value: age || '20세' },
    { label: '종족', value: character.species || '인간' },
    { label: '신장', value: character.height || '170cm' },
    { label: '체형', value: character.body_type || '보통' },
    { label: '직업', value: character.job || '작가' },
  ];
}

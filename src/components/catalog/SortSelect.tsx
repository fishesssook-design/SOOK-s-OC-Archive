import type { SortKey } from '@/lib/catalogQuery';

interface Props {
  value: SortKey;
  onChange: (value: SortKey) => void;
}

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'name', label: '이름순' },
  { value: 'started', label: '활동 시작일순' },
];

export function SortSelect({ value, onChange }: Props) {
  return (
    <select
      aria-label="정렬"
      value={value}
      onChange={(event) => onChange(event.target.value as SortKey)}
      className="h-11 rounded-full border border-zinc-300 bg-white px-4 text-sm outline-none transition focus:border-yellow-400"
    >
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

import { LayoutGrid, List, type LucideIcon } from 'lucide-react';
import type { ViewMode } from '@/lib/catalogQuery';

interface Props {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

const OPTIONS: { value: ViewMode; label: string; Icon: LucideIcon }[] = [
  { value: 'grid', label: '그리드 보기', Icon: LayoutGrid },
  { value: 'list', label: '리스트 보기', Icon: List },
];

export function ViewToggle({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="보기 방식"
      className="flex h-11 shrink-0 items-center gap-1 rounded-full border border-zinc-300 bg-white p-1"
    >
      {OPTIONS.map(({ value: optionValue, label, Icon }) => {
        const active = optionValue === value;
        return (
          <button
            key={optionValue}
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={() => onChange(optionValue)}
            className={`flex h-9 w-10 items-center justify-center rounded-full transition ${
              active ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

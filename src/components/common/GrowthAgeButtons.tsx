interface Props {
  ages: number[];
  onSelect: (age: number) => void;
  activeAge?: number;
  className?: string;
}

export function GrowthAgeButtons({ ages, onSelect, activeAge, className = '' }: Props) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {ages.map((age) => {
        const active = age === activeAge;
        return (
          <li key={age}>
            <button
              type="button"
              onClick={() => onSelect(age)}
              aria-current={active ? 'page' : undefined}
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm transition ${
                active
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-300 bg-white/95 text-zinc-900 hover:border-yellow-400 hover:bg-yellow-50'
              }`}
            >
              {age}세
            </button>
          </li>
        );
      })}
    </ul>
  );
}

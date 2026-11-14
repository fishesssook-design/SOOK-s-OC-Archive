interface Props {
  options: string[];
  selected: string[];
  onChange: (keywords: string[]) => void;
}

export function KeywordFilter({ options, selected, onChange }: Props) {
  if (options.length === 0) return null;

  const toggle = (keyword: string) => {
    onChange(
      selected.includes(keyword)
        ? selected.filter((item) => item !== keyword)
        : [...selected, keyword],
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-zinc-500">키워드 (모두 포함)</span>
      {options.map((keyword) => {
        const active = selected.includes(keyword);
        return (
          <button
            key={keyword}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(keyword)}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              active
                ? 'border-yellow-400 bg-yellow-400 font-semibold text-zinc-900'
                : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900'
            }`}
          >
            {keyword}
          </button>
        );
      })}
      {selected.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="px-2 py-1 text-sm text-zinc-500 underline underline-offset-4 transition hover:text-zinc-900"
        >
          전체 해제
        </button>
      )}
    </div>
  );
}

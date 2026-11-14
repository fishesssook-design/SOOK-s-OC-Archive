import { Search, X } from 'lucide-react';
import type { CatalogQuery, SearchScope } from '@/lib/catalogQuery';
import { KeywordFilter } from '@/components/catalog/KeywordFilter';

interface Props {
  query: CatalogQuery;
  count: number;
  keywordOptions: string[];
  onChange: (patch: Partial<CatalogQuery>) => void;
  onClose: () => void;
}

const SCOPE_OPTIONS: { value: SearchScope; label: string }[] = [
  { value: 'name', label: '이름' },
  { value: 'content', label: '이름 + 내용' },
];

export function CatalogSearchPanel({ query, count, keywordOptions, onChange, onClose }: Props) {
  return (
    <section className="mb-6 space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">캐릭터 검색</span>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query.q}
            onChange={(event) => onChange({ q: event.target.value })}
            placeholder="검색어를 입력하세요"
            className="h-11 w-full rounded-full border border-zinc-300 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300/60"
          />
        </label>
        <label className="shrink-0">
          <span className="sr-only">검색 범위</span>
          <select
            value={query.scope}
            onChange={(event) => onChange({ scope: event.target.value as SearchScope })}
            className="h-11 cursor-pointer rounded-full border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 outline-none transition hover:border-zinc-900 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300/60"
          >
            {SCOPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          aria-label="검색 닫기 및 초기화"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p className="text-sm text-zinc-700">
        {query.q ? (
          <>
            <span className="font-semibold text-zinc-900">“{query.q}”</span> 검색 결과 {count}명
          </>
        ) : (
          <>전체 {count}명</>
        )}
      </p>
      <KeywordFilter
        options={keywordOptions}
        selected={query.keywords}
        onChange={(keywords) => onChange({ keywords })}
      />
    </section>
  );
}
